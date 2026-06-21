import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function getDistance() {
  if (typeof window === 'undefined') return 140;
  return window.innerWidth < 768 ? 40 : window.innerWidth < 1024 ? 90 : 140;
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function isCoarsePointer() {
  return window.matchMedia('(pointer: coarse)').matches;
}

function animateFromSide(el: HTMLElement, direction: -1 | 1) {
  const reduced = prefersReducedMotion();
  const coarse = isCoarsePointer();
  const distance = getDistance() * direction;

  if (reduced) {
    gsap.fromTo(
      el,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.4,
        scrollTrigger: { trigger: el, start: 'top 92%', toggleActions: 'play none none none', once: true },
      }
    );
    return;
  }

  if (coarse) {
    gsap.fromTo(
      el,
      { y: 36, opacity: 0, scale: 0.97 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.65,
        ease: 'back.out(1.6)',
        scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none', once: true },
      }
    );
    return;
  }

  gsap.fromTo(
    el,
    { x: distance, opacity: 0 },
    {
      x: 0,
      opacity: 1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 95%',
        end: 'top 50%',
        scrub: 1.2,
      },
    }
  );
}

export function initSideReveals(root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>('.side-left').forEach((el) => animateFromSide(el, -1));
  root.querySelectorAll<HTMLElement>('.side-right').forEach((el) => animateFromSide(el, 1));
  root.querySelectorAll<HTMLElement>('.side-reveal').forEach((el, i) => {
    animateFromSide(el, i % 2 === 0 ? -1 : 1);
  });
}

export function refreshSideReveals() {
  ScrollTrigger.refresh();
}
