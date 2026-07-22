export type RequestContext = {
    authorization: string | undefined;
    apiKey: string | undefined;
    awsIdentity: string | undefined;
};
export declare const t: import("@trpc/server").TRPCRootObject<RequestContext, object, import("@trpc/server").TRPCRuntimeConfigOptions<RequestContext, object>, {
    ctx: RequestContext;
    meta: object;
    errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    transformer: false;
}>;
export declare const requireValue: ({ actual, expected, label }: {
    actual: string | undefined;
    expected: string;
    label: string;
}) => void;
