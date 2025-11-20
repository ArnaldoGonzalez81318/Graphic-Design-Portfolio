import type { FooterContent } from '../../data/portfolio';

const Footer = ({ footer }: { footer: FooterContent }) => {
  return (
    <footer id="contact" className="border-t border-white/5 bg-ink/80 pb-10 pt-16">
      <div className="container-grid flex flex-col gap-12 text-center sm:text-left lg:flex-row lg:justify-between">
        <div className="mx-auto max-w-md space-y-4 sm:mx-0">
          <span className="text-xs uppercase tracking-[0.3em] text-highlight">Let’s collaborate</span>
          <p className="text-2xl font-display text-white lg:text-3xl">{footer.studioNote}</p>
          <div className="space-y-1 text-sm text-muted">
            <p>
              Email ·{' '}
              <a className="text-highlight" href={`mailto:${footer.contact.email}`}>
                {footer.contact.email}
              </a>
            </p>
            <p>
              Phone ·{' '}
              <a className="text-highlight" href={`tel:${footer.contact.phone}`}>
                {footer.contact.phone}
              </a>
            </p>
            <p>Studio · {footer.contact.studio}</p>
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-10 text-center sm:text-left lg:flex-row lg:items-start lg:justify-end">
          <div className="sm:mx-0">
            <h3 className="text-sm uppercase tracking-[0.3em] text-quiet">Navigate</h3>
            <ul className="mt-4 space-y-2 text-sm text-subtle">
              {footer.nav.map((item) => (
                <li key={item.href}>
                  <a className="transition-colors hover:text-white" href={item.href}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="sm:mx-0">
            <h3 className="text-sm uppercase tracking-[0.3em] text-quiet">Social</h3>
            <div className="mt-4 flex flex-wrap justify-center gap-3 sm:justify-start">
              {footer.social.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 transition hover:border-highlight/60 hover:bg-highlight/10"
                >
                  <item.icon className="h-5 w-5 text-subtle transition group-hover:text-highlight" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="container-grid mt-12 border-t border-white/5 pt-6 text-center text-xs uppercase tracking-[0.3em] text-faint">
        {footer.copyright}
      </div>
    </footer>
  );
};

export default Footer;
