# Stacktape public-root/private-console monorepo proof of concept

This public repository tests a pnpm workspace whose only private source is a Git submodule at `apps/console`.

The public repository owns explicit Zod schemas and surface-specific tRPC contract routers. The private backend reuses
those schemas and carries compile-time input/output conformance checks. Public clients therefore remain precisely typed
without importing private source, generating declarations from private routers, or using `any` casts.

## What this proves

- The public clone discovers only the root and two public packages; an uninitialized private glob is harmless.
- An authorized recursive clone discovers both private apps in the same pnpm workspace.
- `sharedWorkspaceLockfile: false` keeps the frontend and backend lockfiles inside the private repository.
- TypeScript 6 checks explicit public contracts without exposing private router declarations or Prisma-inferred shapes.
- Anonymous, API-key, AWS-identity, and Cognito clients expose different procedure sets at compile time.
- Server middleware still enforces each authentication scheme independently at runtime.
- Public Zod input and output schemas validate externally consumed procedures and are reused by the private server.
- Prisma generation and esbuild native binaries work with per-project lockfiles and explicit pnpm `allowBuilds` policy.
- Public CI never initializes the private submodule; integrated CI runs only in the private repository.

The public workspace owns `pnpm-workspace.yaml`, the TypeScript base configuration, dependency catalogs, build-script
policy, contract tooling, and public CI. The private repository contains only `backend` and `frontend` applications,
their private lockfiles, runtime tests, and the private integrated workflow.

## Public-only validation

```sh
pnpm install --frozen-lockfile
pnpm check:public
```

The private submodule is not initialized in public CI.

## Integrated validation

After initializing the private submodule:

```sh
pnpm install --frozen-lockfile
pnpm contract:check
pnpm check:integrated
```

Change the public schemas/contracts intentionally before changing an externally consumed private procedure. The private
typecheck fails when its inferred input/output shape no longer matches the public contract.

The private workflow also accepts a manually supplied public Git ref. This lets a trusted maintainer validate a public
pull-request commit against private source without exposing private credentials to untrusted public CI.
