import type {
  AwsIdentityProtectedRouter,
  CliAccessibleRouter,
  PublicRouter
} from '@stacktape-poc/console-api-contracts';
import { createTRPCClient, httpBatchLink } from '@trpc/client';

export const createAnonymousClient = ({ endpoint }: { endpoint: string }) =>
  createTRPCClient<PublicRouter>({ links: [httpBatchLink({ url: endpoint })] });

export const createCliClient = ({ endpoint, apiKey }: { endpoint: string; apiKey: string }) =>
  createTRPCClient<CliAccessibleRouter>({
    links: [httpBatchLink({ url: endpoint, headers: { 'x-api-key': apiKey } })]
  });

export const createAwsIdentityClient = ({ endpoint, identity }: { endpoint: string; identity: string }) =>
  createTRPCClient<AwsIdentityProtectedRouter>({
    links: [httpBatchLink({ url: endpoint, headers: { 'x-aws-identity': identity } })]
  });

