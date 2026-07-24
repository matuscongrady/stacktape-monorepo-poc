import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const backend = join(root, 'apps', 'console', 'backend');

if (!existsSync(join(backend, 'package.json'))) {
  console.log('Private console submodule is absent; public contract packages remain independently valid.');
  process.exit(0);
}

const pnpmCli = process.env.npm_execpath;
const command = pnpmCli ? process.execPath : process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';
const commandArgs = [
  ...(pnpmCli ? [pnpmCli] : []),
  '--dir',
  backend,
  'typecheck'
];
const result = spawnSync(command, commandArgs, {
  cwd: root,
  stdio: 'inherit'
});

if (result.error) {
  throw result.error;
}

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

console.log('Private routers satisfy the public schema and input/output contract checks.');
