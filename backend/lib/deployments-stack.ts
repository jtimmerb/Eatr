import * as path from 'path';
import {Construct} from 'constructs';
import {
  Stack,
  StackProps,
  Duration,
  RemovalPolicy,
  aws_apigateway as apigateway,
  aws_rds as rds,
  aws_lambda as lambda,
  aws_ec2 as ec2,
  aws_iam as iam,
} from 'aws-cdk-lib';
import {Secret} from 'aws-cdk-lib/aws-secretsmanager';
import {NodejsFunction} from 'aws-cdk-lib/aws-lambda-nodejs';
import {HttpApi, HttpMethod} from '@aws-cdk/aws-apigatewayv2-alpha';
import {HttpLambdaIntegration} from '@aws-cdk/aws-apigatewayv2-integrations-alpha';

const METHOD_GET = 'GET';
const METHOD_POST = 'POST';
const METHOD_PUT = 'PUT';
const METHOD_DELETE = 'DELETE';
const PG_PORT = 5432;
const PG_DATABASE = 'eatr_db';

// Constants
const LAMBDA_FN_TIMEOUT_SECONDS = 5;

// Service Stack
export class EatrServiceStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    /** RDS */
    const engine = rds.DatabaseInstanceEngine.postgres({version: rds.PostgresEngineVersion.VER_15_2});
    const instanceType = ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO);

    // Create master user detail secrets
    const masterUserSecret = new Secret(this, 'eatr_master_user_secret', {
      secretName: 'eatr_master_user_secret',
      description: 'DB master credentials',
      generateSecretString: {
        secretStringTemplate: JSON.stringify({username: 'postgres'}),
        generateStringKey: 'password',
        includeSpace: false,
        excludePunctuation: true,
      },
    });

    // get VPC
    //const myVpc = ec2.Vpc.fromLookup(this, 'eatr-vpc', {vpcId: 'vpc-0fe90249bef0528ca'});

    const myVpc = new ec2.Vpc(this, 'eatr-vpc', {
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

    // create secruity group for eatr
    const dbSecurityGroup = new ec2.SecurityGroup(this, 'eatr-db-sg', {
      securityGroupName: 'eatr-db-sg',
      vpc: myVpc,
    });

    // add inbound rule
    dbSecurityGroup.addIngressRule(
      ec2.Peer.ipv4(myVpc.vpcCidrBlock),
      ec2.Port.tcp(PG_PORT),
      `Allow port ${PG_PORT} connection from only within the vpc`,
    );

    // RDS instance
    const dbInstance = new rds.DatabaseInstance(this, 'eatr-postgres-db', {
      vpc: myVpc,
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

    /** Lambda functions */
    const commonLambda = {
      runtime: lambda.Runtime.NODEJS_16_X,
      timeout: Duration.seconds(LAMBDA_FN_TIMEOUT_SECONDS),
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
      vpc: myVpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
      },
      securityGroups: [dbSecurityGroup],
      environment: {
        SECRET_NAME: masterUserSecret.secretArn,
      },
    });
    masterUserSecret.grantRead(initializeLambda);
    dbInstance.connections.allowFrom(initializeLambda, ec2.Port.tcp(PG_PORT));

    // Eatr Service
    const eatrService = new NodejsFunction(this, 'EatrService', {
      ...commonLambda,
      entry: path.join(__dirname, '/../src/app.ts'),
      handler: 'handler',
      vpc: myVpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
      },
      securityGroups: [dbSecurityGroup],
      environment: {
        PG_SECRET_NAME: masterUserSecret.secretArn,
      },
    });

    masterUserSecret.grantRead(eatrService);
    dbInstance.connections.allowFrom(eatrService, ec2.Port.tcp(PG_PORT));

    const eatrServiceIntegration = new HttpLambdaIntegration('EatrServiceIntegration', eatrService);

    const httpApi = new HttpApi(this, 'HttpApi');

    httpApi.addRoutes({
      path: '/api/v1',
      methods: [HttpMethod.ANY],
      integration: eatrServiceIntegration,
    });
    httpApi.addRoutes({
      path: '/api/v1/{proxy+}',
      methods: [HttpMethod.ANY],
      integration: eatrServiceIntegration,
    });
  }
}
