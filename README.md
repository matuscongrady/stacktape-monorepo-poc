# Stacktape public-root/private-console monorepo proof of concept

This public repository tests a pnpm workspace whose only private source is a Git submodule at `apps/console`.

The committed public tRPC declarations are generated from the actual private backend router. Public clients consume
surface-specific router types without importing private source and without using `any` casts.

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
