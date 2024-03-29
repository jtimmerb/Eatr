import * as path from 'path';
import {Construct} from 'constructs';
import {
  Tags,
  Stack,
  StackProps,
  Duration,
  RemovalPolicy,
  CfnOutput,
  aws_rds as rds,
  aws_ec2 as ec2,
  aws_ecs as ecs,
  aws_ecr_assets as assets,
  aws_elasticloadbalancingv2 as elbv2,
  aws_lambda as lambda,
  aws_iam as iam,
  aws_s3 as s3,
  aws_s3_deployment as s3deploy,
  aws_cloudfront as cloudfront,
  aws_cloudfront_origins as origins,
  aws_apigateway as apigateway,
} from 'aws-cdk-lib';
import * as apigwv2 from '@aws-cdk/aws-apigatewayv2-alpha';
import {HttpAlbIntegration, HttpUrlIntegration} from '@aws-cdk/aws-apigatewayv2-integrations-alpha';
import {Secret} from 'aws-cdk-lib/aws-secretsmanager';
import {envSpecificName, getDeploymentEnv} from './utils';
import {NodejsFunction} from 'aws-cdk-lib/aws-lambda-nodejs';

// Constants
const PG_PORT = 5432;
const PG_DATABASE = 'eatr_db';

// Service Stack
export class EatrServiceStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    /** RDS */
    const engine = rds.DatabaseInstanceEngine.postgres({version: rds.PostgresEngineVersion.VER_15_2});
    const instanceType = ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO);

    // Create master user detail secrets
    const masterUserSecret = new Secret(this, 'eatr_master_user_secret', {
      secretName: envSpecificName('eatr_master_user_secret'),
      description: 'DB master credentials',
      generateSecretString: {
        secretStringTemplate: JSON.stringify({username: 'postgres'}),
        generateStringKey: 'password',
        includeSpace: false,
        excludePunctuation: true,
      },
    });

    // get VPC
    const vpc = new ec2.Vpc(this, 'eatr-vpc', {
      natGateways: 1,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'Private',
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        },
        {
          cidrMask: 24,
          name: 'PrivateWithEgress',
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
        },
        {
          cidrMask: 24,
          name: 'Public',
          subnetType: ec2.SubnetType.PUBLIC,
        },
      ],
    });
    Tags.of(vpc).add('service', envSpecificName('eatr-backend-lb'));

    // create secruity group for eatr
    const dbSecurityGroup = new ec2.SecurityGroup(this, 'eatr-db-sg', {
      securityGroupName: envSpecificName('eatr-db-sg'),
      vpc: vpc,
    });

    // add inbound rule
    dbSecurityGroup.addIngressRule(
      ec2.Peer.ipv4(vpc.vpcCidrBlock),
      ec2.Port.tcp(PG_PORT),
      `Allow port ${PG_PORT} connection from only within the vpc`,
    );

    // RDS instance
    const dbInstance = new rds.DatabaseInstance(this, 'eatr-postgres-db', {
      vpc: vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
      },
      instanceType: instanceType,
      engine: engine,
      port: PG_PORT,
      securityGroups: [dbSecurityGroup],
      databaseName: PG_DATABASE,
      credentials: rds.Credentials.fromSecret(masterUserSecret),
      backupRetention: Duration.days(0),
      deleteAutomatedBackups: true,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // Create an ECS cluster
    const cluster = new ecs.Cluster(this, 'Cluster', {vpc: vpc});

    // Add capacity to it
    cluster.addCapacity('DefaultAutoScalingGroupCapacity', {
      instanceType: instanceType,
      desiredCapacity: 3,
    });

    const taskDefinition = new ecs.FargateTaskDefinition(this, 'EatrTask');

    const container = taskDefinition.addContainer('DefaultContainer', {
      image: ecs.ContainerImage.fromAsset(path.join(__dirname, '/../'), {
        platform: assets.Platform.LINUX_AMD64,
      }),
      // image: ecs.ContainerImage.fromEcrRepository(repository, imageTag),
      portMappings: [{containerPort: 8080, hostPort: 8080}],
      environment: {
        PORT: (8080).toString(),
        PGSSLMODE: 'no-verify',
      },
      secrets: {
        PG_CREDENTIALS: ecs.Secret.fromSecretsManager(masterUserSecret),
      },
      memoryLimitMiB: 512,
      logging: ecs.LogDrivers.awsLogs({streamPrefix: envSpecificName('eatr-backend-svc')}),
    });

    masterUserSecret.grantRead(taskDefinition.taskRole);
    if (taskDefinition.executionRole) masterUserSecret.grantRead(taskDefinition.executionRole);
    dbInstance.connections.allowFromAnyIpv4(ec2.Port.tcp(PG_PORT));

    // Instantiate an Amazon ECS Service
    const ecsService = new ecs.FargateService(this, 'Service', {
      cluster: cluster,
      taskDefinition: taskDefinition,
      securityGroups: [dbSecurityGroup],
      assignPublicIp: true,
      desiredCount: 1,
    });

    dbInstance.connections.allowFrom(ecsService, ec2.Port.tcp(PG_PORT));

    const lb = new elbv2.ApplicationLoadBalancer(this, 'LB', {
      vpc,
      internetFacing: true,
      loadBalancerName: envSpecificName('eatr-backend-lb'),
    });
    const listener = lb.addListener('container', {port: 80});
    ecsService.registerLoadBalancerTargets({
      containerName: container.containerName,
      containerPort: 8080,
      newTargetGroupId: 'ECS',
      listener: ecs.ListenerConfig.applicationListener(listener, {
        protocol: elbv2.ApplicationProtocol.HTTP,
        healthCheck: {
          path: '/api/v1',
          healthyHttpCodes: '200-499',
        },
      }),
    });
    Tags.of(lb).add('service', envSpecificName('eatr-backend-lb'));

    /** Lambda functions */
    const commonLambda = {
      runtime: lambda.Runtime.NODEJS_16_X,
      bundling: {
        minify: true,
        externalModules: ['aws-sdk', 'pg-native'],
      },
    };

    // Initialization function for PostgreSQL database
    const initializeLambda = new NodejsFunction(this, 'InitializeTableLambda', {
      ...commonLambda,
      entry: path.join(__dirname, '/../src/service/lambda/init-table-lambda.ts'), // accepts .js, .jsx, .ts, .tsx and .mjs files
      handler: 'lambdaTableHandler', // defaults to 'handler'
      vpc: vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
      },
      securityGroups: [dbSecurityGroup],
      environment: {
        PG_SECRET_NAME: masterUserSecret.secretArn,
      },
    });

    initializeLambda.role?.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('SecretsManagerReadWrite'));
    masterUserSecret.grantRead(initializeLambda);
    dbInstance.connections.allowFrom(initializeLambda, ec2.Port.tcp(PG_PORT));
  }
}
