#!/usr/bin/env node
import 'source-map-support/register';
import { App, Tags } from 'aws-cdk-lib';
import { VaultInfraStack } from '../lib/app-infra-stack';
import { VaultServiceStack } from '../lib/app-service-stack';
import { VaultDbStack } from '../lib/app-db-stack';
import { Constants } from '../common';

const app = new App();
const env = {
  account: Constants.account,
  region: Constants.region,
};

const appName = app.node.tryGetContext("APP_NAME");

Tags.of(app).add('application', appName);

new VaultInfraStack(app, 'VaultInfraStack', { env });

new VaultServiceStack(app, 'VaultServiceStack', { env });

new VaultDbStack(app, 'VaultDbStack', { env });
