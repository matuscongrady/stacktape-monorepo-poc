import { createAnonymousClient, createAwsIdentityClient, createCliClient } from './index.js';

const endpoint = 'https://example.invalid/trpc';
const anonymous = createAnonymousClient({ endpoint });
const cli = createCliClient({ endpoint, apiKey: 'type-test' });
const aws = createAwsIdentityClient({ endpoint, identity: 'type-test' });

void anonymous.health.query();
void anonymous.estimatePrice.query({ units: 2 });
// @ts-expect-error Anonymous clients must not see API-key procedures.
void anonymous.cliProfile.query();
// @ts-expect-error Anonymous clients must not see console procedures.
void anonymous.currentUser.query();

void cli.health.query();
void cli.cliProfile.query();
void cli.startDeployment.mutate({ project: 'demo', stage: 'dev' });
// @ts-expect-error CLI clients must not see console procedures.
void cli.currentUser.query();
// @ts-expect-error CLI clients must not see AWS-identity procedures.
void cli.reportAlarm.mutate({ alarmName: 'test', state: 'OK' });

void aws.reportAlarm.mutate({ alarmName: 'test', state: 'ALARM' });
// @ts-expect-error AWS clients must not see API-key procedures.
void aws.startDeployment.mutate({ project: 'demo', stage: 'dev' });

