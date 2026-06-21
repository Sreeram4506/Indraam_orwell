import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { navLinks, site } from '../data/content';
import { useScrollSpy } from '../hooks/useScrollSpy';
import { useSiteTheme } from '../hooks/useSiteTheme';
import { scrollToSection } from '../utils/scrollTo';

interface NavigationProps {
  navSolid: boolean;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  introDone?: boolean;
}

export default function Navigation({ navSolid, menuOpen, setMenuOpen, introDone = true }: NavigationProps) {
  const navRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const activeId = useScrollSpy();
  const siteTheme = useSiteTheme();

  useEffect(() => {
    if (!navRef.current || !introDone) return;
    gsap.fromTo(navRef.current, { opacity: 0, y: -16 }, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out', delay: 0.05 });
  }, [introDone]);

  useEffect(() => {
    if (menuOpen && overlayRef.current && linksRef.current) {
      gsap.to(overlayRef.current, { opacity: 1, duration: 0.35, ease: 'power2.out' });
      const children = Array.from(linksRef.current.children);
      if (children.length > 0) {
        gsap.fromTo(
          children,
          { y: 32, opacity: 0, scale: 0.95 },
          { y: 0, opacity: 1, scale: 1, duration: 0.5, stagger: 0.08, ease: 'back.out(1.6)', delay: 0.08 }
        );
      }
    } else if (!menuOpen && overlayRef.current) {
      gsap.to(overlayRef.current, { opacity: 0, duration: 0.25, ease: 'power2.in' });
    }
  }, [menuOpen]);

  const scrollTo = (href: string) => {
    setMenuOpen(false);
    scrollToSection(href);
  };

  const linkId = (href: string) => href.replace('#', '');

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 safe-top ${
          navSolid || menuOpen
            ? 'backdrop-blur-xl border-b shadow-sm'
            : 'backdrop-blur-md md:backdrop-blur-sm'
        }`}
        style={{
          backgroundColor: navSolid || menuOpen ? 'var(--chrome-bg)' : siteTheme === 'dark' ? 'rgba(0,0,0,0.75)' : 'rgba(255,255,255,0.75)',
          borderColor: 'var(--chrome-border)',
          color: 'var(--chrome-fg)',
        }}
      >
        <div className="container-main h-14 sm:h-16 flex items-center justify-between gap-3">
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex flex-col min-w-0 shrink"
          >
            <span className="font-display text-base sm:text-lg tracking-[0.2em] leading-none" style={{ color: 'var(--chrome-fg)' }}>
              {site.name.toUpperCase()}
            </span>
            <span className="font-mono text-[8px] tracking-[0.1em] uppercase mt-1 truncate max-w-[160px] sm:max-w-none md:hidden" style={{ color: 'var(--chrome-muted)' }}>
              {site.tagline}
            </span>
          </a>

          <div className="hidden md:flex items-center gap-1 lg:gap-2 flex-1 justify-center">
            {navLinks.map((link) => {
              const isActive = activeId === linkId(link.href);
              return (
                <button
                  key={link.label}
                  onClick={() => scrollTo(link.href)}
                  className={`relative font-mono text-[10px] uppercase tracking-[0.18em] px-3 py-2 rounded-full transition-all duration-300 ${
                    isActive ? 'opacity-100' : 'opacity-50 hover:opacity-80'
                  }`}
                  style={{
                    color: 'var(--chrome-fg)',
                    backgroundColor: isActive ? (siteTheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)') : 'transparent',
                  }}
                >
                  {link.label}
                </button>
              );
            })}
          </div>

          <button onClick={() => scrollTo('#contact')} className="hidden md:inline-flex btn-saffron !py-2.5 !px-5 !text-[9px]">
            <span>Get Started</span>
          </button>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden relative w-11 h-11 flex items-center justify-center -mr-1 touch-target rounded-full border"
            style={{ borderColor: 'var(--chrome-border)', backgroundColor: siteTheme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <div className="relative w-5 h-3.5 flex flex-col justify-between">
              <span className={`block h-px transition-all duration-300 origin-center ${menuOpen ? 'rotate-45 translate-y-[6px]' : ''}`} style={{ backgroundColor: 'var(--chrome-fg)' }} />
              <span className={`block h-px transition-all duration-300 ${menuOpen ? 'opacity-0 scale-x-0' : ''}`} style={{ backgroundColor: 'var(--chrome-fg)' }} />
              <span className={`block h-px transition-all duration-300 origin-center ${menuOpen ? '-rotate-45 -translate-y-[6px]' : ''}`} style={{ backgroundColor: 'var(--chrome-fg)' }} />
            </div>
          </button>
        </div>
      </nav>

      <div
        ref={overlayRef}
        className={`md:hidden fixed inset-0 z-40 backdrop-blur-xl flex flex-col items-center justify-center px-6 safe-top safe-bottom ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        style={{
          backgroundColor: siteTheme === 'dark' ? 'rgba(0,0,0,0.97)' : 'rgba(255,255,255,0.97)',
          paddingTop: '5rem',
        }}
      >
        <div ref={linksRef} className="flex flex-col items-stretch gap-2 w-full max-w-sm">
          {navLinks.map((link) => {
            const isActive = activeId === linkId(link.href);
            return (
              <button
                key={link.label}
                onClick={() => scrollTo(link.href)}
                className={`w-full py-4 px-5 rounded-2xl font-display text-2xl text-left transition-all duration-300 touch-target tap-pop ${
                  isActive
                    ? siteTheme === 'dark'
                      ? 'bg-white text-black scale-[1.02]'
                      : 'bg-black text-white scale-[1.02]'
                    : 'opacity-80'
                }`}
                style={{ color: isActive ? undefined : 'var(--chrome-fg)' }}
              >
                {link.label}
              </button>
            );
          })}
          <button onClick={() => scrollTo('#contact')} className="btn-saffron w-full justify-center mt-4 min-h-[52px]">
            <span>Let's Build Something Cool</span>
          </button>
        </div>
      </div>
    </>
  );
}
