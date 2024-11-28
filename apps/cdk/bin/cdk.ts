#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";

import { RdsStack } from "../lib/stacks/rds-stack";
import { EcsFargateStack } from "../lib/stacks/ecs-fargate-stack";

const app = new cdk.App();

const vpc = new ec2.Vpc(app, "YoutubeSummarizeVPC", {
  maxAzs: 2,
  natGateways: 1,
});

const rdsStack = new RdsStack(app, "RdsStack", { vpc });
const ecsFargateStack = new EcsFargateStack(app, "EcsFargateStack", {
  dbInstance: rdsStack.dbInstance,
  dbSecrets: rdsStack.dbSecrets,
  vpc,
});

// Add dependency
ecsFargateStack.addDependency(rdsStack);
