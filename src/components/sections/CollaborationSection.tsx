import { motion } from 'framer-motion';

import Button from '../ui/Button';

interface CollaborationSectionProps {
  email: string;
}

const CollaborationSection = ({ email }: CollaborationSectionProps) => {
  return (
    <section className="section-padding">
      <div className="container-grid">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-[2.25rem] border border-highlight/30 bg-gradient-to-r from-highlight/10 via-accent/10 to-transparent px-5 py-10 sm:rounded-[3rem] sm:px-10 sm:py-12 lg:px-16 lg:py-16 xl:px-20"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.25),transparent_55%)]" aria-hidden="true" />
          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl space-y-4 text-center lg:text-left">
              <span className="text-xs uppercase tracking-[0.4em] text-highlight">Next collaboration</span>
              <h2 className="text-2xl font-display text-white sm:text-4xl lg:text-5xl">
                Have a rebrand, campaign, or editorial launch on the horizon?
              </h2>
              <p className="text-base text-subtle">
                Let’s map out the scope, stakeholders, and rollout. I build project plans that balance creative range, production detail, and business clarity.
              </p>
            </div>
            <div className="flex flex-col gap-3 text-sm text-subtle sm:flex-row sm:flex-wrap sm:justify-center lg:flex-col lg:items-end lg:justify-start">
              <Button as="a" href={`mailto:${email}`} variant="primary" className="w-full sm:w-auto">
                Start a project
              </Button>
              <Button as="a" href="#process" variant="ghost" className="w-full sm:w-auto">
                Review process
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CollaborationSection;
