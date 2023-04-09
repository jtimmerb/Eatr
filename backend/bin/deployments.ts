#!/usr/bin/env node
import {App} from 'aws-cdk-lib';
import {EatrServiceStack} from '../lib/deployments-stack';
import {getDeploymentEnv, envSpecificName} from '../lib/utils';

const app = new App();
new EatrServiceStack(app, envSpecificName('eatr-service-stack'), {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
  tags: {
    environment: getDeploymentEnv(),
  },
});
