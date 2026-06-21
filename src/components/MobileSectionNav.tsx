import { navLinks } from '../data/content';
import { useScrollSpy } from '../hooks/useScrollSpy';
import { useSiteTheme } from '../hooks/useSiteTheme';
import { scrollToSection } from '../utils/scrollTo';

const sections = [{ id: 'home', label: 'Home' }, ...navLinks.map((l) => ({ id: l.href.replace('#', ''), label: l.label }))];

export default function MobileSectionNav() {
  const activeId = useScrollSpy();
  const siteTheme = useSiteTheme();

  return (
    <nav
      className="md:hidden fixed right-3 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-2 safe-top"
      aria-label="Section navigation"
    >
      {sections.map((s) => {
        const isActive = activeId === s.id;
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => scrollToSection(`#${s.id}`)}
            aria-label={`Go to ${s.label}`}
            aria-current={isActive ? 'true' : undefined}
            className={`rounded-full transition-all duration-300 touch-target flex items-center justify-center ${
              isActive ? 'w-2.5 h-2.5 scale-110' : 'w-2 h-2 opacity-40'
            }`}
            style={{
              backgroundColor: siteTheme === 'dark' ? (isActive ? '#ffffff' : 'rgba(255,255,255,0.35)') : isActive ? '#000000' : 'rgba(0,0,0,0.25)',
            }}
          />
        );
      })}
    </nav>
  );
}
