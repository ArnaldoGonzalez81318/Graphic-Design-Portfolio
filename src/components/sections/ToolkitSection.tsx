import { motion } from 'framer-motion';

import type { Tool } from '../../data/portfolio';
import { SectionHeading } from '../ui/SectionHeading';

interface ToolkitSectionProps {
  tools: Tool[];
}

const ToolkitSection = ({ tools }: ToolkitSectionProps) => {
  return (
    <section id="toolkit" className="section-padding bg-night/80">
      <div className="container-grid space-y-12">
        <SectionHeading
          eyebrow="Toolkit"
          title="Production-ready tools for cross-channel storytelling"
          description="Hands-on across the Adobe suite with deep collaboration alongside motion, development, and strategy partners."
          align="center"
        />
        <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {tools.map((tool, index) => (
            <motion.div
              key={tool.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              className="flex flex-col gap-5 rounded-3xl border border-white/5 bg-white/[0.03] p-6 shadow-[0_25px_60px_-45px_rgba(139,92,246,0.45)] sm:p-8"
            >
              <div
                className="flex h-16 w-16 items-center justify-center rounded-2xl"
                style={{ backgroundColor: `${tool.accent}1a` }}
              >
                <img src={tool.logo} alt={tool.name} className="h-10 w-10 object-contain" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-display text-white">{tool.name}</h3>
                <p className="text-sm leading-relaxed text-muted">{tool.summary}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ToolkitSection;
