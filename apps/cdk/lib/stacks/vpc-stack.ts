import * as cdk from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";

interface VpcStackProps extends cdk.StackProps {}

export class VpcStack extends cdk.Stack {
  public readonly vpc: ec2.Vpc;

  constructor(scope: cdk.App, id: string, props?: VpcStackProps) {
    super(scope, id, props);

    this.vpc = new ec2.Vpc(this, "YoutubeSummarizeVPC", {
      maxAzs: 2,
      natGateways: 1, // single NAT gateway for both private subnets, since NAT gateway is expensive
    });
  }
}
