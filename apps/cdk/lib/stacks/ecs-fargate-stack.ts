import { Construct } from "constructs";
import * as route53 from "aws-cdk-lib/aws-route53";
import * as route53_targets from "aws-cdk-lib/aws-route53-targets";
import * as certificatemanager from "aws-cdk-lib/aws-certificatemanager";
import * as cdk from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as ecs_patterns from "aws-cdk-lib/aws-ecs-patterns";
import * as ecr from "aws-cdk-lib/aws-ecr";
import * as secretsManager from "aws-cdk-lib/aws-secretsmanager";
import * as iam from "aws-cdk-lib/aws-iam";

interface EcsFargateStackProps extends cdk.StackProps {
  vpc: ec2.Vpc;
}

export class EcsFargateStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: EcsFargateStackProps) {
    super(scope, id, props);

    const openAiSecret = new secretsManager.Secret(this, "OpenAiApiKeySecret", {
      secretStringValue: cdk.SecretValue.unsafePlainText(
        process.env.OPENAI_API_KEY!
      ),
    });

    const authSecret = new secretsManager.Secret(this, "AuthSecretSecret", {
      secretStringValue: cdk.SecretValue.unsafePlainText(
        process.env.AUTH_SECRET!
      ),
    });

    const authGoogleIdSecret = new secretsManager.Secret(
      this,
      "AuthGoogleIdSecret",
      {
        secretStringValue: cdk.SecretValue.unsafePlainText(
          process.env.AUTH_GOOGLE_ID!
        ),
      }
    );

    const authGoogleSecret = new secretsManager.Secret(
      this,
      "AuthGoogleSecretSecret",
      {
        secretStringValue: cdk.SecretValue.unsafePlainText(
          process.env.AUTH_GOOGLE_SECRET!
        ),
      }
    );

    const databaseUrlSecret = new secretsManager.Secret(
      this,
      "DatabaseUrlSecret",
      {
        secretStringValue: cdk.SecretValue.unsafePlainText(
          process.env.DATABASE_URL!
        ),
      }
    );


    // VPC
    const vpc = props.vpc;

    const cluster = new ecs.Cluster(this, "YoutubeSummarizeCluster", {
      vpc,
      containerInsights: true,
    });

    // Route53 zone
    const zone = route53.HostedZone.fromLookup(this, "HostedZone", {
      domainName: "taekgogo.com",
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

    // create task role
    const executionRole = new iam.Role(
      this,
      "YoutubeSummarizeTaskExecutionRole",
      {
        assumedBy: new iam.ServicePrincipal("ecs-tasks.amazonaws.com"),
        managedPolicies: [
          iam.ManagedPolicy.fromAwsManagedPolicyName(
            "service-role/AmazonECSTaskExecutionRolePolicy"
          ),
        ],
      }
    );

    const taskRole = new iam.Role(this, "YoutubeSummarizeTaskRole", {
      assumedBy: new iam.ServicePrincipal("ecs-tasks.amazonaws.com"),
    });

    taskRole.addToPolicy(
      new iam.PolicyStatement({
        actions: ["secretsmanager:GetSecretValue"],
        resources: [
          openAiSecret.secretArn,
          authSecret.secretArn,
          authGoogleIdSecret.secretArn,
          authGoogleSecret.secretArn,
          databaseUrlSecret.secretArn,
        ],
      })
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
          memoryLimitMiB: 1024,
          cpu: 512,
          desiredCount: 1,
          // task definition
          taskImageOptions: {
            containerName: "youtube-summarize",
            // NOTE: v0 is the initial version of the image
            image: ecs.ContainerImage.fromEcrRepository(repository, "v0"),
            containerPort: 3000,
            environment: {
              NODE_ENV: "production",
              AUTH_TRUST_HOST: process.env.AUTH_TRUST_HOST!,
            },
            secrets: {
              OPENAI_API_KEY: ecs.Secret.fromSecretsManager(openAiSecret),
              AUTH_SECRET: ecs.Secret.fromSecretsManager(authSecret),
              AUTH_GOOGLE_ID: ecs.Secret.fromSecretsManager(authGoogleIdSecret),
              AUTH_GOOGLE_SECRET:
                ecs.Secret.fromSecretsManager(authGoogleSecret),
              DATABASE_URL: ecs.Secret.fromSecretsManager(databaseUrlSecret),
            },
            taskRole: taskRole,
            executionRole: executionRole,
          },
          // healthCheck: {
          //   // simple TCP health check
          //   command: ["CMD-SHELL", "nc", "-z", "localhost", "3000"],
          //   interval: cdk.Duration.seconds(30),
          //   timeout: cdk.Duration.seconds(5),
          //   retries: 3,
          //   startPeriod: cdk.Duration.seconds(60),
          // },
          publicLoadBalancer: true,
          certificate: certificate,
          redirectHTTP: true,
          runtimePlatform: {
            cpuArchitecture: ecs.CpuArchitecture.X86_64,
            operatingSystemFamily: ecs.OperatingSystemFamily.LINUX,
          },
        }
      );

    // autoscale
    const scaling = fargateService.service.autoScaleTaskCount({
      minCapacity: 1,
      maxCapacity: 2,
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
