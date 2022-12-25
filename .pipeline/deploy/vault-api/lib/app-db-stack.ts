import * as cdk from 'aws-cdk-lib';
import { RemovalPolicy, SecretValue } from 'aws-cdk-lib';
import { DatabaseCluster } from 'aws-cdk-lib/aws-docdb';
import { InstanceClass, InstanceSize, InstanceType, SecurityGroup, SubnetType, Vpc } from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import { Constants, getEnvVariable } from '../common';

export class VaultDbStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // vpc
    const vpc = Vpc.fromLookup(this, 'vpc', { vpcId: Constants.vpcId });
    const vpcSubnets = vpc.selectSubnets({ subnetType: SubnetType.PUBLIC, onePerAz: true, availabilityZones: vpc.availabilityZones });

    // database security group
    const documentDbSecurityGroup = new SecurityGroup(this, 'dbSg', {
      vpc,
      securityGroupName: Constants.dbSecurityGroupName,
      description: `Vault DB security group`
    });

    // aws docdb cluster + instance
    const databaseClusterName = `vault-db-cluster`;

    const databaseInstanceType = InstanceType.of(InstanceClass.T3, InstanceSize.MEDIUM);

    const databaseCluster = new DatabaseCluster(this, 'dbCluster', {
      vpc,
      vpcSubnets,
      dbClusterName: databaseClusterName,
      deletionProtection: false,
      instances: 1,
      securityGroup: documentDbSecurityGroup,
      removalPolicy: RemovalPolicy.DESTROY,
      instanceType: databaseInstanceType,
      masterUser: {
        username: getEnvVariable('MONGO_INITDB_ROOT_USERNAME'),
        password: SecretValue.unsafePlainText(getEnvVariable('MONGO_INITDB_ROOT_PASSWORD'))
      },
    });
  }
}
