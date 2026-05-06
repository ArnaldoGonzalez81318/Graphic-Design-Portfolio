import type { ArchiveProject, Metric } from '../data/portfolio';

const currentYear = new Date().getFullYear().toString();
const defaultPalette: [string, string, string] = ['#38bdf8', '#8b5cf6', '#0f172a'];
const archiveAdminEndpoint = import.meta.env.VITE_ARCHIVE_ADMIN_ENDPOINT || '/.netlify/functions/archive-admin';

export const archiveMockupOptions: Array<{ value: ArchiveProject['mockup']; label: string }> = [
  { value: 'campaign', label: 'Campaign system' },
  { value: 'packaging', label: 'Packaging' },
  { value: 'festival', label: 'Festival' },
  { value: 'editorial', label: 'Editorial' },
  { value: 'product', label: 'Digital product' },
  { value: 'stage', label: 'Stage and event' },
  { value: 'hospitality', label: 'Hospitality' },
];

const normalizeStringArray = (value: string[], fallback: string[]) => {
  const cleaned = value.map((item) => item.trim()).filter(Boolean);
  return cleaned.length > 0 ? cleaned : fallback;
};

const normalizeMetrics = (value: Metric[]) => {
  const metrics = value
    .map((metric) => ({
      label: metric.label.trim(),
      value: metric.value.trim(),
    }))
    .filter((metric) => metric.label.length > 0 && metric.value.length > 0);

  return metrics.length > 0 ? metrics : [{ label: 'Source', value: 'Admin dashboard' }];
};

export const slugifyArchiveProject = (value: string) => {
  return value
    .toLowerCase()
    .trim()
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
};

export const createArchiveProjectDraft = (): ArchiveProject => ({
  slug: '',
  sortOrder: 500,
  title: '',
  client: 'Confidential client',
  year: currentYear,
  category: 'Archive',
  format: 'Design System',
  summary: 'A concise summary of the project and why it belongs in the archive.',
  headline: 'A detailed archive story for this project.',
  overview: 'Use this space to explain the brief, audience, context, and overall creative direction.',
  challenge: 'Describe the business, brand, or communication challenge that shaped the work.',
  approach: 'Explain the thinking, system building, and craft decisions behind the solution.',
  outcome: 'Summarize the outcome, impact, or value created by the project.',
  palette: [...defaultPalette],
  tags: ['Archive'],
  services: ['Creative direction'],
  deliverables: ['Archive entry'],
  metrics: [{ label: 'Timeline', value: '6 weeks' }],
  mockup: 'campaign',
  featured: false,
});

export const createArchiveProjectPayload = (draft: ArchiveProject): ArchiveProject => {
  const slug = slugifyArchiveProject(draft.slug || draft.title);
  const title = draft.title.trim() || slug.split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');

  return {
    slug,
    sortOrder: Number.isFinite(draft.sortOrder) ? draft.sortOrder : 500,
    title,
    client: draft.client.trim() || 'Confidential client',
    year: draft.year.trim() || currentYear,
    category: draft.category.trim() || 'Archive',
    format: draft.format.trim() || 'Design System',
    summary: draft.summary.trim() || 'A concise summary of the project and why it belongs in the archive.',
    headline: draft.headline.trim() || title,
    overview:
      draft.overview.trim() ||
      'Use this space to explain the brief, audience, context, and overall creative direction.',
    challenge:
      draft.challenge.trim() ||
      'Describe the business, brand, or communication challenge that shaped the work.',
    approach:
      draft.approach.trim() ||
      'Explain the thinking, system building, and craft decisions behind the solution.',
    outcome: draft.outcome.trim() || 'Summarize the outcome, impact, or value created by the project.',
    palette: draft.palette,
    tags: normalizeStringArray(draft.tags, ['Archive']),
    services: normalizeStringArray(draft.services, ['Creative direction']),
    deliverables: normalizeStringArray(draft.deliverables, ['Archive entry']),
    metrics: normalizeMetrics(draft.metrics),
    mockup: draft.mockup,
    featured: Boolean(draft.featured),
  };
};

export async function saveArchiveProject(idToken: string, project: ArchiveProject) {
  let response: Response;

  try {
    response = await fetch(archiveAdminEndpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${idToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ project }),
    });
  } catch {
    throw new Error(
      'The admin write endpoint is unreachable. Run the app with Netlify Functions or set VITE_ARCHIVE_ADMIN_ENDPOINT.',
    );
  }

  const data = (await response.json().catch(() => null)) as
    | { error?: string; project?: ArchiveProject; operation?: 'created' | 'updated' }
    | null;

  if (!response.ok) {
    throw new Error(data?.error || 'Unable to save the archive project.');
  }

  return {
    operation: data?.operation ?? 'updated',
    project: data?.project ?? project,
  };
}