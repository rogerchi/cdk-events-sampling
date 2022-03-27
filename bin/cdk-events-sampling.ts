#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { MainEventBusStack } from '../lib/main-stack';
import { EndToEndTestingStack } from '../lib/end-to-end-testing-stack';
import { ReplicationStack } from '../lib/replication-stack';

const app = new cdk.App();

const prodStack = new MainEventBusStack(app, 'prodStack', { envName: 'prod' });
const dev01Stack = new MainEventBusStack(app, 'dev01Stack', {
  envName: 'dev01',
});
const e2eStack = new EndToEndTestingStack(app, 'endToEndStack');

new ReplicationStack(app, 'replication', {
  sourceEventBus: prodStack.eventBus,
  targetEventBuses: [dev01Stack.eventBus, e2eStack.eventBus],
  percentage: 0.03,
});
