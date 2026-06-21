import { forwardRef, useImperativeHandle, useRef } from 'react';
import gsap from 'gsap';
import { S8_AUTHOR, S8_CREDIT, S8_QUOTE_LINES, S8_URL } from '../data';

export type Section8Handle = {
  el: HTMLElement | null;
  animate: () => void;
};

const Section8 = forwardRef<Section8Handle>(function Section8(_, ref) {
  const sectionRef = useRef<HTMLElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const authorRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const holmRef = useRef<HTMLDivElement>(null);
  const urlRef = useRef<HTMLDivElement>(null);

  const animate = () => {
    const quoteEl = quoteRef.current;
    if (!quoteEl) return;
    const mobile = window.innerWidth <= 768;

    gsap.set([authorRef.current, holmRef.current, urlRef.current], { opacity: 0 });
    gsap.set(dividerRef.current, { width: '0px' });
    const hint = document.getElementById('s8-scroll-hint');
    if (hint) gsap.set(hint, { opacity: 0 });
    quoteEl.style.opacity = '1';

    const chars: HTMLElement[] = [];
    quoteEl.innerHTML = '';
    S8_QUOTE_LINES.forEach((line) => {
      const lineDiv = document.createElement('div');
      lineDiv.style.display = 'block';
      line.split('').forEach((ch) => {
        const span = document.createElement('span');
        span.textContent = ch === ' ' ? '\u00a0' : ch;
        span.style.display = 'inline-block';
        lineDiv.appendChild(span);
        chars.push(span);
      });
      quoteEl.appendChild(lineDiv);
    });

    gsap.set(chars, { opacity: 0, y: 60, rotationX: -90, transformOrigin: '50% 50% -20px' });

    gsap
      .timeline()
      .to({}, { duration: mobile ? 0.18 : 0.4 })
      .to(chars, {
        opacity: 1,
        y: 0,
        rotationX: 0,
        duration: mobile ? 0.95 : 1.4,
        stagger: { amount: mobile ? 1.2 : 2.2, from: 'start' },
        ease: 'power4.out',
      })
      .to(authorRef.current, { opacity: 1, duration: mobile ? 1.1 : 1.8, ease: 'power2.out' }, mobile ? '-=0.7' : '-=0.4')
      .to(dividerRef.current, { width: mobile ? '144px' : '200px', duration: mobile ? 1.05 : 1.6, ease: 'expo.inOut' }, '+=0.4')
      .to(holmRef.current, { opacity: 1, duration: mobile ? 0.8 : 1.2, ease: 'power2.out' }, '+=0.16')
      .to(urlRef.current, { opacity: 1, duration: mobile ? 0.75 : 1, ease: 'power2.out' }, '+=0.16')
      .to(hint, { opacity: 1, duration: mobile ? 0.55 : 0.8, ease: 'power2.out' }, '+=0.2');
  };

  useImperativeHandle(ref, () => ({
    el: sectionRef.current,
    animate,
  }));

  return (
    <section
      ref={sectionRef}
      id="section-8"
      style={{
        position: 'fixed',
        inset: 0,
        background: '#f5f0e8',
        opacity: 0,
        pointerEvents: 'none',
        visibility: 'hidden',
        zIndex: 51,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
    >
      <div
        ref={quoteRef}
        id="s8-quote"
        style={{
          fontFamily: "'EB Garamond', serif",
          fontSize: 'clamp(26px, 3.4vw, 56px)',
          color: '#1a1a1a',
          lineHeight: 1.15,
          letterSpacing: 1.5,
          textAlign: 'center',
          opacity: 0,
          width: 'min(92vw, 980px)',
          maxWidth: 980,
          padding: '0 4%',
        }}
      >
        {S8_QUOTE_LINES.map((line) => (
          <div key={line} style={{ display: 'block' }}>
            {line}
          </div>
        ))}
      </div>
      <div
        ref={authorRef}
        id="s8-author"
        style={{
          fontFamily: "'EB Garamond', serif",
          fontSize: 'clamp(12px, 1.2vw, 18px)',
          color: 'rgba(0,0,0,0.45)',
          letterSpacing: 4,
          textAlign: 'center',
          opacity: 0,
          marginTop: 30,
          fontStyle: 'italic',
        }}
      >
        {S8_AUTHOR}
      </div>
      <div
        ref={dividerRef}
        id="s8-divider"
        style={{ width: '0%', height: 1, background: 'rgba(0,0,0,0.2)', marginTop: 60 }}
      />
      <div
        ref={holmRef}
        id="s8-holm"
        style={{
          fontFamily: "'EB Garamond', serif",
          fontSize: 'clamp(10px, 1vw, 14px)',
          color: 'rgba(0,0,0,0.5)',
          letterSpacing: 6,
          textAlign: 'center',
          opacity: 0,
          marginTop: 40,
        }}
      >
        {S8_CREDIT}
      </div>
      <div
        ref={urlRef}
        id="s8-url"
        style={{
          fontFamily: "'EB Garamond', serif",
          fontSize: 'clamp(10px, 1vw, 14px)',
          color: 'rgba(0,0,0,0.3)',
          letterSpacing: 4,
          textAlign: 'center',
          opacity: 0,
          marginTop: 10,
        }}
      >
        {S8_URL}
      </div>
      <p
        id="s8-scroll-hint"
        style={{
          position: 'absolute',
          bottom: 'clamp(24px, 5vh, 48px)',
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 'clamp(10px, 1.1vw, 13px)',
          letterSpacing: 5,
          color: 'rgba(204,0,0,0.55)',
          opacity: 0,
          margin: 0,
          animation: 's8-hint-pulse 2.4s ease-in-out infinite',
        }}
      >
        CONTINUE — INITIATE CONTACT ↓
      </p>
    </section>
  );
});

export default Section8;
