import * as path from "path";
import { Construct } from "constructs";
import {
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
} from "aws-cdk-lib";
import * as apigwv2 from "@aws-cdk/aws-apigatewayv2-alpha";
import {
  HttpAlbIntegration,
  HttpUrlIntegration,
} from "@aws-cdk/aws-apigatewayv2-integrations-alpha";
import { Secret } from "aws-cdk-lib/aws-secretsmanager";
import { envSpecificName, getDeploymentEnv } from "./utils";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";

// Constants
const PG_PORT = 5432;
const PG_DATABASE = "eatr_db";

// Service Stack
export class EatrServiceStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Frontend
    // S3 bucket -> storing static files
    // cdn infront of bucket
    //

    const websiteBucket = new s3.Bucket(
      this,
      envSpecificName("eatrfrontend-bucket"),
      {
        websiteIndexDocument: "index.html",
        removalPolicy: RemovalPolicy.DESTROY,
        autoDeleteObjects: true,
        publicReadAccess: true,
        blockPublicAccess: s3.BlockPublicAccess.BLOCK_ACLS,
        accessControl: s3.BucketAccessControl.BUCKET_OWNER_FULL_CONTROL,
      }
    );

    const originAccessIdentity = new cloudfront.OriginAccessIdentity(
      this,
      envSpecificName("eatr-frontend-origin-access")
    );
    websiteBucket.grantRead(originAccessIdentity);

    // Cloudfront Distribution
    const dist = new cloudfront.Distribution(
      this,
      envSpecificName("eatr-frontend-dist"),
      {
        defaultRootObject: "index.html",
        errorResponses: [
          {
            httpStatus: 404,
            responseHttpStatus: 200,
            responsePagePath: "/index.html",
          },
        ],
        defaultBehavior: {
          // origin: new origins.S3Origin(websiteBucket, {originAccessIdentity}),
          origin: new origins.S3Origin(websiteBucket),
        },
      }
    );

    new CfnOutput(this, envSpecificName("cloudfront-url"), {
      value: dist.domainName,
      description: "The URL of the cloudfront distribution.",
      exportName: envSpecificName("cloudfront-url"),
    });

    new s3deploy.BucketDeployment(this, "deploy-eatr-frontent", {
      sources: [s3deploy.Source.asset(path.join(__dirname, "/../dist"))],
      distribution: dist,
      destinationBucket: websiteBucket,
    });

    const vpc = ec2.Vpc.fromLookup(this, "vpc", {
      tags: {
        service: envSpecificName("eatr-backend-lb"),
      },
    });

    const listener = elbv2.ApplicationListener.fromLookup(this, "listener", {
      loadBalancerTags: {
        service: envSpecificName("eatr-backend-lb"),
      },
    });

    const api = new apigwv2.HttpApi(this, envSpecificName("eatr-ingress-api"), {
      description: "Frontend gateway for eatr application",
      defaultIntegration: new HttpUrlIntegration(
        "cloudfront-proxy",
        `https://${dist.domainName}`
      ),
    });
    const vpcLink = new apigwv2.VpcLink(this, "vpc-link", { vpc });

    // Create backend route
    const albIntegration = new HttpAlbIntegration("alb-proxy", listener, {
      vpcLink,
    });
    api.addRoutes({
      path: "/api/v1/{proxy+}",
      methods: [
        apigwv2.HttpMethod.GET,
        apigwv2.HttpMethod.POST,
        apigwv2.HttpMethod.PUT,
        apigwv2.HttpMethod.DELETE,
      ],
      integration: albIntegration,
    });

    new CfnOutput(this, envSpecificName("api-url"), {
      value: api.url || "",
      description: "The URL of the API gateway.",
      exportName: envSpecificName("api-url"),
    });
  }
}
