import type { HTMLAttributes } from 'react';

import { cn } from '../../lib/cn';

type BadgeProps = HTMLAttributes<HTMLSpanElement>;

export function Badge({ className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-subtle backdrop-blur-sm',
        className,
      )}
      {...props}
    />
  );
}
