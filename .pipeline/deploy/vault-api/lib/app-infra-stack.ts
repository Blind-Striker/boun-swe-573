import * as cdk from 'aws-cdk-lib';
import { RemovalPolicy } from 'aws-cdk-lib';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { Repository } from 'aws-cdk-lib/aws-ecr';
import { Cluster } from 'aws-cdk-lib/aws-ecs';
import { ARecord, HostedZone, RecordTarget } from 'aws-cdk-lib/aws-route53';
import { BucketWebsiteTarget } from 'aws-cdk-lib/aws-route53-targets';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import { Constants } from '../common';

export class VaultInfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const appName: string = this.node.tryGetContext("APP_NAME");

    const webUiUrl = `${Constants.ui.subdomain}.${Constants.hostedZoneName}`;

    // s3
    const s3 = new Bucket(this, 'bucket', {
      bucketName: webUiUrl,
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'index.html',
      publicReadAccess: true,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // route 53 zone
    const hostedZone = HostedZone.fromHostedZoneAttributes(this, `zone`, {
      hostedZoneId: Constants.hostedZoneId,
      zoneName: Constants.hostedZoneName
    });

    // s3 route53 alias record
    const record = new ARecord(this, `record`, {
      zone: hostedZone,
      target: RecordTarget.fromAlias(new BucketWebsiteTarget(s3)),
      recordName: webUiUrl
    });

    // vpc
    const vpc = Vpc.fromLookup(this, 'vpc', { vpcId: Constants.vpcId });

    // ecs
    new Cluster(this, 'ecsCluster', {
      vpc,
      clusterName: Constants.service.clusterName,
    });

    // ecr
    new Repository(this, 'ecr', {
      repositoryName: appName,
      removalPolicy: RemovalPolicy.DESTROY
    });
  }
}
