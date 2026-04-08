import { access, readFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const currentFilePath = fileURLToPath(import.meta.url);
const currentDir = path.dirname(currentFilePath);
const workspaceRoot = path.resolve(currentDir, '..');
const defaultServiceAccountPath = path.join(
  workspaceRoot,
  '.credentials',
  'graphic-designer-portfol-baf47.service-account.json',
);

async function canRead(filePath) {
  try {
    await access(filePath, constants.R_OK);
    return true;
  } catch {
    return false;
  }
}

async function parseJson(filePath) {
  const raw = await readFile(filePath, 'utf8');
  return JSON.parse(raw);
}

async function main() {
  const explicitPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    const parsed = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    console.log('Admin credentials detected via FIREBASE_SERVICE_ACCOUNT_JSON.');
    console.log(`Project ID: ${parsed.project_id || 'unknown'}`);
    return;
  }

  if (explicitPath && (await canRead(explicitPath))) {
    const parsed = await parseJson(explicitPath);
    console.log(`Admin credentials detected via file path: ${explicitPath}`);
    console.log(`Project ID: ${parsed.project_id || 'unknown'}`);
    return;
  }

  if (await canRead(defaultServiceAccountPath)) {
    const parsed = await parseJson(defaultServiceAccountPath);
    console.log(`Admin credentials detected via local default path: ${defaultServiceAccountPath}`);
    console.log(`Project ID: ${parsed.project_id || 'unknown'}`);
    return;
  }

  console.error('No readable Firebase admin credentials were found.');
  console.error(`Expected local default path: ${defaultServiceAccountPath}`);
  console.error('Alternative options: GOOGLE_APPLICATION_CREDENTIALS, FIREBASE_SERVICE_ACCOUNT_PATH, or FIREBASE_SERVICE_ACCOUNT_JSON.');
  process.exitCode = 1;
}

main().catch((error) => {
  console.error('Credential preflight failed.');
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});