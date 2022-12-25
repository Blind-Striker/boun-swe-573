export const Constants = {
  account: '377140207735',
  region: 'eu-central-1',
  vpcId: 'vpc-c339fbab',
  subnetIds: ['subnet-18db5870', 'subnet-3edd0a44', 'subnet-da1b2590'],
  service: {
    clusterName: 'vault-cluster',
    cpu: 256,
    memory: 512,
    subdomain: 'vaultapi',
    envArgs: ['APP_SECRET', 'APP_REFRESH_SECRET', 'MONGO_DB_CONN', 'MONGO_INITDB_DATABASE', 'MONGO_INITDB_ROOT_USERNAME', 'MONGO_INITDB_ROOT_PASSWORD']
  },
  ui: {
    subdomain: 'vaultui'
  },
  hostedZoneId: 'Z25L8LA24IPR3S',
  hostedZoneName: 'denizirgin.com',
  dbSecurityGroupName: 'vault-db-sg'
};


export function getEnvVariable(key: string): string {
  return process.env[key] ?? '';
};

export function getContainerEnvVariableSet(): { [key: string]: string } {
  const set: { [key: string]: string } = {};
  Constants.service.envArgs.forEach(key => {
    set[key] = getEnvVariable(key);
  });
  return set;
};

export interface EnvironmentVariables {
  environmentVariables: {
    [key: string]: string;
  }
}