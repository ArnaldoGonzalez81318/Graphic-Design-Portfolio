import { motion } from 'framer-motion';
import { useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';

import ProjectMockup from '../components/archive/ProjectMockup';
import Button from '../components/ui/Button';
import { SectionHeading } from '../components/ui/SectionHeading';
import type { ArchiveProject, Metric } from '../data/portfolio';
import { useAdminAuth } from '../hooks/useAdminAuth';
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

const inputClasses =
  'w-full rounded-[1.1rem] border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-quiet focus:border-highlight/60 focus:bg-black/30 focus:ring-1 focus:ring-highlight/20';
const textareaClasses = `${inputClasses} min-h-[7.5rem] resize-y`;

const statusToneClasses: Record<StatusTone, string> = {
  info: 'border-cyan-300/20 bg-cyan-400/10 text-cyan-50',
  success: 'border-emerald-400/25 bg-emerald-400/10 text-emerald-100',
  error: 'border-rose-400/25 bg-rose-400/10 text-rose-100',
};

const statusToneDotClasses: Record<StatusTone, string> = {
  info: 'bg-cyan-200 shadow-[0_0_0_6px_rgba(125,211,252,0.18)]',
  success: 'bg-emerald-200 shadow-[0_0_0_6px_rgba(52,211,153,0.18)]',
  error: 'bg-rose-200 shadow-[0_0_0_6px_rgba(251,113,133,0.2)]',
};

const parseListInput = (value: string) => {
  return value
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
};

const formatListInput = (value: string[]) => value.join('\n');

const createEmptyMetric = (): Metric => ({ label: '', value: '' });

interface EditorSectionProps {
  step: string;
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}

const EditorSection = ({ step, eyebrow, title, description, children }: EditorSectionProps) => {
  return (
    <section className="group relative overflow-hidden rounded-[2rem] border border-white/5 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] shadow-[0_30px_90px_-60px_rgba(56,189,248,0.35)] transition duration-300 hover:border-highlight/20 hover:shadow-[0_35px_110px_-65px_rgba(56,189,248,0.5)]">
      <div className="pointer-events-none absolute -right-16 top-0 h-44 w-44 rounded-full bg-highlight/10 blur-2xl transition duration-300 group-hover:bg-highlight/20" />
      <div className="grid gap-5 border-b border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.025),transparent)] p-6 sm:p-8 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-start">
        <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-highlight/30 bg-[radial-gradient(circle_at_40%_40%,rgba(56,189,248,0.2),rgba(56,189,248,0.05))] text-sm font-semibold uppercase tracking-[0.22em] text-highlight shadow-[0_0_0_6px_rgba(56,189,248,0.07),inset_0_1px_0_rgba(255,255,255,0.08)]">
          {step}
        </div>
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.35em] text-highlight">{eyebrow}</p>
          <div className="space-y-2">
            <h2 className="text-2xl font-display text-white">{title}</h2>
            <p className="max-w-3xl text-sm leading-relaxed text-subtle sm:text-base">{description}</p>
          </div>
        </div>
      </div>
      <div className="p-6 sm:p-8">{children}</div>
    </section>
  );
};

const AdminDashboardPage = () => {
  const [draft, setDraft] = useState<ArchiveProject>(() => createArchiveProjectDraft());
  const [slugLocked, setSlugLocked] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [statusTone, setStatusTone] = useState<StatusTone>('info');
  const [statusMessage, setStatusMessage] = useState(
    'Sign in with your authorized Google account, then save to publish directly into the Firestore archive.',
  );
  const [isSaving, setIsSaving] = useState(false);
  const { projects, loading, source, error } = useArchiveProjects(refreshKey);
  const { user, loading: authLoading, signIn, signOut, getIdToken } = useAdminAuth();

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

  const handleSignIn = async () => {
    setStatusTone('info');
    setStatusMessage('Opening Google sign-in for the owner dashboard...');

    try {
      const signedInUser = await signIn();
      setStatusTone('success');
      setStatusMessage(
        `Signed in as ${signedInUser.email ?? 'the portfolio owner'}. You can publish archive updates now.`,
      );
    } catch (signInError) {
      setStatusTone('error');
      setStatusMessage(signInError instanceof Error ? signInError.message : 'Unable to sign in with Google.');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setStatusTone('info');
      setStatusMessage('Signed out. Sign in again with your authorized Google account before publishing.');
    } catch (signOutError) {
      setStatusTone('error');
      setStatusMessage(signOutError instanceof Error ? signOutError.message : 'Unable to sign out right now.');
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload = createArchiveProjectPayload(draft);

    if (!payload.slug) {
      setStatusTone('error');
      setStatusMessage('A project title or slug is required before the archive entry can be saved.');
      return;
    }

    const idToken = await getIdToken();

    if (!idToken) {
      setStatusTone('error');
      setStatusMessage('Sign in with your authorized Google account before saving to Firestore.');
      return;
    }

    setIsSaving(true);
    setStatusTone('info');
    setStatusMessage(`Saving ${payload.title} to the archive collection...`);

    try {
      const result = await saveArchiveProject(idToken, payload);
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

  const adminStatusLabel = authLoading
    ? 'Checking sign-in state...'
    : user?.email
      ? `Signed in as ${user.email}.`
      : 'Sign in required before publishing.';
  const isAuthenticated = Boolean(user);
  const accessStateLabel = authLoading ? 'Checking session' : isAuthenticated ? 'Authenticated' : 'Sign-in required';
  const accessStateClasses = authLoading
    ? 'border-white/10 bg-white/[0.04] text-white/80'
    : isAuthenticated
      ? 'border-emerald-400/30 bg-emerald-400/12 text-emerald-100'
      : 'border-amber-400/30 bg-amber-400/10 text-amber-100';
  const accessTitle = authLoading
    ? 'Restoring your owner session'
    : isAuthenticated
      ? 'Publishing access is live'
      : 'Owner sign-in is required';
  const accessDescription = isAuthenticated
    ? 'This session can publish because the server verifies the Firebase ID token and checks your email against the owner allowlist before any Firestore write is accepted.'
    : 'Use the Google account that owns the portfolio. Public visitors still cannot write because Firestore remains read-only from the browser.';
  const accessChecklist = [
    'Turn on Google in Firebase Authentication.',
    'Add localhost and the production domain to Authorized domains.',
    'Set ADMIN_DASHBOARD_ALLOWED_EMAILS on the server to the owner email.',
  ];
  const payloadPreview = createArchiveProjectPayload(draft);
  const draftRoute = payloadPreview.slug ? `/archive/${payloadPreview.slug}` : '/archive';
  const completionChecks = [
    {
      label: 'Identity fields',
      detail: 'Title, slug, client, format',
      complete: Boolean(draft.title.trim() && payloadPreview.slug && draft.client.trim() && draft.format.trim()),
    },
    {
      label: 'Narrative copy',
      detail: 'Summary, headline, overview',
      complete: Boolean(draft.summary.trim() && draft.headline.trim() && draft.overview.trim()),
    },
    {
      label: 'System metadata',
      detail: 'Tags, services, deliverables, metrics',
      complete: Boolean(
        draft.tags.some((item) => item.trim()) &&
          draft.services.some((item) => item.trim()) &&
          draft.deliverables.some((item) => item.trim()) &&
          draft.metrics.some((metric) => metric.label.trim() && metric.value.trim()),
      ),
    },
    {
      label: 'Owner access',
      detail: 'Authorized Google session',
      complete: isAuthenticated,
    },
  ];
  const completedChecks = completionChecks.filter((item) => item.complete).length;
  const completionPercent = `${(completedChecks / completionChecks.length) * 100}%`;
  const snapshotStats = [
    { label: 'Category', value: payloadPreview.category },
    { label: 'Format', value: payloadPreview.format },
    { label: 'Year', value: payloadPreview.year },
    { label: 'Mockup', value: payloadPreview.mockup },
  ];

  return (
    <main>
      <section className="relative overflow-hidden border-b border-white/5 bg-night">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.24),transparent_28%),radial-gradient(circle_at_top_right,rgba(244,114,182,0.16),transparent_28%),linear-gradient(180deg,rgba(15,23,42,0.55),transparent)]" />
        <div className="pointer-events-none absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(148,163,184,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.16)_1px,transparent_1px)] [background-size:42px_42px]" />
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
              <span className="inline-flex items-center gap-2 rounded-full border border-highlight/30 bg-highlight/10 px-4 py-2 text-[0.62rem] font-semibold uppercase tracking-[0.25em] text-highlight">
                <span className="h-2 w-2 rounded-full bg-highlight" />
                Owner Command Center
              </span>
              <SectionHeading
                eyebrow="Owner tools"
                title="Archive publishing dashboard"
                description="Create or update archive projects without touching source files. The public archive keeps read-only client access; writes go through a protected server endpoint."
                className="max-w-4xl"
              />

              <div className={cn('flex items-start gap-3 rounded-[1.8rem] border p-5 text-sm leading-relaxed', statusToneClasses[statusTone])}>
                <span className={cn('mt-1 h-2.5 w-2.5 shrink-0 rounded-full', statusToneDotClasses[statusTone])} />
                <span>{statusMessage}</span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.25fr)]">
                <div className="rounded-[1.6rem] border border-white/5 bg-[linear-gradient(170deg,rgba(56,189,248,0.12),rgba(2,6,23,0.55))] p-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-quiet">Projects loaded</p>
                  <p className="mt-3 text-3xl font-display text-white">{projects.length}</p>
                </div>
                <div className="rounded-[1.6rem] border border-white/5 bg-[linear-gradient(170deg,rgba(244,114,182,0.12),rgba(2,6,23,0.55))] p-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-quiet">Featured projects</p>
                  <p className="mt-3 text-3xl font-display text-white">{projects.filter((project) => project.featured).length}</p>
                </div>
                <div className="rounded-[1.6rem] border border-highlight/20 bg-[linear-gradient(160deg,rgba(139,92,246,0.18),rgba(2,6,23,0.64))] p-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-quiet">Admin status</p>
                  <p className="mt-3 text-base leading-relaxed text-subtle">
                    {adminStatusLabel}
                  </p>
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="overflow-hidden rounded-[2rem] border border-white/5 bg-[linear-gradient(165deg,rgba(56,189,248,0.12),rgba(2,6,23,0.72)_42%,rgba(2,6,23,0.92))]"
            >
              <div className="border-b border-white/5 p-6">
                <p className="text-xs uppercase tracking-[0.3em] text-highlight">Live preview</p>
                <h2 className="mt-3 text-2xl font-display text-white">{draft.title || 'Untitled archive project'}</h2>
                <p className="mt-3 text-sm leading-relaxed text-subtle">{draft.summary}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full border border-white/10 bg-black/20 px-3 py-2 text-[0.62rem] uppercase tracking-[0.22em] text-white/80">
                    {payloadPreview.category}
                  </span>
                  <span className="rounded-full border border-white/10 bg-black/20 px-3 py-2 text-[0.62rem] uppercase tracking-[0.22em] text-white/80">
                    {payloadPreview.format}
                  </span>
                  <span className="rounded-full border border-white/10 bg-black/20 px-3 py-2 text-[0.62rem] uppercase tracking-[0.22em] text-white/80">
                    {payloadPreview.year}
                  </span>
                </div>
              </div>
              <div className="relative min-h-[18rem] bg-[linear-gradient(180deg,rgba(15,23,42,0.3),rgba(2,6,23,0.88))]">
                <ProjectMockup project={createArchiveProjectPayload(draft)} mode="detail" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="relative section-padding bg-ink/70">
        <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(148,163,184,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.14)_1px,transparent_1px)] [background-size:36px_36px]" />
        <div className="container-grid grid gap-8 xl:grid-cols-[minmax(0,1.04fr)_minmax(21rem,0.96fr)] xl:items-start">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative overflow-hidden rounded-[2rem] border border-white/5 bg-[linear-gradient(145deg,rgba(56,189,248,0.16),rgba(15,23,42,0.82)_38%,rgba(2,6,23,0.96))] p-6 shadow-[0_35px_110px_-65px_rgba(56,189,248,0.55)] sm:p-8">
              <div className="pointer-events-none absolute -top-24 right-0 h-52 w-52 rounded-full bg-highlight/20 blur-3xl" />
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1.16fr)_minmax(16rem,0.84fr)] lg:items-end">
                <div className="space-y-4">
                  <p className="text-xs uppercase tracking-[0.35em] text-highlight">Editor workflow</p>
                  <h2 className="max-w-3xl text-3xl font-display leading-tight text-white sm:text-[2.35rem]">
                    Shape the archive entry with the same level of intention as the work itself.
                  </h2>
                  <p className="max-w-2xl text-sm leading-relaxed text-subtle sm:text-base">
                    Start with access, define the identity, build the story, then tune the system details. The right rail keeps the route, readiness, and archive inventory in view while you edit.
                  </p>
                </div>

                <div className="overflow-hidden rounded-[1.4rem] border border-white/10 bg-black/25">
                  <div className="flex flex-col divide-y divide-white/[0.07] sm:flex-row sm:divide-x sm:divide-y-0 lg:flex-col lg:divide-x-0 lg:divide-y">
                    <div className="flex-1 p-4">
                      <p className="text-xs uppercase tracking-[0.28em] text-quiet">Draft route</p>
                      <p className="mt-2.5 break-all text-sm font-medium text-white">{draftRoute}</p>
                    </div>
                    <div className="flex-1 p-4">
                      <p className="text-xs uppercase tracking-[0.28em] text-quiet">Readiness</p>
                      <p className="mt-2.5 text-2xl font-display text-white">{completedChecks}/{completionChecks.length}</p>
                    </div>
                    <div className="flex-1 p-4">
                      <p className="text-xs uppercase tracking-[0.28em] text-quiet">Archive source</p>
                      <p className="mt-2.5 text-sm font-medium text-white">{source === 'firebase' ? 'Live Firestore archive' : 'Local archive fallback'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <EditorSection
              step="01"
              eyebrow="Access"
              title="Control who can publish"
              description="Keep the owner workflow fast while the public site stays locked down. The browser never gets direct Firestore write access."
            >
              <div className="flex flex-col gap-4 border-b border-white/5 pb-6 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-quiet">Owner controls</p>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-subtle">
                    Use the portfolio owner Google account to open a verified publishing session, or reset the draft to start a fresh archive entry.
                  </p>
                </div>
                <div className="flex gap-3">
                  {user ? (
                    <Button type="button" variant="ghost" onClick={handleSignOut} disabled={authLoading}>
                      Sign Out
                    </Button>
                  ) : (
                    <Button type="button" variant="secondary" onClick={handleSignIn} disabled={authLoading || isSaving}>
                      {authLoading ? 'Checking Session...' : 'Sign In With Google'}
                    </Button>
                  )}
                  <Button type="button" variant="secondary" onClick={handleReset}>
                    New Draft
                  </Button>
                </div>
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(19rem,0.8fr)]">
                <div className="overflow-hidden rounded-[1.4rem] border border-white/10 bg-[linear-gradient(160deg,rgba(56,189,248,0.12),rgba(15,23,42,0.85)_42%,rgba(2,6,23,0.96))]">
                  <div className="flex flex-col gap-4 border-b border-white/10 px-5 py-5 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.28em] text-quiet">Owner session</p>
                      <h3 className="mt-3 text-xl font-display text-white">{accessTitle}</h3>
                    </div>
                    <span className={cn('self-start rounded-full border px-3 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.24em]', accessStateClasses)}>
                      {accessStateLabel}
                    </span>
                  </div>

                  <div className="flex flex-col gap-6 px-5 py-5">
                    <div>
                      <p className="text-lg font-medium text-white">
                        {user?.email ?? (authLoading ? 'Checking saved owner session...' : 'No owner account connected yet')}
                      </p>
                      <p className="mt-3 text-sm leading-relaxed text-subtle">{accessDescription}</p>
                    </div>

                    <div className="rounded-[1.2rem] border border-white/10 bg-black/20 p-4">
                      <p className="text-xs uppercase tracking-[0.28em] text-quiet">Security gates</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-[0.65rem] uppercase tracking-[0.24em] text-white/80">
                          Firebase token
                        </span>
                        <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-[0.65rem] uppercase tracking-[0.24em] text-white/80">
                          Verified email
                        </span>
                        <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-[0.65rem] uppercase tracking-[0.24em] text-white/80">
                          Server allowlist
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-[1.4rem] border border-white/10 bg-black/15 p-5">
                  <p className="text-xs uppercase tracking-[0.28em] text-quiet">Setup checklist</p>
                  <div className="mt-4 space-y-3">
                    {accessChecklist.map((item, index) => (
                      <div key={item} className="flex gap-3 rounded-[1rem] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm leading-relaxed text-subtle">
                        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-highlight/30 bg-highlight/10 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-highlight">
                          {index + 1}
                        </span>
                        <span className="min-w-0 break-words">{item}</span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-quiet">
                    Keep Firestore client writes disabled. The dashboard should only publish through the verified Netlify function.
                  </p>
                </div>
              </div>
            </EditorSection>

            <EditorSection
              step="02"
              eyebrow="Identity"
              title="Set the project frame"
              description="Define the route, metadata, and the visual mode that control how this project first appears in the archive."
            >
              <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_18rem] xl:items-start">
                <div className="grid gap-4 md:grid-cols-2">
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

                <div className="rounded-[1.4rem] border border-white/10 bg-black/15 p-5">
                  <p className="text-xs uppercase tracking-[0.28em] text-quiet">Front-of-house details</p>
                  <div className="mt-4 space-y-3 text-sm">
                    <div className="rounded-[1rem] border border-white/10 bg-white/[0.03] px-4 py-3">
                      <p className="text-[0.65rem] uppercase tracking-[0.24em] text-quiet">Public route</p>
                      <p className="mt-2 break-all text-white">{draftRoute}</p>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                      <div className="rounded-[1rem] border border-white/10 bg-white/[0.03] px-4 py-3">
                        <p className="text-[0.65rem] uppercase tracking-[0.24em] text-quiet">Sort order</p>
                        <p className="mt-2 text-white">{payloadPreview.sortOrder}</p>
                      </div>
                      <div className="rounded-[1rem] border border-white/10 bg-white/[0.03] px-4 py-3">
                        <p className="text-[0.65rem] uppercase tracking-[0.24em] text-quiet">Featured</p>
                        <p className="mt-2 text-white">{payloadPreview.featured ? 'Yes' : 'No'}</p>
                      </div>
                    </div>
                    <p className="leading-relaxed text-subtle">
                      Keep the slug tight and stable. This becomes the public route and any future links to the project detail page.
                    </p>
                  </div>
                </div>
              </div>
            </EditorSection>

            <EditorSection
              step="03"
              eyebrow="Narrative"
              title="Write the archive story"
              description="Balance the compact card copy with the richer detail-page narrative so the archive can work at both scan speed and deep-read speed."
            >
              <div className="grid gap-4">
                <div className="grid gap-4 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
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
                </div>
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
            </EditorSection>

            <EditorSection
              step="04"
              eyebrow="System details"
              title="Tune the supporting metadata"
              description="Set the palette, tags, services, deliverables, and metrics that make the archive entry feel complete and easy to scan."
            >
              <div className="grid gap-6">
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
            </EditorSection>

            <div className="relative overflow-hidden rounded-[2rem] border border-highlight/20 bg-[linear-gradient(160deg,rgba(139,92,246,0.16),rgba(15,23,42,0.82)_42%,rgba(2,6,23,0.96))] p-6 shadow-[0_35px_110px_-65px_rgba(139,92,246,0.55)] sm:p-8">
              <div className="pointer-events-none absolute -bottom-20 left-0 h-52 w-52 rounded-full bg-cyan-400/20 blur-3xl" />
              <div className="pointer-events-none absolute -top-28 right-0 h-64 w-64 rounded-full bg-violet-400/15 blur-3xl" />
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-[0.35em] text-highlight">Publish action</p>
                  <h2 className="text-3xl font-display leading-tight text-white sm:text-[2.1rem]">Ready to send this entry to the archive?</h2>
                  <p className="max-w-2xl text-sm leading-relaxed text-subtle sm:text-base">
                    Saving will create or update the Firestore document for <span className="text-white">{draftRoute}</span> using the verified owner session.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button type="submit" className="sm:min-w-[18rem] sm:py-4" disabled={isSaving || authLoading || !user}>
                    {authLoading ? 'Checking Access...' : !user ? 'Sign In To Save' : isSaving ? 'Saving Project...' : 'Save To Archive'}
                  </Button>
                  <Button as="a" href={draftRoute} variant="secondary">
                    Preview Route
                  </Button>
                </div>
              </div>
            </div>
          </form>

          <div className="space-y-6 xl:sticky xl:top-28">
            <div className="overflow-hidden rounded-[2rem] border border-white/5 bg-[linear-gradient(165deg,rgba(56,189,248,0.14),rgba(2,6,23,0.72)_42%,rgba(2,6,23,0.92))] p-6">
              <div className="border-b border-white/5 pb-5">
                <p className="text-xs uppercase tracking-[0.35em] text-highlight">Draft snapshot</p>
                <h2 className="mt-3 text-2xl font-display text-white">{payloadPreview.title || 'Untitled archive project'}</h2>
                <p className="mt-3 break-all text-sm leading-relaxed text-subtle">{draftRoute}</p>
              </div>

              <div className="mt-5">
                <p className="text-[0.6rem] uppercase tracking-[0.28em] text-quiet">Palette</p>
                <div className="mt-2.5 flex items-center gap-2.5">
                  {payloadPreview.palette.map((color) => (
                    <span
                      key={color}
                      className="h-9 w-9 rounded-full border border-white/25 shadow-[0_3px_12px_rgba(0,0,0,0.55)]"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="grid gap-3 pt-5 sm:grid-cols-2 xl:grid-cols-1">
                {snapshotStats.map((item) => (
                  <div key={item.label} className="rounded-[1.1rem] border border-white/10 bg-black/15 px-4 py-3 transition hover:border-white/20">
                    <p className="text-[0.65rem] uppercase tracking-[0.24em] text-quiet">{item.label}</p>
                    <p className="mt-2 text-sm font-medium capitalize text-white">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/5 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-highlight">Readiness</p>
                  <p className="mt-2 text-sm text-subtle">Track the pieces needed before publishing.</p>
                </div>
                <span className="text-2xl font-display text-white">{completedChecks}/{completionChecks.length}</span>
              </div>

              <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-[linear-gradient(90deg,rgba(56,189,248,0.95),rgba(139,92,246,0.95))]" style={{ width: completionPercent }} />
              </div>

              <div className="mt-5 space-y-3">
                {completionChecks.map((item) => (
                  <div key={item.label} className={cn('flex items-start gap-3 rounded-[1rem] border px-4 py-3 transition-colors duration-300', item.complete ? 'border-emerald-400/20 bg-emerald-400/[0.045]' : 'border-white/10 bg-black/15')}>
                    <span
                      className={cn(
                        'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[0.65rem] font-semibold uppercase tracking-[0.12em]',
                        item.complete
                          ? 'border-emerald-400/35 bg-emerald-400/12 text-emerald-100'
                          : 'border-white/10 bg-white/[0.04] text-white/70',
                      )}
                    >
                      {item.complete ? 'OK' : '--'}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-white">{item.label}</p>
                      <p className="mt-1 text-sm leading-relaxed text-subtle">{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/5 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6">
              <div className="border-b border-white/10 pb-4">
                <p className="text-xs uppercase tracking-[0.35em] text-highlight">Current archive</p>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.28em] text-quiet">
                  <span>{loading ? 'Refreshing archive...' : `${projects.length} projects available`}</span>
                  <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-[0.65rem] text-white/75">
                    {source === 'firebase' ? 'Firebase source' : 'Local source'}
                  </span>
                  {error ? <span className="text-highlight">{error}</span> : null}
                </div>
              </div>
              <div className="mt-5 max-h-[34rem] space-y-3 overflow-y-auto pr-1">
                {projects.map((project) => (
                  <div key={project.slug} className="relative overflow-hidden rounded-[1.4rem] border border-white/10 bg-black/15 p-4 transition hover:border-highlight/30">
                    <div className="pointer-events-none absolute left-0 top-0 h-full w-[3px] rounded-l-[1.4rem]" style={{ backgroundColor: project.palette?.[0] ?? '#38bdf8', opacity: 0.65 }} />
                    <div className="flex flex-col gap-4 pl-1 sm:flex-row sm:items-start sm:justify-between">
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-2">
                          <p className="text-xs uppercase tracking-[0.28em] text-highlight">{project.category}</p>
                          {project.featured ? (
                            <span className="rounded-full border border-highlight/25 bg-highlight/10 px-2.5 py-1 text-[0.6rem] uppercase tracking-[0.2em] text-highlight">
                              Featured
                            </span>
                          ) : null}
                        </div>
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