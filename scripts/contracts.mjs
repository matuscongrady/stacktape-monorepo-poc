import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const backend = join(root, 'apps', 'console', 'backend');
const emitted = join(backend, '.contract-output');
const committed = join(root, 'packages', 'console-api-contracts', 'src', 'generated');
const mode = process.argv[2];

if (!['sync', 'check'].includes(mode)) {
  throw new Error('Usage: node scripts/contracts.mjs <sync|check>');
}

if (!existsSync(join(backend, 'package.json'))) {
  console.log('Private console submodule is absent; committed public contracts remain authoritative.');
  process.exit(0);
}

const pnpmCli = process.env.npm_execpath;
const command = pnpmCli ? process.execPath : process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';
const commandArgs = [
  ...(pnpmCli ? [pnpmCli] : []),
  '--dir',
  backend,
  'exec',
  'tsc',
  '-p',
  'tsconfig.contract.json'
];
rmSync(emitted, { recursive: true, force: true });
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

const listFiles = (directory) => {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => relative(directory, join(entry.parentPath, entry.name)).replaceAll('\\', '/'))
    .sort();
};

if (mode === 'sync') {
  rmSync(committed, { recursive: true, force: true });
  mkdirSync(committed, { recursive: true });
  cpSync(emitted, committed, { recursive: true });
  rmSync(emitted, { recursive: true, force: true });
  console.log(`Synchronized tRPC declarations into ${relative(root, committed)}.`);
  process.exit(0);
}

const emittedFiles = listFiles(emitted);
const committedFiles = listFiles(committed);
const sameFileList = JSON.stringify(emittedFiles) === JSON.stringify(committedFiles);
const changedFiles = emittedFiles.filter((file) => {
  const generatedFile = join(emitted, file);
  const committedFile = join(committed, file);
  return !existsSync(committedFile) || !readFileSync(generatedFile).equals(readFileSync(committedFile));
});

rmSync(emitted, { recursive: true, force: true });

if (!sameFileList || changedFiles.length > 0) {
  console.error('The committed public tRPC contract is stale. Run pnpm contract:sync.');
  console.error(`Generated files: ${emittedFiles.join(', ')}`);
  console.error(`Committed files: ${committedFiles.join(', ')}`);
  console.error(`Changed files: ${changedFiles.join(', ')}`);
  process.exit(1);
}

console.log('Committed public tRPC declarations match the private backend exactly.');
