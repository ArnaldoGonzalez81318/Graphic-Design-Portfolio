import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

import { applicationDefault, cert, getApps, initializeApp } from 'firebase-admin/app';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';

import {
  findArchiveSeedConsistencyIssues,
  formatValidationErrors,
  validateArchiveSeedData,
} from './utils/archive-seed-validation.mjs';

const archiveCollectionName = process.env.FIREBASE_ARCHIVE_COLLECTION || 'archiveProjects';
const currentFilePath = fileURLToPath(import.meta.url);
const currentDir = path.dirname(currentFilePath);
const workspaceRoot = path.resolve(currentDir, '..');
const seedFilePath = path.join(currentDir, 'archiveProjects.seed.json');
const schemaFilePath = path.join(currentDir, 'archiveProjects.schema.json');
const defaultServiceAccountPath = path.join(
  workspaceRoot,
  '.credentials',
  'graphic-designer-portfol-baf47.service-account.json',
);
const dryRun = process.argv.includes('--dry-run');

async function readServiceAccountFromFile(filePath) {
  const json = await readFile(filePath, 'utf8');
  return JSON.parse(json);
}

async function resolveCredential() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    return cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON));
  }

  const explicitPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  if (explicitPath) {
    return cert(await readServiceAccountFromFile(explicitPath));
  }

  try {
    return cert(await readServiceAccountFromFile(defaultServiceAccountPath));
  } catch {
    return applicationDefault();
  }
}

async function getAdminApp() {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  return initializeApp({
    credential: await resolveCredential(),
    projectId: 'graphic-designer-portfol-baf47',
  });
}

async function loadSeedData() {
  const json = await readFile(seedFilePath, 'utf8');
  return JSON.parse(json);
}

async function loadSchema() {
  const json = await readFile(schemaFilePath, 'utf8');
  return JSON.parse(json);
}

function validateStringField(project, fieldName) {
  return typeof project[fieldName] === 'string' && project[fieldName].trim().length > 0;
}

function validateStringArray(project, fieldName) {
  return Array.isArray(project[fieldName]) && project[fieldName].every((item) => typeof item === 'string');
}

function validateMetrics(project) {
  return (
    Array.isArray(project.metrics) &&
    project.metrics.every(
      (item) => item && typeof item === 'object' && typeof item.label === 'string' && typeof item.value === 'string',
    )
  );
}

function validateProject(project) {
  const stringFields = [
    'slug',
    'title',
    'client',
    'year',
    'category',
    'format',
    'summary',
    'headline',
    'overview',
    'challenge',
    'approach',
    'outcome',
    'mockup',
  ];

  for (const field of stringFields) {
    if (!validateStringField(project, field)) {
      throw new Error(`Project ${project.slug ?? '(unknown)'} is missing a valid ${field} field.`);
    }
  }

  if (typeof project.sortOrder !== 'number' || !Number.isFinite(project.sortOrder)) {
    throw new Error(`Project ${project.slug} is missing a valid sortOrder number.`);
  }

  if (!Array.isArray(project.palette) || project.palette.length !== 3 || !project.palette.every((item) => typeof item === 'string')) {
    throw new Error(`Project ${project.slug} must include a 3-value palette array.`);
  }

  for (const field of ['tags', 'services', 'deliverables']) {
    if (!validateStringArray(project, field)) {
      throw new Error(`Project ${project.slug} is missing a valid ${field} string array.`);
    }
  }

  if (!validateMetrics(project)) {
    throw new Error(`Project ${project.slug} is missing a valid metrics array.`);
  }

  if (typeof project.featured !== 'boolean') {
    throw new Error(`Project ${project.slug} must include featured as a boolean.`);
  }
}

async function seedArchiveProjects() {
  const [projects, schema] = await Promise.all([loadSeedData(), loadSchema()]);
  const validationResult = validateArchiveSeedData(schema, projects);
  if (!validationResult.valid) {
    throw new Error(`Archive seed data failed schema validation.\n${formatValidationErrors(validationResult.errors)}`);
  }

  const consistencyIssues = findArchiveSeedConsistencyIssues(projects);
  if (consistencyIssues.length > 0) {
    throw new Error(`Archive seed data failed consistency checks.\n- ${consistencyIssues.join('\n- ')}`);
  }

  if (dryRun) {
    console.log(`Validated ${projects.length} archive projects for ${archiveCollectionName}.`);
    console.log('Dry run complete. No Firestore writes were attempted.');
    return;
  }

  const app = await getAdminApp();
  const db = getFirestore(app);
  const batch = db.batch();

  for (const project of projects) {
    if (!project.slug) {
      throw new Error('Every archive project must include a slug.');
    }

    const docRef = db.collection(archiveCollectionName).doc(project.slug);
    batch.set(docRef, {
      ...project,
      updatedAt: FieldValue.serverTimestamp(),
      seededAt: FieldValue.serverTimestamp(),
    }, { merge: true });
  }

  await batch.commit();

  const schemaDocRef = db.collection(archiveCollectionName).doc('__schema__');
  await schemaDocRef.set(
    {
      collection: schema.collection,
      documentId: schema.documentId,
      title: schema.title,
      description: schema.description,
      requiredFields: schema.items?.required ?? [],
      schemaVersion: schema.$schema,
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true },
  );

  console.log(`Seeded ${projects.length} archive projects into ${archiveCollectionName} for project graphic-designer-portfol-baf47.`);
}

seedArchiveProjects().catch((error) => {
  console.error('Failed to seed archive projects.');
  console.error(error instanceof Error ? error.message : error);
  if (!dryRun) {
    console.error(
      'Provide admin credentials through .credentials/graphic-designer-portfol-baf47.service-account.json, GOOGLE_APPLICATION_CREDENTIALS, FIREBASE_SERVICE_ACCOUNT_PATH, or FIREBASE_SERVICE_ACCOUNT_JSON before seeding.',
    );
  }
  process.exitCode = 1;
});