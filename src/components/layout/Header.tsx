import { useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';

import type { HeroContent, NavItem } from '../../data/portfolio';
import { cn } from '../../lib/cn';
import Button from '../ui/Button';

interface HeaderProps {
  nav: NavItem[];
  hero: HeroContent;
}

const Header = ({ nav, hero }: HeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const isResumeExternal = hero.resumeUrl.startsWith('http') || hero.resumeUrl.startsWith('mailto:');
  const resumeLinkProps = isResumeExternal
    ? { target: '_blank', rel: 'noopener noreferrer' }
    : undefined;

  const toggleMenu = () => setIsOpen((prev) => !prev);

  const handleNavClick = () => {
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-night/70 backdrop-blur-xl">
      <div className="container-grid flex h-20 items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/20 text-xl font-semibold text-accent">
            LR
          </span>
          <div className="flex flex-col leading-tight">
            <span className="text-sm uppercase tracking-[0.4em] text-quiet">Portfolio</span>
            <span className="text-base font-semibold text-white">{hero.name}</span>
          </div>
        </div>
        <nav className="hidden items-center gap-10 md:flex">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="relative text-sm font-medium uppercase tracking-[0.2em] text-muted transition-colors duration-200 hover:text-white"
            >
              {item.label}
              <span className="absolute left-0 top-full mt-1 h-px w-0 bg-highlight transition-all duration-200 group-hover:w-full" />
            </a>
          ))}
        </nav>
        <div className="hidden md:flex">
          <Button as="a" variant="secondary" href={hero.resumeUrl} {...resumeLinkProps}>
            Request CV
          </Button>
        </div>
        <button
          type="button"
          onClick={toggleMenu}
          className="inline-flex items-center justify-center rounded-lg p-2 text-subtle transition hover:bg-white/10 md:hidden"
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
        >
          {isOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
        </button>
      </div>
      <div
        className={cn(
          'md:hidden',
          isOpen ? 'max-h-screen opacity-100' : 'pointer-events-none max-h-0 opacity-0',
        )}
      >
        <div className="container-grid flex flex-col gap-4 pb-6">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={handleNavClick}
              className="rounded-xl border border-white/5 bg-white/5 px-4 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-soft"
            >
              {item.label}
            </a>
          ))}
          <Button
            as="a"
            variant="secondary"
            href={hero.resumeUrl}
            {...resumeLinkProps}
            className="w-full"
          >
            Request CV
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
