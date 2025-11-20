import { motion } from 'framer-motion';

import type { ProcessStep } from '../../data/portfolio';
import { SectionHeading } from '../ui/SectionHeading';

interface ProcessSectionProps {
  steps: ProcessStep[];
}

const ProcessSection = ({ steps }: ProcessSectionProps) => {
  return (
    <section id="process" className="section-padding">
      <div className="container-grid space-y-12">
        <SectionHeading
          eyebrow="Process"
          title="A collaborative path from discovery to launch"
          description="Every phase is built to make feedback clear and momentum tangible. I tailor ceremonies and artifacts to suit the team, keeping delivery grounded in measurable goals."
          align="center"
        />
        <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              className="relative flex flex-col gap-4 rounded-3xl border border-white/5 bg-white/[0.03] p-5 sm:p-6"
            >
              <span className="text-xs uppercase tracking-[0.4em] text-highlight/80">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="text-lg font-display text-white">{step.title}</h3>
              <p className="text-sm leading-relaxed text-muted">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
