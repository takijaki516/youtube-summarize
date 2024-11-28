import { Construct } from "constructs";
import * as route53 from "aws-cdk-lib/aws-route53";
import * as route53_targets from "aws-cdk-lib/aws-route53-targets";
import * as certificatemanager from "aws-cdk-lib/aws-certificatemanager";
import * as cdk from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as ecs_patterns from "aws-cdk-lib/aws-ecs-patterns";
import * as rds from "aws-cdk-lib/aws-rds";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";
import * as ecr from "aws-cdk-lib/aws-ecr";

interface EcsFargateStackProps extends cdk.StackProps {
  dbInstance: rds.DatabaseInstance;
  dbSecrets: secretsmanager.Secret;
  vpc: ec2.Vpc;
}

export class EcsFargateStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: EcsFargateStackProps) {
    super(scope, id, props);

    // VPC
    const vpc = props.vpc;

    const cluster = new ecs.Cluster(this, "YoutubeSummarizeCluster", {
      vpc,
      containerInsights: true,
    });

    // Route53 zone
    const zone = route53.HostedZone.fromLookup(this, "Zone", {
      domainName: "taekgogo.com", // Replace with your domain
    });

    // TLS certificate
    const certificate = new certificatemanager.Certificate(
      this,
      "Certificate",
      {
        domainName: "app.taekgogo.com", // Replace with your subdomain
        validation: certificatemanager.CertificateValidation.fromDns(zone),
      }
    );

    // Allow ECS tasks to access RDS
    props.dbInstance.connections.allowFrom(
      cluster.connections,
      ec2.Port.tcp(5432),
      "Allow access from ECS tasks"
    );

    // Add ECR repository
    const repository = new ecr.Repository(this, "YoutubeSummarizeRepo", {
      repositoryName: "youtube-summarize",
      removalPolicy: cdk.RemovalPolicy.DESTROY, // For dev/test. Use RETAIN for prod
      imageScanOnPush: true,
    });

    // Update Fargate service to use ECR
    const fargateService =
      new ecs_patterns.ApplicationLoadBalancedFargateService(
        this,
        "YoutubeSummarizeService",
        {
          cluster,
          memoryLimitMiB: 2048,
          cpu: 1024,
          desiredCount: 1,
          taskImageOptions: {
            image: ecs.ContainerImage.fromEcrRepository(repository, "latest"),
            containerPort: 3000,
            // TODO: 
            environment: {
              NODE_ENV: "production",
              DB_HOST: props.dbInstance.instanceEndpoint.hostname,
              DB_PORT: "5432",
              DB_NAME: "youtube_summarize",
            },
            secrets: {
              DB_CREDENTIALS: ecs.Secret.fromSecretsManager(props.dbSecrets),
            },
          },
          publicLoadBalancer: true,
          certificate: certificate,
          redirectHTTP: true,
        }
      );

    // autoscale
    const scaling = fargateService.service.autoScaleTaskCount({
      minCapacity: 1,
      maxCapacity: 4,
    });

    scaling.scaleOnCpuUtilization("CpuScaling", {
      targetUtilizationPercent: 70,
      scaleInCooldown: cdk.Duration.seconds(60),
      scaleOutCooldown: cdk.Duration.seconds(60),
    });

    new cdk.CfnOutput(this, "LoadBalancerDNS", {
      value: fargateService.loadBalancer.loadBalancerDnsName,
    });

    // Add Route53 alias record
    new route53.ARecord(this, "AliasRecord", {
      zone,
      target: route53.RecordTarget.fromAlias(
        new route53_targets.LoadBalancerTarget(fargateService.loadBalancer)
      ),
      recordName: "app.taekgogo.com", // Replace with your subdomain
    });

    // Add ECR repository URL as output for GitHub Actions
    new cdk.CfnOutput(this, "EcrRepositoryUri", {
      value: repository.repositoryUri,
    });
  }
}
