export function scrollToSection(selector: string) {
  const el = document.querySelector<HTMLElement>(selector);
  if (!el) return;

  const isMobile = window.innerWidth < 768;

  // Prefer deterministic scrolling for mobile where the app uses snap/section boundaries.
  const rect = el.getBoundingClientRect();
  const top = rect.top + window.scrollY;

  // Account for fixed header height (matches Navigation: h-14 sm:h-16 ~ 56-64px).
  const headerOffset = 72;

  if (isMobile) {
    window.scrollTo({ top: Math.max(0, Math.round(top - headerOffset)), behavior: 'auto' });
    return;
  }

  window.scrollTo({ top: Math.max(0, Math.round(top - headerOffset)), behavior: 'smooth' });
}
