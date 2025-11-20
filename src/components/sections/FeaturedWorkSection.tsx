import { motion } from 'framer-motion';

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
  return (
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
                <span className="text-xs uppercase tracking-[0.3em] text-highlight/80">View Deck →</span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedWorkSection;
