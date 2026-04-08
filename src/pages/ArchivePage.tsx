import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import ProjectMockup from '../components/archive/ProjectMockup';
import Button from '../components/ui/Button';
import { SectionHeading } from '../components/ui/SectionHeading';
import { useArchiveProjects } from '../hooks/useArchiveProjects';
import { cn } from '../lib/cn';

interface ArchivePageProps {
  email: string;
}

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  reveal: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: index * 0.05, duration: 0.45, ease: 'easeOut' },
  }),
};

const ArchivePage = ({ email }: ArchivePageProps) => {
  const { projects: work, loading: isLoading, source: contentSource, error } = useArchiveProjects();
  const [activeFilter, setActiveFilter] = useState('All');
  const filters = ['All', ...new Set(work.map((item) => item.category))];
  const visibleWork = activeFilter === 'All' ? work : work.filter((item) => item.category === activeFilter);
  const featuredCount = work.filter((item) => item.featured).length;

  return (
    <main>
      <section className="relative overflow-hidden border-b border-white/5 bg-night">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.22),transparent_30%),radial-gradient(circle_at_top_right,rgba(139,92,246,0.18),transparent_28%),linear-gradient(180deg,rgba(15,23,42,0.5),transparent)]" />
        <div className="container-grid relative section-padding space-y-12">
          <SectionHeading
            eyebrow="Archive"
            title="Expanded work archive for breadth, experiments, and supporting systems"
            description="The homepage stays tightly curated. This archive holds the wider picture: campaign systems, editorial layouts, packaging directions, event graphics, and brand-supporting pieces that show range without competing with the lead case studies."
            className="max-w-4xl"
          />
          <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.3em] text-quiet">
            <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-2">
              {contentSource === 'firebase' ? 'Firebase managed archive' : 'Local archive content'}
            </span>
            {isLoading ? <span className="text-highlight">Syncing content...</span> : null}
            {error ? <span className="text-highlight">{error}</span> : null}
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-[2rem] border border-white/8 bg-white/[0.03] p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-quiet">Projects in archive</p>
              <p className="mt-3 text-3xl font-display text-white">{work.length}</p>
            </div>
            <div className="rounded-[2rem] border border-white/8 bg-white/[0.03] p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-quiet">Featured case studies</p>
              <p className="mt-3 text-3xl font-display text-white">{featuredCount}</p>
            </div>
            <div className="rounded-[2rem] border border-white/8 bg-white/[0.03] p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-quiet">Primary use</p>
              <p className="mt-3 text-lg leading-relaxed text-subtle">
                A fast scan of visual range before a deeper conversation or a case-study review.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              to="/#work"
              className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white shadow-[0_20px_45px_-15px_rgba(139,92,246,0.65)] transition hover:bg-accent/90"
            >
              Review Featured Studies
            </Link>
            <Button as="a" href={`mailto:${email}`} variant="secondary">
              Discuss a Similar Brief
            </Button>
          </div>
        </div>
      </section>

      <section className="section-padding bg-ink/70">
        <div className="container-grid space-y-10">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl space-y-3">
              <p className="text-xs uppercase tracking-[0.35em] text-highlight">Filter by focus</p>
              <p className="text-base text-muted sm:text-lg">
                Use the categories below to scan the kind of work that matters most to your team.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  className={cn(
                    'rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] transition',
                    activeFilter === filter
                      ? 'border-highlight/70 bg-highlight/15 text-white'
                      : 'border-white/10 bg-white/[0.03] text-subtle hover:border-highlight/40 hover:text-white',
                  )}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {visibleWork.map((project, index) => {
              const [primary, secondary, base] = project.palette;

              return (
                <motion.article
                  key={project.slug}
                  custom={index}
                  initial="hidden"
                  whileInView="reveal"
                  viewport={{ once: true, amount: 0.2 }}
                  variants={cardVariants}
                  className="group overflow-hidden rounded-[2rem] border border-white/8 bg-white/[0.03] shadow-[0_30px_90px_-55px_rgba(56,189,248,0.45)] transition hover:border-highlight/40"
                >
                  <Link to={`/archive/${project.slug}`} aria-label={`Open project ${project.title}`}>
                    <ProjectMockup project={project} />
                  </Link>

                  <div className="space-y-5 p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-2">
                        <p className="text-xs uppercase tracking-[0.3em] text-highlight">{project.category}</p>
                        <h2 className="text-2xl font-display text-white">{project.title}</h2>
                        <p className="text-sm uppercase tracking-[0.28em] text-quiet">{project.format}</p>
                      </div>
                      {project.featured ? (
                        <span className="rounded-full border border-highlight/25 bg-highlight/10 px-3 py-2 text-[0.65rem] uppercase tracking-[0.28em] text-highlight">
                          Featured
                        </span>
                      ) : null}
                    </div>

                    <p className="text-sm leading-relaxed text-muted sm:text-base">{project.summary}</p>

                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-[0.65rem] uppercase tracking-[0.28em] text-subtle"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between gap-4 border-t border-white/8 pt-5 text-xs uppercase tracking-[0.28em] text-quiet">
                      <span>{project.client}</span>
                      <Link className="text-highlight transition hover:text-white" to={`/archive/${project.slug}`}>
                        Open project
                      </Link>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
};

export default ArchivePage;