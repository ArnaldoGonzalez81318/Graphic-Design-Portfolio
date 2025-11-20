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
        <Badge className="uppercase tracking-[0.2em] text-xs text-muted opacity-80">{eyebrow}</Badge>
      ) : null}
      <h2 className="text-3xl font-display font-semibold text-white sm:text-4xl lg:text-5xl">{title}</h2>
      {description ? (
        <p className={cn('max-w-2xl text-base text-muted sm:text-lg', align === 'center' && 'mx-auto')}>
          {description}
        </p>
      ) : null}
    </div>
  );
}
