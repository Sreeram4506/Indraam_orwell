import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import gsap from 'gsap';
import { S2_QUOTE } from '../data';
import { useInlineSvg } from '../hooks/useInlineSvg';

export type Section2Handle = {
  el: HTMLElement | null;
  animateTextIn: () => void;
  animateTextOut: () => void;
  drawPrisoners: () => void;
  resetPrisoners: () => void;
};

const Section2 = forwardRef<Section2Handle>(function Section2(_, ref) {
  const sectionRef = useRef<HTMLElement>(null);
  const prisonersRef = useInlineSvg('/orwell/svgs/prisoners.svg');
  const quoteRef = useRef<HTMLParagraphElement>(null);
  const vignetteRef = useRef<HTMLDivElement>(null);
  const textSplitRef = useRef(false);

  const initSplitText = () => {
    if (textSplitRef.current || !quoteRef.current) return;
    textSplitRef.current = true;
    const words = quoteRef.current.textContent?.trim().split(' ') ?? [];
    quoteRef.current.innerHTML = words
      .map(
        (w) =>
          `<span style="display:inline-block;overflow:hidden;vertical-align:bottom;line-height:1.15;"><span class="s2-sw" style="display:inline-block;transform:translateY(110%);">${w}</span></span>`,
      )
      .join(' ');
  };

  const animateTextIn = () => {
    initSplitText();
    const targets = document.querySelectorAll<HTMLElement>('.s2-sw');
    if (!targets.length) return;

    gsap.to(targets, { y: 0, duration: 0.7, stagger: 0.04, ease: 'power3.out', delay: 0.2 });
  };

  const animateTextOut = () => {
    const targets = document.querySelectorAll<HTMLElement>('.s2-sw');
    if (!targets.length) return;
    gsap.set(targets, { y: '110%' });
  };

  const drawPrisoners = () => {
    const paths = [...(prisonersRef.current?.querySelectorAll('path') ?? [])];
    paths.forEach((p) => {
      try {
        const len = p.getTotalLength();
        p.style.fill = 'none';
        p.style.stroke = 'black';
        p.style.strokeWidth = '2';
        p.style.strokeDasharray = String(len);
        p.style.strokeDashoffset = String(len);
      } catch {
        /* noop */
      }
    });
    gsap.to(paths, { strokeDashoffset: 0, duration: 0.25, stagger: 0.0015, ease: 'power2.inOut' });
  };

  const resetPrisoners = () => {
    const paths = [...(prisonersRef.current?.querySelectorAll('path') ?? [])];
    paths.forEach((p) => {
      try {
        p.style.strokeDashoffset = String(p.getTotalLength());
      } catch {
        /* noop */
      }
    });
  };

  useImperativeHandle(ref, () => ({
    el: sectionRef.current,
    animateTextIn,
    animateTextOut,
    drawPrisoners,
    resetPrisoners,
  }));

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const onMove = (e: MouseEvent) => {
      const nx = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      const ny = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
      if (prisonersRef.current) {
        gsap.to(prisonersRef.current, {
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
      if (prisonersRef.current) {
        gsap.to(prisonersRef.current, { rotateY: 0, rotateX: 0, duration: 1.4, ease: 'power3.out', overwrite: 'auto' });
      }
      if (vignetteRef.current) vignetteRef.current.style.background = 'none';
    };

    section.addEventListener('mousemove', onMove);
    section.addEventListener('mouseleave', onLeave);
    return () => {
      section.removeEventListener('mousemove', onMove);
      section.removeEventListener('mouseleave', onLeave);
    };
  }, [prisonersRef]);

  return (
    <section
      ref={sectionRef}
      id="section-2"
      style={{
        position: 'fixed',
        inset: 0,
        background: '#cc0000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 6%',
        opacity: 0,
        pointerEvents: 'none',
        visibility: 'hidden',
        zIndex: 50,
      }}
    >
      <div ref={vignetteRef} id="s2-vignette" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 5 }} />
      <div ref={prisonersRef} id="s2-prisoners" style={{ width: '35%' }} />
      <div
        id="s2-eye"
        style={{
          position: 'absolute',
          top: '8%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 120,
          height: 120,
          background: 'white',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ width: 50, height: 50, background: 'black', borderRadius: '50%' }} />
      </div>
      <div id="s2-quote" style={{ width: '35%' }}>
        <p
          ref={quoteRef}
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 'clamp(18px, 1.9vw, 32px)',
            color: 'white',
            lineHeight: 1.3,
            letterSpacing: 1.5,
            maxWidth: '100%',
          }}
        >
          {S2_QUOTE}
        </p>
      </div>
    </section>
  );
});

export default Section2;
