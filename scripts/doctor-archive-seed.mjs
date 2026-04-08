import { access, readFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

import {
  findArchiveSeedConsistencyIssues,
  formatValidationErrors,
  validateArchiveSeedData,
} from './utils/archive-seed-validation.mjs';

const currentFilePath = fileURLToPath(import.meta.url);
const currentDir = path.dirname(currentFilePath);
const workspaceRoot = path.resolve(currentDir, '..');
const defaultServiceAccountPath = path.join(
  workspaceRoot,
  '.credentials',
  'graphic-designer-portfol-baf47.service-account.json',
);

async function exists(filePath) {
  try {
    await access(filePath, constants.R_OK);
    return true;
  } catch {
    return false;
  }
}

function printCheck(label, ok, detail) {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}`);
  if (detail) {
    console.log(`      ${detail}`);
  }
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, 'utf8'));
}

async function main() {
  let hasFailure = false;

  const firebaseJsonPath = path.join(workspaceRoot, 'firebase.json');
  const firestoreRulesPath = path.join(workspaceRoot, 'firestore.rules');
  const schemaPath = path.join(currentDir, 'archiveProjects.schema.json');
  const seedPath = path.join(currentDir, 'archiveProjects.seed.json');

  const [firebaseJsonExists, firestoreRulesExists, schemaExists, seedExists] = await Promise.all([
    exists(firebaseJsonPath),
    exists(firestoreRulesPath),
    exists(schemaPath),
    exists(seedPath),
  ]);

  printCheck('firebase.json present', firebaseJsonExists, firebaseJsonExists ? firebaseJsonPath : undefined);
  printCheck('firestore.rules present', firestoreRulesExists, firestoreRulesExists ? firestoreRulesPath : undefined);
  printCheck('archive schema present', schemaExists, schemaExists ? schemaPath : undefined);
  printCheck('archive seed present', seedExists, seedExists ? seedPath : undefined);

  if (!firebaseJsonExists || !firestoreRulesExists || !schemaExists || !seedExists) {
    hasFailure = true;
  }

  if (firebaseJsonExists) {
    const firebaseJson = await readJson(firebaseJsonPath);
    const pointsToRules = firebaseJson?.firestore?.rules === 'firestore.rules';
    printCheck(
      'firebase.json points to firestore.rules',
      pointsToRules,
      pointsToRules ? 'Firestore config is wired correctly.' : 'Expected firestore.rules in firebase.json.',
    );
    if (!pointsToRules) {
      hasFailure = true;
    }
  }

  if (firestoreRulesExists) {
    const rules = await readFile(firestoreRulesPath, 'utf8');
    const hasArchiveRead = rules.includes('match /archiveProjects/{document=**}') && rules.includes('allow read: if true;');
    const deniesWrites = rules.includes('allow write: if false;');
    printCheck('archiveProjects public read rule present', hasArchiveRead, hasArchiveRead ? undefined : 'Expected a public read rule for archiveProjects.');
    printCheck('client writes denied in rules', deniesWrites, deniesWrites ? undefined : 'Expected client write denial in firestore.rules.');
    if (!hasArchiveRead || !deniesWrites) {
      hasFailure = true;
    }
  }

  if (schemaExists && seedExists) {
    const [schema, seedData] = await Promise.all([readJson(schemaPath), readJson(seedPath)]);
    const validation = validateArchiveSeedData(schema, seedData);
    const consistencyIssues = findArchiveSeedConsistencyIssues(seedData);

    printCheck(
      'seed payload matches JSON Schema',
      validation.valid,
      validation.valid ? `Validated ${Array.isArray(seedData) ? seedData.length : 0} projects.` : formatValidationErrors(validation.errors),
    );

    const consistencyOk = consistencyIssues.length === 0;
    printCheck(
      'seed payload consistency checks',
      consistencyOk,
      consistencyOk ? 'No duplicate slugs or sort orders detected.' : consistencyIssues.join(' | '),
    );

    if (!validation.valid || !consistencyOk) {
      hasFailure = true;
    }
  }

  const explicitPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  const hasInlineCredentials = Boolean(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
  const hasExplicitCredentialFile = explicitPath ? await exists(explicitPath) : false;
  const hasDefaultCredentialFile = await exists(defaultServiceAccountPath);
  const hasCredentials = hasInlineCredentials || hasExplicitCredentialFile || hasDefaultCredentialFile;

  let credentialDetail = 'No admin credential source detected.';
  if (hasInlineCredentials) {
    credentialDetail = 'Using FIREBASE_SERVICE_ACCOUNT_JSON.';
  } else if (hasExplicitCredentialFile) {
    credentialDetail = `Using explicit credential file: ${explicitPath}`;
  } else if (hasDefaultCredentialFile) {
    credentialDetail = `Using local default credential file: ${defaultServiceAccountPath}`;
  }

  printCheck('admin credentials available for seeding', hasCredentials, credentialDetail);
  if (!hasCredentials) {
    hasFailure = true;
  }

  console.log('');
  if (hasFailure) {
    console.log('Archive seed doctor found issues that need attention before a production Firestore seed.');
    process.exitCode = 1;
    return;
  }

  console.log('Archive seed doctor passed. The project is ready for Firestore seeding.');
}

main().catch((error) => {
  console.error('Archive seed doctor failed unexpectedly.');
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});