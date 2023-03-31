import * as path from 'path';
import * as lambda from '@aws-cdk/aws-lambda';
import {Construct} from 'constructs';
import {Stack, StackProps, Duration, aws_apigateway as apigateway} from 'aws-cdk-lib';
import {NodejsFunction} from 'aws-cdk-lib/aws-lambda-nodejs';
import {HttpApi, HttpMethod} from '@aws-cdk/aws-apigatewayv2-alpha';
import {HttpLambdaIntegration} from '@aws-cdk/aws-apigatewayv2-integrations-alpha';

import {handler} from '../src/app';
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
      handler: 'handler', // defaults to 'handler'
    });

    const testIntegration = new HttpLambdaIntegration('TestIntegration', testFn);

    /** API Gateway */

    // const api = new apigateway.RestApi(this, envSpecificName('eatr-api'), {
    //   description: 'Primary API gateway for eatr application',
    //   deployOptions: {
    //     stageName: 'api',
    //     tracingEnabled: true,
    //     dataTraceEnabled: true,
    //   },
    //   binaryMediaTypes: ['*/*'],
    // });
    /** Integrate Lambda Fns with API Gateway */

    // const v1 = api.root.addResource('v1');

    // const test = v1.addResource('test');

    // test.addMethod(METHOD_GET, new apigateway.LambdaIntegration(testFn));

    const eatrService = new NodejsFunction(this, 'EatrService', {
      ...commonLambda,
      entry: path.join(__dirname, '/../src/app.ts'),
      handler: 'handler',
      bundling: {
        minify: true,
        externalModules: ['pg-native', 'aws-cdk'],
      },
    });

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
