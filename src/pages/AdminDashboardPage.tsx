import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import ProjectMockup from '../components/archive/ProjectMockup';
import Button from '../components/ui/Button';
import { SectionHeading } from '../components/ui/SectionHeading';
import type { ArchiveProject, Metric } from '../data/portfolio';
import { useArchiveProjects } from '../hooks/useArchiveProjects';
import {
  archiveMockupOptions,
  createArchiveProjectDraft,
  createArchiveProjectPayload,
  saveArchiveProject,
  slugifyArchiveProject,
} from '../lib/archiveAdmin';
import { cn } from '../lib/cn';

type StatusTone = 'info' | 'success' | 'error';

const passwordStorageKey = 'portfolio-admin-password';

const inputClasses =
  'w-full rounded-[1.1rem] border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-quiet focus:border-highlight/60 focus:bg-black/30';
const textareaClasses = `${inputClasses} min-h-[7.5rem] resize-y`;

const statusToneClasses: Record<StatusTone, string> = {
  info: 'border-white/10 bg-white/[0.03] text-subtle',
  success: 'border-emerald-400/25 bg-emerald-400/10 text-emerald-100',
  error: 'border-rose-400/25 bg-rose-400/10 text-rose-100',
};

const parseListInput = (value: string) => {
  return value
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
};

const formatListInput = (value: string[]) => value.join('\n');

const createEmptyMetric = (): Metric => ({ label: '', value: '' });

const AdminDashboardPage = () => {
  const [draft, setDraft] = useState<ArchiveProject>(() => createArchiveProjectDraft());
  const [slugLocked, setSlugLocked] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [password, setPassword] = useState(() => {
    if (typeof window === 'undefined') {
      return '';
    }

    return window.sessionStorage.getItem(passwordStorageKey) ?? '';
  });
  const [statusTone, setStatusTone] = useState<StatusTone>('info');
  const [statusMessage, setStatusMessage] = useState(
    'Add your admin password, complete the project fields, and save to publish directly into the Firestore archive.',
  );
  const [isSaving, setIsSaving] = useState(false);
  const { projects, loading, source, error } = useArchiveProjects(refreshKey);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    if (password) {
      window.sessionStorage.setItem(passwordStorageKey, password);
      return;
    }

    window.sessionStorage.removeItem(passwordStorageKey);
  }, [password]);

  const setField = <K extends keyof ArchiveProject>(field: K, value: ArchiveProject[K]) => {
    setDraft((currentDraft) => ({ ...currentDraft, [field]: value }));
  };

  const handleTitleChange = (value: string) => {
    setDraft((currentDraft) => ({
      ...currentDraft,
      title: value,
      slug: slugLocked ? currentDraft.slug : slugifyArchiveProject(value),
    }));
  };

  const handleSlugChange = (value: string) => {
    setSlugLocked(true);
    setField('slug', slugifyArchiveProject(value));
  };

  const handleMetricChange = (index: number, field: keyof Metric, value: string) => {
    setDraft((currentDraft) => ({
      ...currentDraft,
      metrics: currentDraft.metrics.map((metric, metricIndex) =>
        metricIndex === index ? { ...metric, [field]: value } : metric,
      ),
    }));
  };

  const handleAddMetric = () => {
    setDraft((currentDraft) => ({
      ...currentDraft,
      metrics: [...currentDraft.metrics, createEmptyMetric()],
    }));
  };

  const handleRemoveMetric = (index: number) => {
    setDraft((currentDraft) => ({
      ...currentDraft,
      metrics:
        currentDraft.metrics.length === 1
          ? [createEmptyMetric()]
          : currentDraft.metrics.filter((_, metricIndex) => metricIndex !== index),
    }));
  };

  const handlePaletteChange = (index: number, value: string) => {
    setDraft((currentDraft) => ({
      ...currentDraft,
      palette: currentDraft.palette.map((color, colorIndex) => (colorIndex === index ? value : color)) as ArchiveProject['palette'],
    }));
  };

  const handleLoadProject = (project: ArchiveProject) => {
    setDraft({
      ...project,
      palette: [...project.palette],
      tags: [...project.tags],
      services: [...project.services],
      deliverables: [...project.deliverables],
      metrics: project.metrics.map((metric) => ({ ...metric })),
    });
    setSlugLocked(true);
    setStatusTone('info');
    setStatusMessage(`Loaded ${project.title}. Save to update that Firestore document.`);
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setDraft(createArchiveProjectDraft());
    setSlugLocked(false);
    setStatusTone('info');
    setStatusMessage('Draft reset. Start a new archive project or load an existing one below.');
  };

  const handleForgetPassword = () => {
    setPassword('');
    setStatusTone('info');
    setStatusMessage('Admin password cleared from this tab. Add it again before saving.');
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload = createArchiveProjectPayload(draft);

    if (!payload.slug) {
      setStatusTone('error');
      setStatusMessage('A project title or slug is required before the archive entry can be saved.');
      return;
    }

    if (!password.trim()) {
      setStatusTone('error');
      setStatusMessage('Add the admin password before saving to Firestore.');
      return;
    }

    setIsSaving(true);
    setStatusTone('info');
    setStatusMessage(`Saving ${payload.title} to the archive collection...`);

    try {
      const result = await saveArchiveProject(password, payload);
      setDraft(result.project);
      setSlugLocked(true);
      setRefreshKey((currentValue) => currentValue + 1);
      setStatusTone('success');
      setStatusMessage(
        `${result.project.title} was ${result.operation === 'created' ? 'created' : 'updated'} and is ready for the archive page.`,
      );
    } catch (submitError) {
      setStatusTone('error');
      setStatusMessage(submitError instanceof Error ? submitError.message : 'Unable to save the archive project.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main>
      <section className="relative overflow-hidden border-b border-white/5 bg-night">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.24),transparent_28%),radial-gradient(circle_at_top_right,rgba(244,114,182,0.16),transparent_28%),linear-gradient(180deg,rgba(15,23,42,0.55),transparent)]" />
        <div className="container-grid relative section-padding space-y-10">
          <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.3em] text-quiet">
            <Link to="/archive" className="transition hover:text-white">
              Archive
            </Link>
            <span>/</span>
            <span className="text-highlight">Admin dashboard</span>
            <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-[0.65rem] text-white/75">
              {source === 'firebase' ? 'Live Firestore archive' : 'Local fallback archive'}
            </span>
          </div>

          <div className="grid gap-8 xl:grid-cols-[minmax(0,1.15fr)_minmax(22rem,0.85fr)] xl:items-start">
            <div className="space-y-6">
              <SectionHeading
                eyebrow="Owner tools"
                title="Archive publishing dashboard"
                description="Create or update archive projects without touching source files. The public archive keeps read-only client access; writes go through a protected server endpoint."
                className="max-w-4xl"
              />

              <div className={cn('rounded-[1.8rem] border p-5 text-sm leading-relaxed', statusToneClasses[statusTone])}>
                {statusMessage}
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <div className="rounded-[1.6rem] border border-white/5 bg-white/[0.03] p-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-quiet">Projects loaded</p>
                  <p className="mt-3 text-3xl font-display text-white">{projects.length}</p>
                </div>
                <div className="rounded-[1.6rem] border border-white/5 bg-white/[0.03] p-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-quiet">Featured projects</p>
                  <p className="mt-3 text-3xl font-display text-white">{projects.filter((project) => project.featured).length}</p>
                </div>
                <div className="rounded-[1.6rem] border border-white/5 bg-white/[0.03] p-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-quiet">Admin status</p>
                  <p className="mt-3 text-base leading-relaxed text-subtle">
                    {password ? 'Password stored in this tab and ready for saves.' : 'Enter the admin password before publishing changes.'}
                  </p>
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="overflow-hidden rounded-[2rem] border border-white/5 bg-white/[0.03]"
            >
              <div className="border-b border-white/5 p-6">
                <p className="text-xs uppercase tracking-[0.3em] text-highlight">Live preview</p>
                <h2 className="mt-3 text-2xl font-display text-white">{draft.title || 'Untitled archive project'}</h2>
                <p className="mt-3 text-sm leading-relaxed text-subtle">{draft.summary}</p>
              </div>
              <div className="relative min-h-[18rem] bg-[linear-gradient(180deg,rgba(15,23,42,0.3),rgba(2,6,23,0.88))]">
                <ProjectMockup project={createArchiveProjectPayload(draft)} mode="detail" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-ink/70">
        <div className="container-grid grid gap-8 xl:grid-cols-[minmax(0,1.08fr)_minmax(20rem,0.92fr)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="rounded-[2rem] border border-white/5 bg-white/[0.03] p-6 sm:p-8">
              <div className="flex flex-col gap-4 border-b border-white/5 pb-6 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-highlight">Access</p>
                  <h2 className="mt-3 text-2xl font-display text-white">Publish to Firestore</h2>
                </div>
                <div className="flex gap-3">
                  <Button type="button" variant="ghost" onClick={handleForgetPassword}>
                    Forget Password
                  </Button>
                  <Button type="button" variant="secondary" onClick={handleReset}>
                    New Draft
                  </Button>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.28em] text-quiet">Admin password</span>
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className={inputClasses}
                    placeholder="Set ADMIN_DASHBOARD_PASSWORD on the server"
                    autoComplete="current-password"
                  />
                </label>
                <div className="rounded-[1.1rem] border border-white/10 bg-black/15 px-4 py-3 text-sm leading-relaxed text-subtle">
                  The password is kept in session storage for this tab only and sent only when you save.
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/5 bg-white/[0.03] p-6 sm:p-8">
              <p className="text-xs uppercase tracking-[0.35em] text-highlight">Project identity</p>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <label className="space-y-2 md:col-span-2">
                  <span className="text-xs uppercase tracking-[0.28em] text-quiet">Project title</span>
                  <input
                    type="text"
                    value={draft.title}
                    onChange={(event) => handleTitleChange(event.target.value)}
                    className={inputClasses}
                    placeholder="Solaris Festival Identity"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.28em] text-quiet">Slug</span>
                  <input
                    type="text"
                    value={draft.slug}
                    onChange={(event) => handleSlugChange(event.target.value)}
                    className={inputClasses}
                    placeholder="solaris-festival-identity"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.28em] text-quiet">Client</span>
                  <input
                    type="text"
                    value={draft.client}
                    onChange={(event) => setField('client', event.target.value)}
                    className={inputClasses}
                    placeholder="Solaris Arts Council"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.28em] text-quiet">Year</span>
                  <input
                    type="text"
                    value={draft.year}
                    onChange={(event) => setField('year', event.target.value)}
                    className={inputClasses}
                    placeholder="2026"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.28em] text-quiet">Sort order</span>
                  <input
                    type="number"
                    value={draft.sortOrder}
                    onChange={(event) => setField('sortOrder', Number(event.target.value))}
                    className={inputClasses}
                    min={0}
                    step={1}
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.28em] text-quiet">Category</span>
                  <input
                    type="text"
                    value={draft.category}
                    onChange={(event) => setField('category', event.target.value)}
                    className={inputClasses}
                    placeholder="Experiential"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.28em] text-quiet">Format</span>
                  <input
                    type="text"
                    value={draft.format}
                    onChange={(event) => setField('format', event.target.value)}
                    className={inputClasses}
                    placeholder="Identity + signage"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.28em] text-quiet">Mockup style</span>
                  <select
                    value={draft.mockup}
                    onChange={(event) => setField('mockup', event.target.value as ArchiveProject['mockup'])}
                    className={inputClasses}
                  >
                    {archiveMockupOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex items-center gap-3 rounded-[1.1rem] border border-white/10 bg-black/15 px-4 py-3 text-sm text-subtle md:col-span-2">
                  <input
                    type="checkbox"
                    checked={Boolean(draft.featured)}
                    onChange={(event) => setField('featured', event.target.checked)}
                    className="h-4 w-4 rounded border-white/20 bg-black/20 text-highlight"
                  />
                  Mark this archive entry as a featured case study.
                </label>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/5 bg-white/[0.03] p-6 sm:p-8">
              <p className="text-xs uppercase tracking-[0.35em] text-highlight">Story</p>
              <div className="mt-6 grid gap-4">
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.28em] text-quiet">Summary</span>
                  <textarea
                    value={draft.summary}
                    onChange={(event) => setField('summary', event.target.value)}
                    className={textareaClasses}
                    placeholder="Short archive card summary"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.28em] text-quiet">Headline</span>
                  <textarea
                    value={draft.headline}
                    onChange={(event) => setField('headline', event.target.value)}
                    className={textareaClasses}
                    placeholder="A larger, more editorial project headline"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.28em] text-quiet">Overview</span>
                  <textarea
                    value={draft.overview}
                    onChange={(event) => setField('overview', event.target.value)}
                    className={textareaClasses}
                    placeholder="Context, audience, scope, and creative direction"
                  />
                </label>
                <div className="grid gap-4 lg:grid-cols-3">
                  <label className="space-y-2">
                    <span className="text-xs uppercase tracking-[0.28em] text-quiet">Challenge</span>
                    <textarea
                      value={draft.challenge}
                      onChange={(event) => setField('challenge', event.target.value)}
                      className={textareaClasses}
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-xs uppercase tracking-[0.28em] text-quiet">Approach</span>
                    <textarea
                      value={draft.approach}
                      onChange={(event) => setField('approach', event.target.value)}
                      className={textareaClasses}
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-xs uppercase tracking-[0.28em] text-quiet">Outcome</span>
                    <textarea
                      value={draft.outcome}
                      onChange={(event) => setField('outcome', event.target.value)}
                      className={textareaClasses}
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/5 bg-white/[0.03] p-6 sm:p-8">
              <p className="text-xs uppercase tracking-[0.35em] text-highlight">System details</p>
              <div className="mt-6 grid gap-6">
                <div className="grid gap-4 lg:grid-cols-3">
                  {draft.palette.map((color, index) => (
                    <label key={index} className="space-y-2">
                      <span className="text-xs uppercase tracking-[0.28em] text-quiet">Palette {index + 1}</span>
                      <div className="flex gap-3 rounded-[1.1rem] border border-white/10 bg-black/15 p-2">
                        <input
                          type="color"
                          value={color}
                          onChange={(event) => handlePaletteChange(index, event.target.value)}
                          className="h-11 w-14 rounded-lg border-0 bg-transparent"
                        />
                        <input
                          type="text"
                          value={color}
                          onChange={(event) => handlePaletteChange(index, event.target.value)}
                          className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none"
                        />
                      </div>
                    </label>
                  ))}
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                  <label className="space-y-2">
                    <span className="text-xs uppercase tracking-[0.28em] text-quiet">Tags</span>
                    <textarea
                      value={formatListInput(draft.tags)}
                      onChange={(event) => setField('tags', parseListInput(event.target.value))}
                      className={textareaClasses}
                      placeholder="Brand system&#10;Campaign rollout"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-xs uppercase tracking-[0.28em] text-quiet">Services</span>
                    <textarea
                      value={formatListInput(draft.services)}
                      onChange={(event) => setField('services', parseListInput(event.target.value))}
                      className={textareaClasses}
                      placeholder="Art direction&#10;Visual identity"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-xs uppercase tracking-[0.28em] text-quiet">Deliverables</span>
                    <textarea
                      value={formatListInput(draft.deliverables)}
                      onChange={(event) => setField('deliverables', parseListInput(event.target.value))}
                      className={textareaClasses}
                      placeholder="Key visual&#10;Social toolkit"
                    />
                  </label>
                </div>

                <div className="space-y-4 rounded-[1.4rem] border border-white/10 bg-black/15 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.28em] text-quiet">Metrics</p>
                      <p className="mt-2 text-sm text-subtle">These appear in the project detail page summary cards.</p>
                    </div>
                    <Button type="button" variant="secondary" onClick={handleAddMetric}>
                      Add Metric
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {draft.metrics.map((metric, index) => (
                      <div key={index} className="grid gap-3 rounded-[1.1rem] border border-white/10 bg-black/20 p-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
                        <input
                          type="text"
                          value={metric.label}
                          onChange={(event) => handleMetricChange(index, 'label', event.target.value)}
                          className={inputClasses}
                          placeholder="Metric label"
                        />
                        <input
                          type="text"
                          value={metric.value}
                          onChange={(event) => handleMetricChange(index, 'value', event.target.value)}
                          className={inputClasses}
                          placeholder="Metric value"
                        />
                        <Button type="button" variant="ghost" onClick={() => handleRemoveMetric(index)}>
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button type="submit" className="sm:min-w-[16rem]" disabled={isSaving}>
                {isSaving ? 'Saving Project...' : 'Save To Archive'}
              </Button>
              <Button as="a" href={`/archive/${createArchiveProjectPayload(draft).slug || ''}`} variant="secondary">
                Preview Route
              </Button>
            </div>
          </form>

          <div className="space-y-6">
            <div className="rounded-[2rem] border border-white/5 bg-white/[0.03] p-6">
              <p className="text-xs uppercase tracking-[0.35em] text-highlight">Current archive</p>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.28em] text-quiet">
                <span>{loading ? 'Refreshing archive...' : `${projects.length} projects available`}</span>
                <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-[0.65rem] text-white/75">
                  {source === 'firebase' ? 'Firebase source' : 'Local source'}
                </span>
                {error ? <span className="text-highlight">{error}</span> : null}
              </div>
              <div className="mt-6 space-y-3">
                {projects.map((project) => (
                  <div key={project.slug} className="rounded-[1.4rem] border border-white/10 bg-black/15 p-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="space-y-2">
                        <p className="text-xs uppercase tracking-[0.28em] text-highlight">{project.category}</p>
                        <h3 className="text-lg font-display text-white">{project.title}</h3>
                        <p className="text-xs uppercase tracking-[0.24em] text-quiet">
                          {project.year} · {project.format} · /archive/{project.slug}
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <Button type="button" variant="secondary" onClick={() => handleLoadProject(project)}>
                          Load
                        </Button>
                        <Link
                          to={`/archive/${project.slug}`}
                          className="inline-flex items-center justify-center rounded-full border border-white/10 px-4 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-subtle transition hover:border-highlight/40 hover:text-white"
                        >
                          Open
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AdminDashboardPage;