import * as cdk from 'aws-cdk-lib';
import { Duration } from 'aws-cdk-lib';
import { CertificateValidation, DnsValidatedCertificate } from 'aws-cdk-lib/aws-certificatemanager';
import { Peer, Port, SecurityGroup, SubnetType, Vpc } from 'aws-cdk-lib/aws-ec2';
import { Repository } from 'aws-cdk-lib/aws-ecr';
import { Cluster, ContainerDefinition, EcrImage, FargateService, FargateTaskDefinition, LogDrivers } from 'aws-cdk-lib/aws-ecs';
import { ApplicationLoadBalancer, ApplicationProtocol, ApplicationTargetGroup, Protocol, SslPolicy } from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import { ARecord, HostedZone, IHostedZone, RecordTarget } from 'aws-cdk-lib/aws-route53';
import { LoadBalancerTarget } from 'aws-cdk-lib/aws-route53-targets';
import { Construct } from 'constructs';
import { Constants, getContainerEnvVariableSet } from '../common';

export class VaultServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const appName: string = this.node.tryGetContext("APP_NAME");
    const appVersion: string = this.node.tryGetContext("APP_VERSION");

    // vpc
    const vpc = Vpc.fromLookup(this, 'vpc', { vpcId: Constants.vpcId });
    const vpcSubnets = vpc.selectSubnets({ subnetType: SubnetType.PUBLIC, onePerAz: true, availabilityZones: vpc.availabilityZones });

    const cluster = Cluster.fromClusterAttributes(this, `cluster`, { clusterName: Constants.service.clusterName, vpc, securityGroups: [] });

    const ecrRepo = Repository.fromRepositoryName(this, `ecr`, appName);

    const ecrImage = EcrImage.fromEcrRepository(ecrRepo, appVersion);


    // service security group
    const serviceSecurityGroup = new SecurityGroup(this, 'serviceSg', {
      vpc,
      securityGroupName: 'vault service sg',
      description: `Vault service security group`
    });

    const docDbSecurityGroup = SecurityGroup.fromLookupByName(this, 'dbSg', Constants.dbSecurityGroupName, vpc);

    docDbSecurityGroup.addIngressRule(serviceSecurityGroup, Port.tcp(27017), 'allow access from vault service');
    docDbSecurityGroup.addIngressRule(Peer.ipv4(vpc.vpcCidrBlock), Port.tcp(27017), 'allow access from vpc');

    // task definition
    // https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-cpu-memory-error.html
    const taskDefinition = new FargateTaskDefinition(this, `task`, {
      family: `${appName}-family`,
      memoryLimitMiB: Constants.service.memory,
      cpu: Constants.service.cpu
    });

    // container definition
    const containerEnvironmentVars = getContainerEnvVariableSet();

    new ContainerDefinition(this, `container`, {
      image: ecrImage,
      taskDefinition,
      cpu: Constants.service.cpu,
      memoryLimitMiB: Constants.service.memory,
      environment: containerEnvironmentVars,
      essential: true,
      logging: LogDrivers.awsLogs({
        streamPrefix: `${appName}-log`,
        logRetention: RetentionDays.ONE_DAY
      }),
      portMappings: [{
        containerPort: 3000
      }]
    });


    // fargate service
    const fargateService = new FargateService(this, `service`, {
      cluster,
      taskDefinition,
      vpcSubnets,
      desiredCount: 1,
      assignPublicIp: true,
      serviceName: `${appName}`,
      securityGroups: [serviceSecurityGroup],
      circuitBreaker: { rollback: true }
    });


    // target group
    const targetGroup = new ApplicationTargetGroup(this, `tg`, {
      vpc,
      protocol: ApplicationProtocol.HTTP,
      targetGroupName: `${appName}`,
      deregistrationDelay: Duration.seconds(10),
      targets: [fargateService],
      healthCheck: {
        enabled: true,
        path: '/',
        timeout: Duration.seconds(10),
        interval: Duration.seconds(30),
        healthyHttpCodes: '200-499',
        healthyThresholdCount: 2,
        unhealthyThresholdCount: 3,
        protocol: Protocol.HTTP
      }
    });


    // load balancer security group
    const albSecurityGroup = new SecurityGroup(this, 'albSg', {
      vpc,
      securityGroupName: 'vault alb sg',
      description: `Vault ALB security group`
    });

    serviceSecurityGroup.addIngressRule(albSecurityGroup, Port.tcp(80), 'allow access from vault alb');


    // load balancer
    const alb = new ApplicationLoadBalancer(this, `alb`, {
      vpc,
      vpcSubnets,
      internetFacing: true,
      loadBalancerName: `${appName}-lb`,
      http2Enabled: true,
      securityGroup: albSecurityGroup
    });


    // route 53 zone
    const hostedZone = HostedZone.fromHostedZoneAttributes(this, `zone`, {
      hostedZoneId: Constants.hostedZoneId,
      zoneName: Constants.hostedZoneName
    });

    const apiUrl = `${Constants.service.subdomain}.${Constants.hostedZoneName}`;
    const dnsValidationMap: { [key: string]: IHostedZone; } = {
      apiUrl: hostedZone
    };

    // alb certificate    
    const albCertificate = new DnsValidatedCertificate(this, 'cert', {
      hostedZone,
      region: Constants.region,
      domainName: apiUrl,
      validation: CertificateValidation.fromDnsMultiZone(dnsValidationMap),
    });

    alb.addListener('listener', {
      protocol: ApplicationProtocol.HTTPS,
      defaultTargetGroups: [targetGroup],
      certificates: [albCertificate],
      sslPolicy: SslPolicy.FORWARD_SECRECY_TLS12_RES_GCM
    });


    // dns aliases    
    const record = new ARecord(this, `record`, {
      zone: hostedZone,
      target: RecordTarget.fromAlias(new LoadBalancerTarget(alb)),
      recordName: apiUrl
    });
  }
}
