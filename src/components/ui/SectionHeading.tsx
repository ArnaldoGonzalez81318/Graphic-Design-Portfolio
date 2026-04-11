import type { ReactNode } from 'react';

import { cn } from '../../lib/cn';
import { Badge } from './Badge';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string | ReactNode;
  align?: 'left' | 'center';
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'flex w-full flex-col gap-4',
        align === 'center' ? 'items-center text-center' : 'items-start text-left',
        className,
      )}
    >
      {eyebrow ? (
        <Badge className="text-[0.68rem] uppercase tracking-[0.18em] text-muted opacity-80 max-[359px]:tracking-[0.14em] sm:text-xs sm:tracking-[0.2em]">
          {eyebrow}
        </Badge>
      ) : null}
      <h2 className="text-[1.72rem] font-display font-semibold leading-[1.08] text-white max-[359px]:text-[1.56rem] sm:text-4xl sm:leading-tight lg:text-5xl">
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            'max-w-2xl text-[0.95rem] leading-relaxed text-muted max-[359px]:text-[0.9rem] sm:text-lg',
            align === 'center' && 'mx-auto',
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
