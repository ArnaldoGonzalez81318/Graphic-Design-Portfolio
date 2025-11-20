import { motion } from 'framer-motion';

import type { SkillArea } from '../../data/portfolio';
import { Badge } from '../ui/Badge';
import { SectionHeading } from '../ui/SectionHeading';

interface ExpertiseSectionProps {
  expertise: SkillArea[];
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  reveal: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: index * 0.05, duration: 0.4, ease: 'easeOut' },
  }),
};

const ExpertiseSection = ({ expertise }: ExpertiseSectionProps) => {
  return (
    <section id="expertise" className="section-padding">
      <div className="container-grid space-y-12">
        <SectionHeading
          eyebrow="Expertise"
          title="Strategic craft across the brand journey"
          description="Every engagement balances exploration and rigor. From early insight gathering to launch playbooks, I help teams orchestrate their story with design systems people remember."
        />
        <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
          {expertise.map((area, index) => (
            <motion.article
              key={area.title}
              custom={index}
              initial="hidden"
              whileInView="reveal"
              viewport={{ once: true, amount: 0.2 }}
              variants={itemVariants}
              className="group flex flex-col gap-5 rounded-3xl border border-white/5 bg-white/[0.03] p-6 shadow-[0_25px_60px_-40px_rgba(59,130,246,0.4)] transition hover:border-highlight/50 hover:bg-highlight/10 sm:p-8"
            >
              <h3 className="text-xl font-display text-white">{area.title}</h3>
              <p className="text-sm leading-relaxed text-muted">{area.summary}</p>
              <div className="flex flex-wrap gap-2">
                {area.tags.map((tag) => (
                  <Badge key={tag} className="bg-white/5 text-[0.7rem] uppercase tracking-[0.3em] text-subtle">
                    {tag}
                  </Badge>
                ))}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExpertiseSection;
