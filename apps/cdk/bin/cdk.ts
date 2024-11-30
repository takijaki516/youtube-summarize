#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";

import { EcsFargateStack } from "../lib/stacks/ecs-fargate-stack";
import { VpcStack } from "../lib/stacks/vpc-stack";

import { resolve } from "path";
import * as dotenv from "dotenv";

dotenv.config({
  path: resolve(__dirname, "../.env"),
});

const app = new cdk.App();

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const vpcStack = new VpcStack(app, "VpcStack", { env });

const ecsFargateStack = new EcsFargateStack(app, "EcsFargateStack", {
  env,
  vpc: vpcStack.vpc,
});

// Add dependencies
ecsFargateStack.addDependency(vpcStack);
