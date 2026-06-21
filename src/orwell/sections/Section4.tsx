import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import gsap from 'gsap';
import { S4_QUOTE } from '../data';
import { useInlineSvg } from '../hooks/useInlineSvg';

export type Section4Handle = {
  el: HTMLElement | null;
  animatePortrait: () => void;
  resetPortrait: () => void;
};

const Section4 = forwardRef<Section4Handle>(function Section4(_, ref) {
  const sectionRef = useRef<HTMLElement>(null);
  const womanRef = useInlineSvg('/orwell/svgs/woman.svg');
  const textRef = useRef<HTMLDivElement>(null);
  const vignetteRef = useRef<HTMLDivElement>(null);
  const splitRef = useRef(false);

  const animatePortrait = () => {
    const paths = [...(womanRef.current?.querySelectorAll('path') ?? [])];
    paths.forEach((p) => {
      p.style.fill = 'none';
      p.style.stroke = '#000000';
      p.style.strokeWidth = '85';
      try {
        const l = p.getTotalLength();
        p.style.strokeDasharray = String(l);
        p.style.strokeDashoffset = String(l);
      } catch {
        /* noop */
      }
    });
    const tl = gsap.timeline({ delay: 0.2 });
    tl.to(paths, { strokeDashoffset: 0, duration: 0.5, stagger: 0.00125, ease: 'none' }).add(() => {
      const textEl = textRef.current;
      if (!textEl) return;
      if (!splitRef.current) {
        splitRef.current = true;
        const words = S4_QUOTE.trim().split(/\s+/);
        textEl.innerHTML = words
          .map(
            (w) =>
              `<div style="overflow:hidden;display:inline-block;"><span class="s4w" style="font-family:'Bebas Neue',sans-serif;font-size:clamp(32px,5.5vw,96px);color:#ffffff;font-weight:900;display:inline-block;transform:translateY(110%) skewY(6deg);">${w}</span></div>`,
          )
          .join(' ');
      }
      gsap.set(textEl, { opacity: 1 });
      gsap.to('.s4w', { y: 0, skewY: 0, duration: 0.7, stagger: 0.06, ease: 'power4.out' });
    });
  };

  const resetPortrait = () => {
    womanRef.current?.querySelectorAll('path').forEach((p) => {
      try {
        (p as SVGPathElement).style.strokeDashoffset = String((p as SVGPathElement).getTotalLength());
      } catch {
        /* noop */
      }
    });
    if (textRef.current) {
      gsap.set(textRef.current, { opacity: 0 });
      splitRef.current = false;
      textRef.current.innerHTML = S4_QUOTE;
    }
  };

  useImperativeHandle(ref, () => ({
    el: sectionRef.current,
    animatePortrait,
    resetPortrait,
  }));

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const onMove = (e: MouseEvent) => {
      const nx = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      const ny = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
      const target = document.getElementById('s4-woman');
      if (target) {
        gsap.to(target, {
          rotateY: nx * 10,
          rotateX: -ny * 6,
          duration: 1.1,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      }
      if (vignetteRef.current) {
        vignetteRef.current.style.background = `radial-gradient(circle 420px at ${e.clientX}px ${e.clientY}px, rgba(0,0,0,0) 0%, rgba(0,0,0,0.28) 100%)`;
      }
    };
    const onLeave = () => {
      const target = document.getElementById('s4-woman');
      if (target) gsap.to(target, { rotateY: 0, rotateX: 0, duration: 1.4, ease: 'power3.out', overwrite: 'auto' });
      if (vignetteRef.current) vignetteRef.current.style.background = 'none';
    };
    section.addEventListener('mousemove', onMove);
    section.addEventListener('mouseleave', onLeave);
    return () => {
      section.removeEventListener('mousemove', onMove);
      section.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="section-4"
      style={{
        position: 'fixed',
        inset: 0,
        background: '#cc0000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0,
        pointerEvents: 'none',
        visibility: 'hidden',
        zIndex: 48,
      }}
    >
      <div ref={vignetteRef} id="s4-vignette" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 5 }} />
      <div
        id="s4-woman"
        ref={womanRef}
        style={{
          position: 'absolute',
          width: '40%',
          height: 'auto',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />
      <div
        ref={textRef}
        id="s4-text"
        style={{
          opacity: 0,
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexWrap: 'wrap',
          alignContent: 'center',
          justifyContent: 'center',
          gap: '1.5vw 2.5vw',
          padding: '6% 8%',
          zIndex: 2,
        }}
      >
        {S4_QUOTE}
      </div>
    </section>
  );
});

export default Section4;
