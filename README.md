# Stacktape public-root/private-console monorepo proof of concept

This public repository tests a pnpm workspace whose only private source is a Git submodule at `apps/console`.

The committed public tRPC declarations are generated from the actual private backend router. Public clients consume
surface-specific router types without importing private source and without using `any` casts.

## What this proves

- The public clone discovers only the root and two public packages; an uninitialized private glob is harmless.
- An authorized recursive clone discovers both private apps in the same pnpm workspace.
- `sharedWorkspaceLockfile: false` keeps the frontend and backend lockfiles inside the private repository.
- TypeScript 7 declaration emission creates a public tRPC contract from the real private routers without resolver code.
- Anonymous, API-key, AWS-identity, and Cognito clients expose different procedure sets at compile time.
- Server middleware still enforces each authentication scheme independently at runtime.
- Explicit Zod input and output schemas validate externally consumed procedures.
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

Use `pnpm contract:sync` after intentionally changing an externally consumed tRPC router.

The private workflow also accepts a manually supplied public Git ref. This lets a trusted maintainer validate a public
pull-request commit against private source without exposing private credentials to untrusted public CI.
