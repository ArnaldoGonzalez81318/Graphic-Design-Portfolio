import {
  forwardRef,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type Ref,
} from 'react';

import { cn } from '../../lib/cn';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-accent text-white shadow-[0_20px_45px_-15px_rgba(139,92,246,0.65)] hover:bg-accent/90 focus-visible:outline-accent',
  secondary:
    'bg-highlight/10 text-highlight border border-highlight/40 hover:bg-highlight/20 focus-visible:outline-highlight',
  ghost:
    'bg-transparent text-muted hover:text-white hover:bg-white/5 focus-visible:outline-white',
};

interface ButtonBaseProps {
  variant?: ButtonVariant;
  className?: string;
}

interface ButtonAsButton extends ButtonBaseProps, ButtonHTMLAttributes<HTMLButtonElement> {
  as?: 'button';
}

interface ButtonAsAnchor extends ButtonBaseProps, AnchorHTMLAttributes<HTMLAnchorElement> {
  as: 'a';
}

export type ButtonProps = ButtonAsButton | ButtonAsAnchor;

const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  ({ className, variant = 'primary', as = 'button', ...props }, ref) => {
    const commonClasses = cn(
      'inline-flex min-w-0 items-center justify-center gap-2 rounded-full px-5 py-3 text-center text-[0.72rem] font-semibold uppercase leading-tight tracking-[0.2em] whitespace-nowrap transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:px-6 sm:text-sm',
      variantStyles[variant],
      className,
    );

    if (as === 'a') {
      const anchorProps = props as AnchorHTMLAttributes<HTMLAnchorElement>;
      return <a ref={ref as Ref<HTMLAnchorElement>} className={commonClasses} {...anchorProps} />;
    }

    const buttonProps = props as ButtonHTMLAttributes<HTMLButtonElement>;
    return (
      <button
        ref={ref as Ref<HTMLButtonElement>}
        type={buttonProps.type ?? 'button'}
        className={commonClasses}
        {...buttonProps}
      />
    );
  },
);

Button.displayName = 'Button';

export default Button;
