export declare const publicRouter: import("@trpc/server").TRPCBuiltRouter<{
    ctx: import("./trpc.js").RequestContext;
    meta: object;
    errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    transformer: false;
}, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
    health: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: {
            status: "ok";
            apiVersion: 1;
        };
        meta: object;
    }>;
    estimatePrice: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            units: number;
        };
        output: {
            currency: "USD";
            total: number;
        };
        meta: object;
    }>;
}>>;
export declare const apiKeyProtectedRouter: import("@trpc/server").TRPCBuiltRouter<{
    ctx: import("./trpc.js").RequestContext;
    meta: object;
    errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    transformer: false;
}, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
    cliProfile: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: {
            organizationId: string;
            role: "deployer";
        };
        meta: object;
    }>;
    startDeployment: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            project: string;
            stage: string;
        };
        output: {
            operationId: string;
            accepted: true;
        };
        meta: object;
    }>;
}>>;
export declare const awsIdentityProtectedRouter: import("@trpc/server").TRPCBuiltRouter<{
    ctx: import("./trpc.js").RequestContext;
    meta: object;
    errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    transformer: false;
}, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
    reportAlarm: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            alarmName: string;
            state: "ALARM" | "OK";
        };
        output: {
            recorded: true;
        };
        meta: object;
    }>;
}>>;
export declare const cliAccessibleRouter: import("@trpc/server").TRPCBuiltRouter<{
    ctx: import("./trpc.js").RequestContext;
    meta: object;
    errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    transformer: false;
}, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
    cliProfile: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: {
            organizationId: string;
            role: "deployer";
        };
        meta: object;
    }>;
    startDeployment: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            project: string;
            stage: string;
        };
        output: {
            operationId: string;
            accepted: true;
        };
        meta: object;
    }>;
}> & import("@trpc/server").TRPCDecorateCreateRouterOptions<{
    health: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: {
            status: "ok";
            apiVersion: 1;
        };
        meta: object;
    }>;
    estimatePrice: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            units: number;
        };
        output: {
            currency: "USD";
            total: number;
        };
        meta: object;
    }>;
}>>;
export type CliAccessibleRouter = typeof cliAccessibleRouter;
export type PublicRouter = typeof publicRouter;
export type ApiKeyProtectedRouter = typeof apiKeyProtectedRouter;
export type AwsIdentityProtectedRouter = typeof awsIdentityProtectedRouter;
