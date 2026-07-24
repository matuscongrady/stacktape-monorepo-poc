import { initTRPC } from '@trpc/server';
import { z } from 'zod';

const contract = initTRPC.create();
const contractOnly = (): never => {
  throw new Error('Contract routers describe the public API surface and must never handle requests.');
};

export const healthOutput = z.object({ status: z.literal('ok'), apiVersion: z.literal(1) });
export const estimatePriceInput = z.object({ units: z.number().int().positive() });
export const estimatePriceOutput = z.object({ currency: z.literal('USD'), total: z.number() });
export const cliProfileOutput = z.object({ organizationId: z.string(), role: z.literal('deployer') });
export const startDeploymentInput = z.object({ project: z.string().min(1), stage: z.string().min(1) });
export const startDeploymentOutput = z.object({ operationId: z.string(), accepted: z.literal(true) });
export const reportAlarmInput = z.object({ alarmName: z.string().min(1), state: z.enum(['OK', 'ALARM']) });
export const reportAlarmOutput = z.object({ recorded: z.literal(true) });

export const publicContractRouter = contract.router({
  health: contract.procedure.output(healthOutput).query(contractOnly),
  estimatePrice: contract.procedure
    .input(estimatePriceInput)
    .output(estimatePriceOutput)
    .query(contractOnly)
});

export const apiKeyContractRouter = contract.router({
  cliProfile: contract.procedure.output(cliProfileOutput).query(contractOnly),
  startDeployment: contract.procedure
    .input(startDeploymentInput)
    .output(startDeploymentOutput)
    .mutation(contractOnly)
});

export const awsIdentityContractRouter = contract.router({
  reportAlarm: contract.procedure.input(reportAlarmInput).output(reportAlarmOutput).mutation(contractOnly)
});

export const cliContractRouter = contract.mergeRouters(publicContractRouter, apiKeyContractRouter);

export type PublicRouter = typeof publicContractRouter;
export type ApiKeyProtectedRouter = typeof apiKeyContractRouter;
export type AwsIdentityProtectedRouter = typeof awsIdentityContractRouter;
export type CliAccessibleRouter = typeof cliContractRouter;
