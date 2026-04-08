import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const currentFilePath = fileURLToPath(import.meta.url);
const currentDir = path.dirname(currentFilePath);
const workspaceRoot = path.resolve(currentDir, '..');

function runStep(label, command, args) {
  console.log(`\n== ${label} ==`);
  const result = spawnSync(command, args, {
    cwd: workspaceRoot,
    stdio: 'inherit',
    env: process.env,
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

runStep('Checking admin credentials', 'node', ['scripts/check-firestore-admin-credentials.mjs']);
runStep('Validating archive seed schema', 'node', ['scripts/validate-archive-seed.mjs']);
runStep('Seeding Firestore archive collection', 'node', ['scripts/seed-archive-projects.mjs']);