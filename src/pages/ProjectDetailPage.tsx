import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

import ProjectMockup from '../components/archive/ProjectMockup';
import Button from '../components/ui/Button';
import { SectionHeading } from '../components/ui/SectionHeading';
import { meta } from '../data/portfolio';
import { useArchiveProjects } from '../hooks/useArchiveProjects';

interface ProjectDetailPageProps {
  email: string;
}

const ProjectDetailPage = ({ email }: ProjectDetailPageProps) => {
  const { slug } = useParams();
  const { projects: work, loading: isLoading, source: contentSource } = useArchiveProjects();
  const project = work.find((item) => item.slug === slug);

  useEffect(() => {
    const pageTitle = project ? `${project.title} · Archive · ${meta.title}` : `Archive · ${meta.title}`;
    const pageDescription = project ? project.summary : meta.description;

    document.title = pageTitle;

    const descriptionTag = document.querySelector('meta[name="description"]');
    if (descriptionTag) {
      descriptionTag.setAttribute('content', pageDescription);
    }
  }, [project]);

  if (!project && isLoading) {
    return (
      <main className="section-padding">
        <div className="container-grid">
          <div className="rounded-[2rem] border border-white/5 bg-white/[0.03] p-8">
            <p className="text-xs uppercase tracking-[0.35em] text-highlight">Loading project</p>
            <p className="mt-4 text-lg text-subtle">Syncing archive content from Firebase.</p>
          </div>
        </div>
      </main>
    );
  }

  if (!project) {
    return (
      <main className="section-padding">
        <div className="container-grid">
          <div className="rounded-[2rem] border border-white/5 bg-white/[0.03] p-8">
            <p className="text-xs uppercase tracking-[0.35em] text-highlight">Project not found</p>
            <h1 className="mt-4 text-3xl font-display text-white">That archive project is not available.</h1>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/archive"
                className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-accent/90"
              >
                Back to archive
              </Link>
              <Button as="a" href={`mailto:${email}`} variant="secondary">
                Request the deck
              </Button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const relatedProjects = work
    .filter((item) => item.slug !== project.slug && item.category === project.category)
    .slice(0, 3);

  return (
    <main>
      <section className="relative overflow-hidden border-b border-white/5 bg-night">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.22),transparent_28%),radial-gradient(circle_at_top_right,rgba(139,92,246,0.18),transparent_28%),linear-gradient(180deg,rgba(15,23,42,0.5),transparent)]" />
        <div className="container-grid relative section-padding space-y-10">
          <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.3em] text-quiet">
            <Link to="/archive" className="transition hover:text-white">
              Archive
            </Link>
            <span>/</span>
            <span className="text-highlight">{project.title}</span>
            <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-[0.65rem] text-white/75">
              {contentSource === 'firebase' ? 'Firebase managed' : 'Local fallback'}
            </span>
          </div>

          <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_minmax(24rem,34rem)] xl:items-start">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <p className="text-xs uppercase tracking-[0.35em] text-highlight">{project.category}</p>
                <h1 className="max-w-4xl text-4xl font-display text-white sm:text-5xl lg:text-6xl">
                  {project.headline}
                </h1>
                <p className="max-w-3xl text-base leading-relaxed text-muted sm:text-lg">{project.overview}</p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button as="a" href={`mailto:${email}`}>
                  Start a similar brief
                </Button>
                <Link
                  to="/archive"
                  className="inline-flex items-center justify-center rounded-full border border-highlight/30 bg-highlight/10 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-highlight transition hover:border-highlight/60 hover:bg-highlight/20 hover:text-white"
                >
                  Back to archive
                </Link>
                {project.featured ? (
                  <Link
                    to="/#work"
                    className="inline-flex items-center justify-center rounded-full border border-white/5 bg-white/[0.03] px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-subtle transition hover:border-white/10 hover:text-white"
                  >
                    Featured case study
                  </Link>
                ) : null}
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {project.metrics.map((metric) => (
                  <div key={metric.label} className="rounded-[1.8rem] border border-white/5 bg-white/[0.03] p-5">
                    <p className="text-xs uppercase tracking-[0.3em] text-quiet">{metric.label}</p>
                    <p className="mt-3 text-2xl font-display text-white">{metric.value}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45, ease: 'easeOut', delay: 0.08 }}
              className="overflow-hidden rounded-[2rem] border border-white/5 bg-white/[0.03] shadow-[0_30px_100px_-55px_rgba(56,189,248,0.45)]"
            >
              <ProjectMockup project={project} mode="detail" />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-ink/70">
        <div className="container-grid grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.9fr)]">
          <div className="space-y-8">
            <div className="rounded-[2rem] border border-white/5 bg-white/[0.03] p-6 sm:p-8">
              <SectionHeading
                eyebrow="Challenge"
                title={project.title}
                description={project.challenge}
              />
              <p className="mt-6 text-base leading-relaxed text-subtle sm:text-lg">{project.approach}</p>
            </div>

            <div className="rounded-[2rem] border border-white/5 bg-white/[0.03] p-6 sm:p-8">
              <p className="text-xs uppercase tracking-[0.35em] text-highlight">Outcome</p>
              <p className="mt-4 text-lg leading-relaxed text-soft sm:text-xl">{project.outcome}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] border border-white/5 bg-white/[0.03] p-6">
              <p className="text-xs uppercase tracking-[0.35em] text-highlight">Services</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.services.map((service) => (
                  <span
                    key={service}
                    className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-[0.65rem] uppercase tracking-[0.28em] text-subtle"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/5 bg-white/[0.03] p-6">
              <p className="text-xs uppercase tracking-[0.35em] text-highlight">Deliverables</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.deliverables.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-highlight/20 bg-highlight/10 px-3 py-2 text-[0.65rem] uppercase tracking-[0.28em] text-highlight"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/5 bg-white/[0.03] p-6">
              <p className="text-xs uppercase tracking-[0.35em] text-highlight">Project tags</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-[0.65rem] uppercase tracking-[0.28em] text-subtle"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {relatedProjects.length > 0 ? (
        <section className="section-padding">
          <div className="container-grid space-y-8">
            <SectionHeading
              eyebrow="Related Work"
              title="More work in this area"
              description="A few adjacent projects from the archive if you want to keep browsing the same kind of brief."
            />
            <div className="grid gap-6 lg:grid-cols-3">
              {relatedProjects.map((item) => (
                <article
                  key={item.slug}
                  className="overflow-hidden rounded-[2rem] border border-white/5 bg-white/[0.03] shadow-[0_30px_100px_-60px_rgba(56,189,248,0.45)]"
                >
                  <ProjectMockup project={item} />
                  <div className="space-y-4 p-6">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-highlight">{item.category}</p>
                      <h2 className="mt-3 text-2xl font-display text-white">{item.title}</h2>
                    </div>
                    <p className="text-sm leading-relaxed text-muted">{item.summary}</p>
                    <Link className="text-xs uppercase tracking-[0.28em] text-highlight transition hover:text-white" to={`/archive/${item.slug}`}>
                      Open project
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
};

export default ProjectDetailPage;