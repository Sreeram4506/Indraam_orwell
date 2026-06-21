import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)');
    if (!mq.matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring) return;

    const moveDot = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'power3.out' });
    const moveDotY = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'power3.out' });
    const moveRing = gsap.quickTo(ring, 'x', { duration: 0.35, ease: 'power3.out' });
    const moveRingY = gsap.quickTo(ring, 'y', { duration: 0.35, ease: 'power3.out' });

    const onMove = (e: MouseEvent) => {
      moveDot(e.clientX);
      moveDotY(e.clientY);
      moveRing(e.clientX);
      moveRingY(e.clientY);
    };

    const onEnter = (e: Event) => {
      const target = e.currentTarget as HTMLElement;
      const key = target.dataset.cursor || 'go';
      gsap.to(ring, { scale: 2.2, borderColor: 'rgba(0,0,0,0.7)', duration: 0.3 });
      gsap.to(dot, { scale: 0, duration: 0.2 });
      if (label) {
        label.textContent = key === 'go' ? 'go →' : key;
        gsap.to(label, { opacity: 1, scale: 1, duration: 0.2 });
      }
    };

    const onLeave = () => {
      gsap.to(ring, { scale: 1, borderColor: 'rgba(0,0,0,0.2)', duration: 0.3 });
      gsap.to(dot, { scale: 1, duration: 0.2 });
      if (label) gsap.to(label, { opacity: 0, scale: 0.8, duration: 0.2 });
    };

    const interactive = 'a, button, [data-cursor]';
    document.querySelectorAll(interactive).forEach((el) => {
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
    });

    window.addEventListener('mousemove', onMove);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.querySelectorAll(interactive).forEach((el) => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
      });
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 bg-black rounded-full -translate-x-1/2 -translate-y-1/2 mix-blend-difference pointer-events-none z-[9999] hidden md:block"
        aria-hidden="true"
      />
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-10 h-10 border border-black/20 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[9998] hidden md:flex items-center justify-center"
        aria-hidden="true"
      >
        <span
          ref={labelRef}
          className="font-mono text-[8px] uppercase tracking-widest text-black opacity-0 scale-90"
        />
      </div>
    </>
  );
}
