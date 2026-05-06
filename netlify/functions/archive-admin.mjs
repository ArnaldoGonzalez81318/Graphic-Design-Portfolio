import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { applicationDefault, cert, getApps, initializeApp } from 'firebase-admin/app';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';

const archiveCollectionName = process.env.FIREBASE_ARCHIVE_COLLECTION || 'archiveProjects';
const currentYear = new Date().getFullYear().toString();
const defaultPalette = ['#38bdf8', '#8b5cf6', '#0f172a'];
const validMockups = new Set(['packaging', 'campaign', 'festival', 'editorial', 'product', 'stage', 'hospitality']);
const currentFilePath = fileURLToPath(import.meta.url);
const currentDir = path.dirname(currentFilePath);
const workspaceRoot = path.resolve(currentDir, '..', '..');
const defaultServiceAccountPath = path.join(
  workspaceRoot,
  '.credentials',
  'graphic-designer-portfol-baf47.service-account.json',
);

function jsonResponse(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
    body: JSON.stringify(body),
  };
}

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function resolveString(value, fallback) {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : fallback;
}

function resolveBoolean(value, fallback = false) {
  return typeof value === 'boolean' ? value : fallback;
}

function resolveSortOrder(value) {
  return typeof value === 'number' && Number.isFinite(value) ? value : 500;
}

function resolveStringArray(value, fallback) {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const cleaned = value.filter((item) => typeof item === 'string').map((item) => item.trim()).filter(Boolean);
  return cleaned.length > 0 ? cleaned : fallback;
}

function resolvePalette(value) {
  if (!Array.isArray(value) || value.length < 3) {
    return defaultPalette;
  }

  const [first, second, third] = value;
  if (typeof first !== 'string' || typeof second !== 'string' || typeof third !== 'string') {
    return defaultPalette;
  }

  return [first, second, third];
}

function resolveMetrics(value) {
  if (!Array.isArray(value)) {
    return [{ label: 'Source', value: 'Admin dashboard' }];
  }

  const metrics = value
    .map((item) => {
      if (!item || typeof item !== 'object') {
        return null;
      }

      const label = 'label' in item && typeof item.label === 'string' ? item.label.trim() : '';
      const metricValue = 'value' in item && typeof item.value === 'string' ? item.value.trim() : '';

      if (!label || !metricValue) {
        return null;
      }

      return { label, value: metricValue };
    })
    .filter(Boolean);

  return metrics.length > 0 ? metrics : [{ label: 'Source', value: 'Admin dashboard' }];
}

function createTitleFromSlug(slug) {
  return slug
    .split('-')
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');
}

function sanitizeProject(project) {
  if (!project || typeof project !== 'object') {
    throw new Error('Project payload is required.');
  }

  const slug = slugify(project.slug || project.title);
  if (!slug) {
    throw new Error('Project slug is required.');
  }

  const title = resolveString(project.title, createTitleFromSlug(slug));
  const mockup = typeof project.mockup === 'string' && validMockups.has(project.mockup) ? project.mockup : 'campaign';

  return {
    slug,
    sortOrder: resolveSortOrder(project.sortOrder),
    title,
    client: resolveString(project.client, 'Confidential client'),
    year: resolveString(project.year, currentYear),
    category: resolveString(project.category, 'Archive'),
    format: resolveString(project.format, 'Design System'),
    summary: resolveString(project.summary, 'A concise summary of the project and why it belongs in the archive.'),
    headline: resolveString(project.headline, title),
    overview: resolveString(
      project.overview,
      'Use this space to explain the brief, audience, context, and overall creative direction.',
    ),
    challenge: resolveString(
      project.challenge,
      'Describe the business, brand, or communication challenge that shaped the work.',
    ),
    approach: resolveString(
      project.approach,
      'Explain the thinking, system building, and craft decisions behind the solution.',
    ),
    outcome: resolveString(project.outcome, 'Summarize the outcome, impact, or value created by the project.'),
    palette: resolvePalette(project.palette),
    tags: resolveStringArray(project.tags, ['Archive']),
    services: resolveStringArray(project.services, ['Creative direction']),
    deliverables: resolveStringArray(project.deliverables, ['Archive entry']),
    metrics: resolveMetrics(project.metrics),
    mockup,
    featured: resolveBoolean(project.featured),
  };
}

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

async function getAdminDb() {
  if (getApps().length > 0) {
    return getFirestore(getApps()[0]);
  }

  const app = initializeApp({
    credential: await resolveCredential(),
    projectId: 'graphic-designer-portfol-baf47',
  });

  return getFirestore(app);
}

export default async function handler(request) {
  if (request.httpMethod !== 'POST') {
    return jsonResponse(405, { error: 'Use POST when saving archive projects.' });
  }

  const configuredPassword = process.env.ADMIN_DASHBOARD_PASSWORD || process.env.ARCHIVE_ADMIN_PASSWORD;
  if (!configuredPassword) {
    return jsonResponse(500, {
      error: 'ADMIN_DASHBOARD_PASSWORD is not configured for the admin endpoint.',
    });
  }

  let body;

  try {
    body = JSON.parse(request.body || '{}');
  } catch {
    return jsonResponse(400, { error: 'Request body must be valid JSON.' });
  }

  if (typeof body.password !== 'string' || body.password !== configuredPassword) {
    return jsonResponse(401, { error: 'Invalid admin password.' });
  }

  let project;

  try {
    project = sanitizeProject(body.project);
  } catch (error) {
    return jsonResponse(400, { error: error instanceof Error ? error.message : 'Invalid project payload.' });
  }

  try {
    const db = await getAdminDb();
    const docRef = db.collection(archiveCollectionName).doc(project.slug);
    const existingProject = await docRef.get();

    await docRef.set(
      {
        ...project,
        updatedAt: FieldValue.serverTimestamp(),
        ...(existingProject.exists ? {} : { createdAt: FieldValue.serverTimestamp() }),
      },
      { merge: true },
    );

    return jsonResponse(200, {
      operation: existingProject.exists ? 'updated' : 'created',
      project,
    });
  } catch (error) {
    return jsonResponse(500, {
      error:
        error instanceof Error
          ? error.message
          : 'The admin endpoint could not write to Firestore.',
    });
  }
}