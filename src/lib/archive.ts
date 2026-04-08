import { collection, getDocs } from 'firebase/firestore';

import { archiveWork, type ArchiveProject, type Metric } from '../data/portfolio';
import { archiveCollectionName, db, isFirebaseConfigured } from './firebase';

export type ArchiveSource = 'local' | 'firebase';

type ArchiveProjectRecord = Partial<ArchiveProject> & {
  slug?: string;
  palette?: unknown;
  tags?: unknown;
  services?: unknown;
  deliverables?: unknown;
  metrics?: unknown;
  mockup?: unknown;
  sortOrder?: unknown;
};

const defaultPalette: [string, string, string] = ['#38bdf8', '#8b5cf6', '#0f172a'];
const validMockups = new Set<ArchiveProject['mockup']>([
  'packaging',
  'campaign',
  'festival',
  'editorial',
  'product',
  'stage',
  'hospitality',
]);
const archiveDefaults = new Map(archiveWork.map((project) => [project.slug, project]));

const createDefaultProject = (slug: string): ArchiveProject => ({
  slug,
  sortOrder: Number.MAX_SAFE_INTEGER,
  title: slug
    .split('-')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' '),
  client: 'Confidential client',
  year: '2026',
  category: 'Archive',
  format: 'Design System',
  summary: 'Expanded archive item imported from Firebase.',
  headline: 'A portfolio archive entry synced from Firebase.',
  overview: 'This project is managed through Firebase and can be edited without changing the codebase.',
  challenge: 'Project metadata was loaded from the archive CMS collection.',
  approach: 'The frontend merges Firebase data with local defaults when fields are missing.',
  outcome: 'The project is available in the archive and can be expanded into a richer case study over time.',
  palette: defaultPalette,
  tags: ['Archive'],
  services: ['Creative direction'],
  deliverables: ['Archive entry'],
  metrics: [{ label: 'Source', value: 'Firebase' }],
  mockup: 'campaign',
});

const normalizeStringArray = (value: unknown, fallback: string[]): string[] => {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const filtered = value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0);
  return filtered.length > 0 ? filtered : fallback;
};

const normalizePalette = (
  value: unknown,
  fallback: [string, string, string],
): [string, string, string] => {
  if (!Array.isArray(value) || value.length < 3) {
    return fallback;
  }

  const [first, second, third] = value;
  if (typeof first !== 'string' || typeof second !== 'string' || typeof third !== 'string') {
    return fallback;
  }

  return [first, second, third];
};

const normalizeMetrics = (value: unknown, fallback: Metric[]): Metric[] => {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const metrics = value
    .map((item) => {
      if (typeof item !== 'object' || item === null) {
        return null;
      }

      const label = 'label' in item && typeof item.label === 'string' ? item.label : null;
      const metricValue = 'value' in item && typeof item.value === 'string' ? item.value : null;

      if (!label || !metricValue) {
        return null;
      }

      return { label, value: metricValue };
    })
    .filter((item): item is Metric => item !== null);

  return metrics.length > 0 ? metrics : fallback;
};

const normalizeMockup = (
  value: unknown,
  fallback: ArchiveProject['mockup'],
): ArchiveProject['mockup'] => {
  return typeof value === 'string' && validMockups.has(value as ArchiveProject['mockup'])
    ? (value as ArchiveProject['mockup'])
    : fallback;
};

const resolveText = (value: unknown, fallback: string) => {
  return typeof value === 'string' && value.trim().length > 0 ? value : fallback;
};

const resolveBoolean = (value: unknown, fallback: boolean | undefined) => {
  return typeof value === 'boolean' ? value : fallback;
};

const resolveSortOrder = (value: unknown, fallback: number) => {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
};

const mergeProject = (record: ArchiveProjectRecord): ArchiveProject => {
  const slug = typeof record.slug === 'string' && record.slug.trim().length > 0 ? record.slug : 'untitled-project';
  const fallback = archiveDefaults.get(slug) ?? createDefaultProject(slug);

  return {
    ...fallback,
    slug,
    sortOrder: resolveSortOrder(record.sortOrder, fallback.sortOrder),
    title: resolveText(record.title, fallback.title),
    client: resolveText(record.client, fallback.client),
    year: resolveText(record.year, fallback.year),
    category: resolveText(record.category, fallback.category),
    format: resolveText(record.format, fallback.format),
    summary: resolveText(record.summary, fallback.summary),
    headline: resolveText(record.headline, fallback.headline),
    overview: resolveText(record.overview, fallback.overview),
    challenge: resolveText(record.challenge, fallback.challenge),
    approach: resolveText(record.approach, fallback.approach),
    outcome: resolveText(record.outcome, fallback.outcome),
    palette: normalizePalette(record.palette, fallback.palette),
    tags: normalizeStringArray(record.tags, fallback.tags),
    services: normalizeStringArray(record.services, fallback.services),
    deliverables: normalizeStringArray(record.deliverables, fallback.deliverables),
    metrics: normalizeMetrics(record.metrics, fallback.metrics),
    mockup: normalizeMockup(record.mockup, fallback.mockup),
    featured: resolveBoolean(record.featured, fallback.featured),
  };
};

const sortProjects = (projects: ArchiveProject[]) => {
  return [...projects].sort((left, right) => left.sortOrder - right.sortOrder);
};

export async function fetchArchiveProjects(): Promise<{ projects: ArchiveProject[]; source: ArchiveSource }> {
  if (!db || !isFirebaseConfigured) {
    return { projects: sortProjects(archiveWork), source: 'local' };
  }

  const snapshot = await getDocs(collection(db, archiveCollectionName));
  if (snapshot.empty) {
    return { projects: sortProjects(archiveWork), source: 'local' };
  }

  const remoteBySlug = new Map<string, ArchiveProject>();

  snapshot.forEach((document) => {
    const data = document.data() as ArchiveProjectRecord;
    const slug = typeof data.slug === 'string' && data.slug.trim().length > 0 ? data.slug : document.id;
    const normalized = mergeProject({ ...data, slug });
    remoteBySlug.set(normalized.slug, normalized);
  });

  const mergedProjects = archiveWork.map((project) => remoteBySlug.get(project.slug) ?? project);
  const additionalProjects = Array.from(remoteBySlug.values()).filter(
    (project) => !archiveDefaults.has(project.slug),
  );

  return { projects: sortProjects([...mergedProjects, ...additionalProjects]), source: 'firebase' };
}