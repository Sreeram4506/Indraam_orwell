import { forwardRef, useImperativeHandle, useRef } from 'react';
import gsap from 'gsap';
import { NEWSPAPER } from '../data';
import { typeWriter } from '../utils/typewriter';

export type Section3Handle = {
  el: HTMLElement | null;
  inner: HTMLElement | null;
  headline: HTMLElement | null;
  animateIn: () => void;
  resetHeadline: () => void;
};

const Section3 = forwardRef<Section3Handle>(function Section3(_, ref) {
  const sectionRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);

  useImperativeHandle(ref, () => ({
    el: sectionRef.current,
    inner: innerRef.current,
    headline: headlineRef.current,
    animateIn: () => {
      if (innerRef.current) {
        gsap.fromTo(
          innerRef.current,
          { scale: 0.1, rotation: 720, opacity: 0 },
          { scale: 1, rotation: 0, opacity: 1, duration: 1.8, ease: 'power4.out' },
        );
      }
      if (headlineRef.current) {
        gsap.from(headlineRef.current, { rotation: -1, y: 20, duration: 0.8, ease: 'power2.out', delay: 0.5 });
        typeWriter(headlineRef.current, NEWSPAPER.headline, 80);
      }
    },
    resetHeadline: () => {
      if (headlineRef.current) headlineRef.current.textContent = '';
    },
  }));

  return (
    <section
      ref={sectionRef}
      id="section-3"
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        background: '#f5f0e8',
        alignItems: 'stretch',
        opacity: 0,
        pointerEvents: 'none',
        visibility: 'hidden',
        zIndex: 48,
        fontFamily: "'Bebas Neue', sans-serif",
        overflow: 'hidden',
      }}
    >
      <div ref={innerRef} id="section-3-inner" style={{ display: 'flex', width: '100%', height: '100%' }}>
        <div
          className="newspaper-left"
          style={{
            width: '55%',
            padding: '60px 40px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            borderRight: '2px solid #1a1a1a',
          }}
        >
          <div style={{ fontSize: 15, letterSpacing: 4, color: '#1a1a1a', marginBottom: 8 }}>{NEWSPAPER.masthead}</div>
          <div style={{ fontSize: 14, letterSpacing: 3, color: '#1a1a1a', marginBottom: 4 }}>{NEWSPAPER.date}</div>
          <div style={{ width: '100%', height: 2, background: '#1a1a1a', marginBottom: 8 }} />
          <div style={{ fontSize: 14, letterSpacing: 2, color: '#1a1a1a', marginBottom: 30 }}>{NEWSPAPER.edition}</div>
          <h1
            ref={headlineRef}
            id="s3-headline"
            style={{
              fontSize: 'clamp(48px, 6vw, 96px)',
              color: '#1a1a1a',
              lineHeight: 0.9,
              marginBottom: 20,
              overflow: 'hidden',
              whiteSpace: 'pre-line',
            }}
          />
          <div style={{ width: '100%', height: 1, background: '#1a1a1a', marginBottom: 20 }} />
          <div style={{ flex: 1, fontSize: 15, lineHeight: 1.8, color: '#1a1a1a', letterSpacing: 1 }}>
            {NEWSPAPER.lines.map((line, i) =>
              'redacted' in line && line.redacted ? (
                <div key={i} className="redacted-line redacted" data-truth={line.truth}>
                  {line.text}
                </div>
              ) : (
                <div key={i} className="redacted-line">
                  {line.text}
                </div>
              ),
            )}
          </div>
          <div
            style={{
              marginTop: 30,
              fontSize: 14,
              letterSpacing: 3,
              color: '#1a1a1a',
              borderTop: '1px solid #1a1a1a',
              paddingTop: 10,
            }}
          >
            {NEWSPAPER.footer}
          </div>
        </div>
        <div id="s3-photo-wrap" style={{ width: '45%', position: 'relative', overflow: 'hidden' }}>
          <video
            id="s3-photo"
            src={NEWSPAPER.photoSrc}
            autoPlay
            muted
            loop
            playsInline
            aria-label={NEWSPAPER.photoAlt}
            style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(35%) contrast(1.15)' }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: '#1a1a1a',
              color: '#f5f0e8',
              padding: '12px 16px',
              fontSize: 15,
              letterSpacing: 2,
              zIndex: 10,
            }}
          >
            {NEWSPAPER.photoCaption}
          </div>
        </div>
      </div>
    </section>
  );
});

export default Section3;
