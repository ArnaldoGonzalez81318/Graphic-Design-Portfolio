import { useEffect, useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import { Link, useLocation } from 'react-router-dom';

import type { HeroContent, NavItem } from '../../data/portfolio';
import { cn } from '../../lib/cn';
import Button from '../ui/Button';

interface HeaderProps {
  nav: NavItem[];
  hero: HeroContent;
}

const Header = ({ nav, hero }: HeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isResumeExternal = hero.resumeUrl.startsWith('http') || hero.resumeUrl.startsWith('mailto:');
  const resumeLinkProps = isResumeExternal
    ? { target: '_blank', rel: 'noopener noreferrer' }
    : undefined;
  const isHomePage = location.pathname === '/';

  const toggleMenu = () => setIsOpen((prev) => !prev);

  const handleNavClick = () => {
    setIsOpen(false);
  };

  const resolveHref = (href: string) => {
    if (href.startsWith('#') && !isHomePage) {
      return `/${href}`;
    }

    return href;
  };

  const isItemActive = (href: string) => {
    if (href === '/archive') {
      return location.pathname.startsWith('/archive');
    }

    return location.pathname === href;
  };

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname, location.hash]);

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-white/5 bg-night/70 backdrop-blur-xl">
      <div className="container-grid flex h-16 items-center justify-between gap-3 sm:h-20">
        <Link to="/" className="flex min-w-0 items-center gap-3 break-normal lg:shrink-0">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/20 text-lg font-semibold text-accent sm:h-10 sm:w-10 sm:text-xl">
            LR
          </span>
          <div className="min-w-0 flex flex-col leading-tight">
            <span className="hidden whitespace-nowrap text-[0.65rem] uppercase tracking-[0.24em] text-quiet min-[420px]:block sm:text-[0.72rem] sm:tracking-[0.28em] lg:text-sm lg:tracking-[0.4em]">
              Portfolio
            </span>
            <span className="truncate text-sm font-semibold text-white sm:text-base">{hero.name}</span>
          </div>
        </Link>
        <nav className="hidden items-center gap-6 lg:flex xl:gap-10">
          {nav.map((item) => (
            <Link
              key={item.href}
              to={resolveHref(item.href)}
              className={cn(
                'relative text-sm font-medium uppercase tracking-[0.2em] transition-colors duration-200 hover:text-white',
                isItemActive(item.href) ? 'text-white' : 'text-muted',
              )}
            >
              {item.label}
              <span className="absolute left-0 top-full mt-1 h-px w-0 bg-highlight transition-all duration-200 group-hover:w-full" />
            </Link>
          ))}
        </nav>
        <div className="hidden xl:flex">
          <Button as="a" variant="secondary" href={hero.resumeUrl} {...resumeLinkProps}>
            Request CV
          </Button>
        </div>
        <button
          type="button"
          onClick={toggleMenu}
          className="inline-flex items-center justify-center rounded-lg p-2 text-subtle transition hover:bg-white/10 lg:hidden"
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
        >
          {isOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
        </button>
      </div>
      <div
        className={cn(
          'overflow-hidden transition-[max-height,opacity] duration-300 lg:hidden',
          isOpen ? 'max-h-screen opacity-100' : 'pointer-events-none max-h-0 opacity-0',
        )}
      >
        <div className="container-grid flex flex-col gap-4 pb-5 sm:pb-6">
          {nav.map((item) => (
            <Link
              key={item.href}
              to={resolveHref(item.href)}
              onClick={handleNavClick}
              className="rounded-xl border border-white/5 bg-white/5 px-4 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-soft sm:text-sm"
            >
              {item.label}
            </Link>
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
