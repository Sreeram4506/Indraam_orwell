import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function isCoarsePointer() {
  return window.matchMedia('(pointer: coarse)').matches;
}

function animateDivider(divider: HTMLElement, mobile: boolean) {
  const lines = divider.querySelectorAll<HTMLElement>('.section-divider-line');
  const label = divider.querySelector<HTMLElement>('.section-divider-label, .section-divider-dot');

  if (mobile) {
    gsap.fromTo(
      lines,
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: 0.5,
        ease: 'power2.out',
        stagger: 0.05,
        scrollTrigger: { trigger: divider, start: 'top 88%', toggleActions: 'play none none none', once: true },
      }
    );
    if (label) {
      gsap.fromTo(
        label,
        { opacity: 0, scale: 0.5 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.45,
          ease: 'back.out(2)',
          scrollTrigger: { trigger: divider, start: 'top 88%', toggleActions: 'play none none none', once: true },
        }
      );
    }
    return;
  }

  gsap.fromTo(
    lines,
    { scaleX: 0, opacity: 0 },
    {
      scaleX: 1,
      opacity: 1,
      ease: 'power2.out',
      stagger: 0.06,
      scrollTrigger: { trigger: divider, start: 'top 92%', end: 'top 78%', scrub: 0.8 },
    }
  );

  if (label) {
    gsap.fromTo(
      label,
      { opacity: 0, y: 8 },
      {
        opacity: 1,
        y: 0,
        ease: 'power2.out',
        scrollTrigger: { trigger: divider, start: 'top 90%', end: 'top 78%', scrub: 0.8 },
      }
    );
  }
}

function animateSectionFlow(section: HTMLElement, index: number) {
  const inner = section.querySelector<HTMLElement>('.section-inner');
  if (!inner) return;

  const mobile = isCoarsePointer() || window.innerWidth < 768;
  const divider = section.querySelector<HTMLElement>('.section-divider');
  if (divider) animateDivider(divider, mobile);

  if (!prefersReducedMotion()) {
    section.querySelectorAll<HTMLElement>('.section-parallax').forEach((el) => {
      gsap.fromTo(
        el,
        { y: mobile ? -16 : -24 },
        {
          y: mobile ? 16 : 24,
          ease: 'none',
          scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: mobile ? 1.5 : 2.5 },
        }
      );
    });
  }

  if (index === 0) return;

  if (prefersReducedMotion()) {
    gsap.fromTo(
      inner,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.4,
        scrollTrigger: { trigger: section, start: 'top 90%', toggleActions: 'play none none none', once: true },
      }
    );
    return;
  }

  if (mobile) {
    gsap.fromTo(
      inner,
      { y: 48, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.7,
        ease: 'back.out(1.4)',
        scrollTrigger: { trigger: section, start: 'top 88%', toggleActions: 'play none none none', once: true },
      }
    );
    return;
  }

  gsap.fromTo(
    inner,
    { y: 64, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      ease: 'none',
      scrollTrigger: { trigger: section, start: 'top 92%', end: 'top 55%', scrub: 1.2 },
    }
  );
}

function animateSectionBridge(el: HTMLElement) {
  if (prefersReducedMotion()) return;

  const mobile = isCoarsePointer() || window.innerWidth < 768;

  if (mobile) {
    gsap.fromTo(
      el,
      { opacity: 0, y: 12 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 92%', toggleActions: 'play none none none', once: true },
      }
    );
    return;
  }

  gsap.fromTo(
    el,
    { opacity: 0.5, y: 16 },
    {
      opacity: 1,
      y: 0,
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'top 75%', scrub: 0.8 },
    }
  );
}

export function initSectionTransitions(root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>('.section-flow').forEach((section, index) => {
    animateSectionFlow(section, index);
  });

  root.querySelectorAll<HTMLElement>('.section-bridge').forEach((el) => {
    animateSectionBridge(el);
  });
}
