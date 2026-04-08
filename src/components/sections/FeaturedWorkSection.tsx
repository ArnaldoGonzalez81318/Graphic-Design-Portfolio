import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

import type { CaseStudy } from '../../data/portfolio';
import { SectionHeading } from '../ui/SectionHeading';

interface FeaturedWorkSectionProps {
  work: CaseStudy[];
}

const variants = {
  hidden: { opacity: 0, y: 40 },
  reveal: (index: number) => ({ opacity: 1, y: 0, transition: { delay: index * 0.08, duration: 0.5 } }),
};

const FeaturedWorkSection = ({ work }: FeaturedWorkSectionProps) => {
  const [activeProject, setActiveProject] = useState<CaseStudy | null>(null);

  useEffect(() => {
    if (!activeProject) {
      return undefined;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveProject(null);
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleEscape);
    };
  }, [activeProject]);

  return (
    <>
      <section id="work" className="section-padding bg-ink/70">
        <div className="container-grid space-y-12">
          <SectionHeading
            eyebrow="Selected Work"
            title="Launching ideas with narrative-rich brand systems"
            description="A selection of collaborations spanning wellness, technology, and cultural experiences. Each project pairs strategic foundations with bold, sensory design moments."
          />
          <div className="grid gap-5 sm:gap-6">
            {work.map((project, index) => (
              <motion.article
                key={project.title}
                className="group relative overflow-hidden rounded-3xl border border-white/5 bg-white/[0.04] p-6 transition hover:border-highlight/60 hover:bg-highlight/10 sm:p-8"
                custom={index}
                initial="hidden"
                whileInView="reveal"
                viewport={{ once: true, amount: 0.4 }}
                variants={variants}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-3">
                    <span className="text-xs uppercase tracking-[0.3em] text-highlight">{project.industry}</span>
                    <h3 className="text-2xl font-display text-white">{project.title}</h3>
                    <p className="max-w-3xl text-sm text-muted sm:text-base">{project.summary}</p>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.3em] text-subtle">
                    Case Study
                  </span>
                </div>
                <div className="mt-6 flex items-center justify-between gap-4 border-t border-white/5 pt-6 text-sm text-subtle">
                  <p className="max-w-3xl text-muted">{project.result}</p>
                  <button
                    type="button"
                    onClick={() => setActiveProject(project)}
                    className="text-xs uppercase tracking-[0.3em] text-highlight/80 transition hover:text-highlight focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-highlight"
                    aria-haspopup="dialog"
                    aria-label={`View case study deck for ${project.title}`}
                  >
                    View Deck →
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {activeProject ? (
          <motion.div
            className="fixed inset-0 z-50 flex items-end bg-night/80 px-4 py-6 backdrop-blur-md sm:items-center sm:px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveProject(null)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="case-study-title"
              className="mx-auto w-full max-w-4xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#0b1019] shadow-[0_30px_100px_-40px_rgba(56,189,248,0.45)]"
              initial={{ opacity: 0, y: 32, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.98 }}
              transition={{ duration: 0.24, ease: 'easeOut' }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-6 border-b border-white/10 px-6 py-5 sm:px-8 sm:py-6">
                <div className="space-y-3">
                  <span className="text-xs uppercase tracking-[0.35em] text-highlight">
                    {activeProject.industry}
                  </span>
                  <div>
                    <h3 id="case-study-title" className="text-2xl font-display text-white sm:text-3xl">
                      {activeProject.title}
                    </h3>
                    <p className="mt-2 max-w-2xl text-sm text-muted sm:text-base">
                      {activeProject.summary}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveProject(null)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-lg text-subtle transition hover:border-highlight/60 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-highlight"
                  aria-label="Close case study deck"
                >
                  ×
                </button>
              </div>

              <div className="grid gap-8 px-6 py-6 sm:px-8 sm:py-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(18rem,0.8fr)]">
                <div className="space-y-6">
                  <div className="rounded-3xl border border-white/8 bg-white/[0.03] p-5 sm:p-6">
                    <p className="text-xs uppercase tracking-[0.3em] text-quiet">Project Overview</p>
                    <p className="mt-3 text-base leading-relaxed text-soft sm:text-lg">
                      {activeProject.overview}
                    </p>
                  </div>

                  <div className="rounded-3xl border border-white/8 bg-white/[0.03] p-5 sm:p-6">
                    <p className="text-xs uppercase tracking-[0.3em] text-quiet">Outcome</p>
                    <p className="mt-3 text-base leading-relaxed text-soft sm:text-lg">
                      {activeProject.impact}
                    </p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="rounded-3xl border border-white/8 bg-white/[0.03] p-5">
                    <p className="text-xs uppercase tracking-[0.3em] text-quiet">Timeline</p>
                    <p className="mt-3 text-lg text-white">{activeProject.timeline}</p>
                  </div>

                  <div className="rounded-3xl border border-white/8 bg-white/[0.03] p-5">
                    <p className="text-xs uppercase tracking-[0.3em] text-quiet">Deliverables</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {activeProject.deliverables.map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-highlight/20 bg-highlight/10 px-3 py-2 text-xs uppercase tracking-[0.22em] text-highlight"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-3xl border border-white/8 bg-gradient-to-br from-highlight/14 via-white/[0.03] to-transparent p-5">
                    <p className="text-xs uppercase tracking-[0.3em] text-quiet">Key Result</p>
                    <p className="mt-3 text-base leading-relaxed text-white">{activeProject.result}</p>
                    <a
                      href="#contact"
                      className="mt-5 inline-flex text-xs uppercase tracking-[0.3em] text-highlight transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-highlight"
                      onClick={() => setActiveProject(null)}
                    >
                      Discuss a similar project →
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
};

export default FeaturedWorkSection;
