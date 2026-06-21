import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const themes = {
  dark: { bg: '#000000', fg: '#ffffff' },
  light: { bg: '#ffffff', fg: '#000000' },
};

let wipeEl: HTMLDivElement | null = null;

function getWipeEl() {
  if (!wipeEl) {
    wipeEl = document.createElement('div');
    wipeEl.className = 'theme-wipe-overlay';
    document.body.appendChild(wipeEl);
  }
  return wipeEl;
}

function animateTheme(theme: 'dark' | 'light', direction: 1 | -1) {
  const { bg, fg } = themes[theme];
  const el = getWipeEl();

  document.body.dataset.theme = theme;
  document.body.style.color = fg;

  gsap.killTweensOf(el);
  gsap.set(el, { backgroundColor: bg, scaleY: 0, transformOrigin: direction === 1 ? 'bottom' : 'top' });

  gsap.timeline()
    .to(el, { scaleY: 1, duration: 0.55, ease: 'power3.inOut' })
    .to(document.body, { backgroundColor: bg, duration: 0.01 }, '<0.2')
    .to(el, { scaleY: 0, duration: 0.55, ease: 'power3.inOut', transformOrigin: direction === 1 ? 'top' : 'bottom' });
}

export function initThemeTransitions(root: ParentNode = document) {
  const sections = Array.from(root.querySelectorAll<HTMLElement>('[data-theme]'));
  if (!sections.length) return;

  const first = sections[0].dataset.theme as 'dark' | 'light';
  document.body.dataset.theme = first;
  document.body.style.backgroundColor = themes[first].bg;
  document.body.style.color = themes[first].fg;

  sections.forEach((section, i) => {
    if (i === 0) return;
    const theme = section.dataset.theme as 'dark' | 'light';

    ScrollTrigger.create({
      trigger: section,
      start: 'top 55%',
      onEnter: () => animateTheme(theme, 1),
      onEnterBack: () => animateTheme(theme, -1),
    });
  });
}

export function destroyThemeTransitions() {
  wipeEl?.remove();
  wipeEl = null;
}
