import type { ArchiveProject } from '../../data/portfolio';
import { cn } from '../../lib/cn';

interface ProjectMockupProps {
  project: ArchiveProject;
  mode?: 'card' | 'detail';
  className?: string;
}

const frameClasses =
  'rounded-[1.6rem] bg-black/20 ring-1 ring-inset ring-white/12 shadow-[0_18px_50px_-35px_rgba(15,23,42,0.95)] backdrop-blur-md';

const ProjectMockup = ({ project, mode = 'card', className }: ProjectMockupProps) => {
  const [primary, secondary, base] = project.palette;
  const isDetail = mode === 'detail';

  const renderMockup = () => {
    switch (project.mockup) {
      case 'packaging':
        return (
          <div className="absolute inset-x-4 bottom-4 top-14 flex items-end justify-center gap-3 sm:inset-x-6 sm:bottom-5 sm:top-16 sm:gap-5">
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className={cn(
                  frameClasses,
                  'relative flex w-20 flex-col justify-between overflow-hidden p-4 sm:w-28',
                  index === 1 ? 'h-40 sm:h-56' : 'h-32 sm:h-48',
                )}
                style={{
                  background: `linear-gradient(180deg, ${index === 1 ? primary : secondary}26, rgba(2,6,23,0.9))`,
                  transform: index === 0 ? 'rotate(-8deg)' : index === 2 ? 'rotate(7deg)' : 'translateY(-10px)',
                }}
              >
                <div className="space-y-2">
                  <div className="h-2 w-12 rounded-full bg-white/85" />
                  <div className="h-2 w-16 rounded-full bg-white/40" />
                </div>
                <div className="space-y-2">
                  <div className="h-20 rounded-[1.2rem] border border-white/10 bg-white/10" />
                  <div className="h-2 w-full rounded-full bg-white/25" />
                </div>
              </div>
            ))}
          </div>
        );
      case 'festival':
        return (
          <div className="absolute inset-4 grid grid-cols-[1.35fr_0.85fr] gap-3 sm:inset-6 sm:gap-4 sm:grid-cols-[1.6fr_0.8fr]">
            <div className={cn(frameClasses, 'relative overflow-hidden p-5')}>
              <div className="absolute inset-0 opacity-70" style={{ background: `linear-gradient(135deg, ${primary}35, ${secondary}15)` }} />
              <div className="relative flex h-full flex-col justify-between">
                <div className="flex items-center justify-between text-[0.65rem] uppercase tracking-[0.35em] text-white/75">
                  <span>Main stage</span>
                  <span>Night one</span>
                </div>
                <div className="space-y-3">
                  <div className="h-3 w-32 rounded-full bg-white/75" />
                  <div className="h-3 w-48 rounded-full bg-white/30" />
                  <div className="grid grid-cols-3 gap-2 pt-3">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <div key={index} className="h-12 rounded-2xl border border-white/10 bg-black/20" />
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {Array.from({ length: 10 }).map((_, index) => (
                    <div key={index} className="h-2 rounded-full bg-white/20" />
                  ))}
                </div>
              </div>
            </div>
            <div className="grid gap-4">
              <div className={cn(frameClasses, 'flex items-center justify-center p-4')}>
                <div className="flex h-full w-full flex-col justify-between rounded-[1.3rem] bg-black/20 p-4">
                  <span className="text-[0.65rem] uppercase tracking-[0.35em] text-white/65">Festival pass</span>
                  <div>
                    <div className="h-2 w-20 rounded-full bg-white/75" />
                    <div className="mt-2 h-2 w-12 rounded-full bg-white/35" />
                  </div>
                </div>
              </div>
              <div className={cn(frameClasses, 'flex items-center justify-center p-4')}>
                <div className="h-28 w-28 rounded-full border border-white/15 bg-black/20" />
              </div>
            </div>
          </div>
        );
      case 'editorial':
        return (
          <div className="absolute inset-x-4 bottom-4 top-16 flex items-center justify-center gap-3 sm:inset-x-6 sm:bottom-6 sm:top-20 sm:gap-4">
            <div className={cn(frameClasses, 'h-[78%] w-[36%] rotate-[-6deg] p-4')}>
              <div className="h-full rounded-[1.2rem] bg-white/95 p-4 text-slate-900">
                <div className="h-2 w-16 rounded-full bg-slate-900/90" />
                <div className="mt-5 space-y-2">
                  <div className="h-3 w-full rounded-full bg-slate-900/15" />
                  <div className="h-3 w-4/5 rounded-full bg-slate-900/15" />
                  <div className="h-3 w-3/5 rounded-full bg-slate-900/15" />
                </div>
                <div className="mt-6 grid h-32 grid-cols-2 gap-3 rounded-[1rem] bg-slate-200/70 p-3">
                  <div className="rounded-[0.8rem] bg-slate-300/70" />
                  <div className="space-y-2">
                    <div className="h-2 w-full rounded-full bg-slate-900/15" />
                    <div className="h-2 w-full rounded-full bg-slate-900/15" />
                    <div className="h-2 w-4/5 rounded-full bg-slate-900/15" />
                  </div>
                </div>
              </div>
            </div>
            <div className={cn(frameClasses, 'h-[82%] w-[42%] rotate-[4deg] p-4')}>
              <div className="grid h-full grid-cols-2 gap-3 rounded-[1.2rem] bg-white/95 p-4 text-slate-900">
                <div className="rounded-[1rem] bg-slate-200/80 p-4">
                  <div className="h-24 rounded-[0.9rem] bg-slate-300/70" />
                  <div className="mt-4 space-y-2">
                    <div className="h-2 w-full rounded-full bg-slate-900/15" />
                    <div className="h-2 w-5/6 rounded-full bg-slate-900/15" />
                  </div>
                </div>
                <div className="space-y-3 rounded-[1rem] bg-slate-100 p-4">
                  <div className="h-3 w-20 rounded-full bg-slate-900/80" />
                  {Array.from({ length: 8 }).map((_, index) => (
                    <div key={index} className="h-2 rounded-full bg-slate-900/15" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 'product':
        return (
          <div className="absolute inset-4 grid grid-cols-[0.82fr_1.18fr] gap-3 sm:inset-6 sm:gap-4 sm:grid-cols-[0.85fr_1.15fr]">
            <div className="grid gap-4">
              <div className={cn(frameClasses, 'p-4')}>
                <div className="rounded-[1.3rem] bg-black/20 p-4">
                  <div className="h-2 w-24 rounded-full bg-white/70" />
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <div key={index} className="h-14 rounded-2xl bg-white/10" />
                    ))}
                  </div>
                </div>
              </div>
              <div className={cn(frameClasses, 'p-4')}>
                <div className="rounded-[1.3rem] bg-black/20 p-4">
                  <div className="h-2 w-16 rounded-full bg-white/65" />
                  <div className="mt-3 space-y-2">
                    <div className="h-10 rounded-2xl bg-white/10" />
                    <div className="h-10 rounded-2xl bg-white/10" />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div
                className={cn(frameClasses, 'h-full max-h-[16rem] w-[10rem] rounded-[2.1rem] p-3 sm:max-h-[22rem] sm:w-[13rem] sm:rounded-[2.3rem]')}
                style={{ transform: isDetail ? 'rotate(0deg)' : 'rotate(6deg)' }}
              >
                <div className="h-full rounded-[1.8rem] bg-black/30 p-4">
                  <div className="h-5 w-20 rounded-full bg-white/80" />
                  <div className="mt-6 h-28 rounded-[1.5rem]" style={{ background: `linear-gradient(135deg, ${primary}70, ${secondary}40)` }} />
                  <div className="mt-4 space-y-2">
                    <div className="h-3 w-full rounded-full bg-white/20" />
                    <div className="h-3 w-4/5 rounded-full bg-white/20" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'stage':
        return (
          <div className="absolute inset-4 grid grid-cols-[1.25fr_0.8fr] gap-3 sm:inset-6 sm:gap-4 sm:grid-cols-[1.4fr_0.9fr]">
            <div className={cn(frameClasses, 'relative overflow-hidden p-5')}>
              <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${primary}28, transparent 62%)` }} />
              <div className="relative flex h-full flex-col justify-between">
                <div className="h-8 rounded-[1.1rem] border border-white/10 bg-black/20" />
                <div className="h-36 rounded-[1.4rem] border border-white/10 bg-black/25" />
                <div className="grid grid-cols-4 gap-2">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <div key={index} className="h-8 rounded-2xl bg-white/10" />
                  ))}
                </div>
              </div>
            </div>
            <div className="grid gap-4">
              <div className={cn(frameClasses, 'p-4')}>
                <div className="h-full rounded-[1.2rem] bg-black/20 p-4">
                  <div className="h-2 w-20 rounded-full bg-white/70" />
                  <div className="mt-4 h-20 rounded-[1rem] bg-white/10" />
                  <div className="mt-3 space-y-2">
                    <div className="h-2 rounded-full bg-white/15" />
                    <div className="h-2 w-5/6 rounded-full bg-white/15" />
                  </div>
                </div>
              </div>
              <div className={cn(frameClasses, 'p-4')}>
                <div className="grid h-full grid-cols-2 gap-2 rounded-[1.2rem] bg-black/20 p-3">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="rounded-2xl bg-white/10" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 'hospitality':
        return (
          <div className="absolute inset-4 flex items-center justify-center gap-2 sm:inset-6 sm:gap-4">
            <div className={cn(frameClasses, 'h-[78%] w-[36%] rotate-[-6deg] p-4')}>
              <div className="h-full rounded-[1.2rem] bg-[#fff9f7] p-4 text-slate-900">
                <div className="h-3 w-24 rounded-full bg-slate-900/85" />
                <div className="mt-5 space-y-3">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="flex items-center justify-between gap-2">
                      <div className="h-2 w-3/4 rounded-full bg-slate-900/15" />
                      <div className="h-2 w-8 rounded-full bg-slate-900/25" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="relative flex h-[68%] w-[38%] items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-white/10 bg-black/20" />
              <div className="absolute inset-5 rounded-full border border-white/10 bg-white/5" />
              <div className="absolute inset-[30%] rounded-full" style={{ backgroundColor: `${secondary}55` }} />
            </div>
            <div className={cn(frameClasses, 'h-[52%] w-[22%] rotate-[7deg] p-3')}>
              <div className="h-full rounded-[1rem] border border-white/10 bg-black/20" />
            </div>
          </div>
        );
      case 'campaign':
      default:
        return (
          <div className="absolute inset-4 grid grid-cols-[1.05fr_0.95fr] gap-3 sm:inset-6 sm:gap-4 sm:grid-cols-[1.05fr_0.95fr]">
            <div className={cn(frameClasses, 'relative overflow-hidden p-4')}>
              <div className="absolute inset-0" style={{ background: `linear-gradient(160deg, ${primary}35, transparent 55%)` }} />
              <div className="relative flex h-full flex-col justify-between rounded-[1.2rem] p-4">
                <div>
                  <div className="h-2 w-16 rounded-full bg-white/75" />
                  <div className="mt-4 h-16 rounded-[1rem]" style={{ background: `linear-gradient(140deg, ${secondary}55, ${primary}28)` }} />
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-full rounded-full bg-white/20" />
                  <div className="h-3 w-3/4 rounded-full bg-white/20" />
                </div>
              </div>
            </div>
            <div className="grid gap-4">
              <div className={cn(frameClasses, 'p-4')}>
                <div className="rounded-[1.2rem] p-4">
                  <div className="h-2 w-12 rounded-full bg-white/70" />
                  <div className="mt-3 h-24 rounded-[1rem] bg-white/10" />
                </div>
              </div>
              <div className={cn(frameClasses, 'p-4')}>
                <div className="rounded-[1.2rem] p-4">
                  <div className="h-2 w-20 rounded-full bg-white/65" />
                  <div className="mt-4 space-y-2">
                    <div className="h-2 rounded-full bg-white/15" />
                    <div className="h-2 rounded-full bg-white/15" />
                    <div className="h-10 rounded-[1rem] bg-white/10" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div
      className={cn(
        'relative isolate overflow-hidden border-b border-white/[0.04]',
        isDetail ? 'h-[16.5rem] max-[359px]:h-[15rem] sm:h-[23rem] lg:h-[30rem] xl:h-[34rem]' : 'h-64 max-[359px]:h-60 sm:h-72',
        className,
      )}
      style={{
        backgroundImage: `radial-gradient(circle at 18% 18%, ${primary}55, transparent 28%), radial-gradient(circle at 82% 16%, ${secondary}55, transparent 25%), linear-gradient(135deg, ${base}, #020617 82%)`,
      }}
    >
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
      <div className="absolute inset-x-3 top-3 z-10 flex items-start justify-between gap-1.5 text-[0.54rem] uppercase tracking-[0.18em] text-white/75 max-[359px]:tracking-[0.14em] sm:inset-x-6 sm:top-6 sm:gap-3 sm:text-[0.65rem] sm:tracking-[0.3em]">
        <div className="max-w-[calc(50%-0.2rem)] truncate rounded-full bg-black/35 px-2.5 py-1.5 shadow-[0_12px_28px_-18px_rgba(15,23,42,0.95)] backdrop-blur-sm sm:max-w-none sm:px-3 sm:py-2">
          {project.client}
        </div>
        <div className="rounded-full bg-black/35 px-2.5 py-1.5 shadow-[0_12px_28px_-18px_rgba(15,23,42,0.95)] backdrop-blur-sm sm:px-3 sm:py-2">
          {project.year}
        </div>
      </div>
      <div
        className={cn(
          'absolute inset-0 origin-center max-[359px]:scale-[0.74] min-[360px]:scale-[0.82] min-[420px]:scale-[0.92] sm:scale-100',
          isDetail && 'max-[359px]:scale-[0.78] min-[360px]:scale-[0.86] min-[420px]:scale-[0.96] sm:scale-100 lg:scale-[0.94] xl:scale-100',
        )}
      >
        {renderMockup()}
      </div>
    </div>
  );
};

export default ProjectMockup;