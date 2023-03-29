import * as path from 'path';
import * as lambda from '@aws-cdk/aws-lambda';

import {Construct} from 'constructs';
import {Stack, StackProps, Duration, aws_apigateway as apigateway} from 'aws-cdk-lib';
import {NodejsFunction} from 'aws-cdk-lib/aws-lambda-nodejs';

import {envSpecificName} from '../lib/utils';

const METHOD_GET = 'GET';
const METHOD_POST = 'POST';
const METHOD_PUT = 'PUT';
const METHOD_DELETE = 'DELETE';

// Constants
const LAMBDA_FN_TIMEOUT_SECONDS = 5;

// Service Stack
export class EatrServiceStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    /** Lambda functions */

    const commonLambda = {
      runtime: lambda.Runtime.NODEJS_16_X,
      timeout: Duration.seconds(LAMBDA_FN_TIMEOUT_SECONDS),
      bundling: {
        minify: true,
        externalModules: ['aws-sdk'],
      },
    };

    // Test Function
    const testFn = new NodejsFunction(this, 'TestFunction', {
      ...commonLambda,
      entry: path.join(__dirname, '/../src/service/lambda/lambda-test.ts'), // accepts .js, .jsx, .ts, .tsx and .mjs files
      handler: 'lambdaHandler', // defaults to 'handler'
    });

    /** API Gateway */

    const api = new apigateway.RestApi(this, envSpecificName('eatr-api'), {
      description: 'Primary API gateway for eatr application',
      deployOptions: {
        stageName: 'api',
        tracingEnabled: true,
        dataTraceEnabled: true,
      },
      binaryMediaTypes: ['*/*'],
    });

    /** Integrate Lambda Fns with API Gateway */

    const v1 = api.root.addResource('v1');

    const test = v1.addResource('test');

    test.addMethod(METHOD_POST, new apigateway.LambdaIntegration(testFn));
  }
}
