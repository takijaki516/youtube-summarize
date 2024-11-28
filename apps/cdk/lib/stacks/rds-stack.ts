import * as cdk from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as rds from "aws-cdk-lib/aws-rds";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";
import { Construct } from "constructs";

interface RdsStackProps extends cdk.StackProps {
  vpc: ec2.IVpc;
}

export class RdsStack extends cdk.Stack {
  public readonly dbInstance: rds.DatabaseInstance;
  public readonly dbSecrets: secretsmanager.Secret;

  constructor(scope: Construct, id: string, props: RdsStackProps) {
    super(scope, id, props);

    // Create DB security group
    const dbSecurityGroup = new ec2.SecurityGroup(this, "DbSecurityGroup", {
      vpc: props.vpc,
      description: "Security group for RDS instance",
    });

    // Create DB credentials in Secrets Manager
    this.dbSecrets = new secretsmanager.Secret(this, "DbCredentials", {
      generateSecretString: {
        secretStringTemplate: JSON.stringify({ username: "postgres" }),
        generateStringKey: "password",
        excludePunctuation: true,
      },
    });

    // Create RDS instance
    this.dbInstance = new rds.DatabaseInstance(this, "DbInstance", {
      vpc: props.vpc,
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
      engine: rds.DatabaseInstanceEngine.postgres({
        version: rds.PostgresEngineVersion.VER_16,
      }),
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T3,
        ec2.InstanceSize.MICRO
      ),
      credentials: rds.Credentials.fromSecret(this.dbSecrets),
      securityGroups: [dbSecurityGroup],
      multiAz: false,
      allocatedStorage: 20,
      maxAllocatedStorage: 100,
      deleteAutomatedBackups: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // for dev
    });

    // Output the DB endpoint
    new cdk.CfnOutput(this, "DbEndpoint", {
      value: this.dbInstance.instanceEndpoint.hostname,
    });
  }
}
