import { motion } from 'framer-motion';

import type { HeroContent } from '../../data/portfolio';
import Button from '../ui/Button';

interface HeroSectionProps {
  hero: HeroContent;
}

const HeroSection = ({ hero }: HeroSectionProps) => {
  return (
    <section id="home" className="relative overflow-hidden bg-night">
      <div className="absolute inset-0 bg-aurora opacity-70" aria-hidden="true" />
      <div className="container-grid relative mx-auto flex w-full max-w-6xl flex-col items-center gap-10 px-4 py-14 sm:gap-12 sm:px-8 sm:py-20 xl:grid xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] xl:items-start xl:gap-20 xl:px-16 xl:py-24 2xl:gap-24 2xl:px-20 2xl:py-28">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="w-full max-w-3xl space-y-8 text-center xl:max-w-2xl xl:text-left"
        >
          <div className="mx-auto max-w-2xl space-y-4 xl:mx-0">
            <span className="text-xs uppercase tracking-[0.4em] text-highlight">{hero.title}</span>
            <h1 className="text-[2.3rem] font-display font-semibold leading-snug text-white sm:text-4xl sm:leading-tight md:text-5xl xl:text-6xl 2xl:text-7xl">
              {hero.headline}
            </h1>
            <p className="mx-auto max-w-2xl text-base leading-relaxed text-muted sm:text-lg md:text-xl xl:mx-0">
              {hero.description}
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
            <Button
              as="a"
              href={hero.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              Download CV
            </Button>
            <Button as="a" variant="ghost" href="#work" className="w-full sm:w-auto">
              Explore Work
            </Button>
          </div>
          <div className="flex w-full flex-wrap justify-center gap-8 text-sm text-muted sm:justify-start">
            <div className="min-w-[160px] text-center sm:text-left">
              <span className="text-xs uppercase tracking-[0.4em] text-quiet">Based in</span>
              <p className="text-base text-white">{hero.location}</p>
            </div>
            <div className="min-w-[160px] text-center sm:text-left">
              <span className="text-xs uppercase tracking-[0.4em] text-quiet">Availability</span>
              <p className="text-base text-white">{hero.availability}</p>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-3 sm:justify-start">
            {hero.social.map((item) => (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/5 bg-white/5 backdrop-blur-sm transition hover:border-highlight hover:bg-highlight/10 sm:h-12 sm:w-12"
              >
                <item.icon className="h-6 w-6 text-subtle transition group-hover:text-highlight" />
              </a>
            ))}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
          className="relative w-full max-w-lg rounded-[2.5rem] border border-white/5 bg-gradient-to-br from-white/10 via-transparent to-white/5 p-6 text-white shadow-[0_30px_120px_-60px_rgba(56,189,248,0.55)] sm:max-w-xl sm:p-8 xl:ml-auto xl:max-w-lg"
        >
          <div className="space-y-6">
            <div className="rounded-3xl bg-white/5 p-6 text-left shadow-inner">
              <p className="text-sm uppercase tracking-[0.3em] text-subtle">Impact</p>
              <p className="mt-3 text-2xl font-display text-white">
                Pairing strategic storytelling with tactile detail to create work that travels across channels.
              </p>
            </div>
            <div className="grid gap-4 min-[420px]:grid-cols-2 sm:grid-cols-3">
              {hero.metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-3xl border border-white/5 bg-white/5 p-5 text-center shadow-inner"
                >
                  <p className="text-3xl font-semibold text-highlight">{metric.value}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.3em] text-muted">{metric.label}</p>
                </div>
              ))}
            </div>
            <div className="rounded-3xl border border-white/5 bg-white/5 p-6 text-sm leading-relaxed text-subtle">
              Currently mentoring emerging designers through community workshops and remote critiques.
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
