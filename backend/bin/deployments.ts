#!/usr/bin/env node
import {App} from 'aws-cdk-lib';
import {EatrServiceStack} from '../lib/deployments-stack';
import {getDeploymentEnv, envSpecificName} from '../lib/utils';

const app = new App();
new EatrServiceStack(app, envSpecificName('eatr-service-stack'), {
  tags: {
    environment: getDeploymentEnv(),
  },
});
