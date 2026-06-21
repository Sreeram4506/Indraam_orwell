import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { site } from '../data/content';

const introLines = [
  'WE BUILD WHAT MATTERS',
  'SHIP WITHOUT THE NOISE',
  'SESSION INITIALIZED',
];

interface CinematicIntroProps {
  onComplete: () => void;
}

export default function CinematicIntro({ onComplete }: CinematicIntroProps) {
  const screenRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      document.body.style.overflow = '';
      onComplete();
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          if (doneRef.current) return;
          doneRef.current = true;
          document.body.style.overflow = '';
          onComplete();
        },
      });

      tl.fromTo('.intro-scan', { scaleY: 0 }, { scaleY: 1, duration: 0.6, ease: 'power2.inOut' })
        .fromTo(
          '.intro-letter',
          { opacity: 0, y: 60, rotateX: -40 },
          { opacity: 1, y: 0, rotateX: 0, duration: 0.7, stagger: 0.07, ease: 'power3.out' },
          0.25
        )
        .fromTo('.intro-rule', { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: 'power2.inOut' }, 0.55)
        .fromTo(
          '.intro-line',
          { opacity: 0, x: -24 },
          { opacity: 1, x: 0, duration: 0.45, stagger: 0.18, ease: 'power2.out' },
          0.9
        )
        .fromTo('.intro-redact', { scaleX: 0 }, { scaleX: 1, duration: 0.5, stagger: 0.12, ease: 'power2.out' }, 1.4)
        .to('.intro-tagline', { opacity: 1, duration: 0.4 }, 1.8)
        .to('.intro-counter', { opacity: 1, duration: 0.3 }, 2)
        .to('.intro-wipe', { scaleY: 1, duration: 0.9, ease: 'power4.inOut' }, 2.6)
        .to(screenRef.current, { yPercent: -100, duration: 1, ease: 'power4.inOut' }, 3.1);
    }, screenRef);

    return () => {
      ctx.revert();
      document.body.style.overflow = '';
    };
  }, [onComplete]);

  const letters = site.name.toUpperCase().split('');

  return (
    <div
      ref={screenRef}
      className="intro-screen fixed inset-0 z-[300] bg-black text-white overflow-hidden"
      aria-hidden="true"
    >
      <div className="intro-scan absolute inset-x-0 top-0 h-px bg-white/30 origin-top" />
      <div className="film-grain absolute inset-0 opacity-[0.08] mix-blend-overlay pointer-events-none" />

      <div className="relative h-full flex flex-col items-center justify-center px-6 text-center">
        <p className="intro-counter font-mono text-[9px] tracking-[0.45em] uppercase text-white/40 mb-10 opacity-0">
          INDRAAM STUDIO — PRESENTATION
        </p>

        <h1 className="font-display text-[clamp(3rem,14vw,7rem)] leading-none tracking-tight mb-6 perspective-1000">
          {letters.map((char, i) => (
            <span key={i} className="intro-letter inline-block opacity-0">
              {char}
            </span>
          ))}
        </h1>

        <div className="intro-rule w-24 h-px bg-white/50 origin-left mb-8 scale-x-0" />

        <div className="space-y-2 mb-8">
          {introLines.map((line) => (
            <p key={line} className="intro-line font-mono text-[10px] sm:text-[11px] tracking-[0.35em] uppercase text-white/70 opacity-0">
              {line}
            </p>
          ))}
        </div>

        <div className="flex flex-col gap-2 w-full max-w-md mb-10">
          {['AUTOMATE', 'LAUNCH', 'SCALE'].map((word) => (
            <div key={word} className="flex items-center gap-3 font-mono text-[9px] tracking-widest uppercase text-white/50">
              <span className="w-16 shrink-0">{word}</span>
              <span className="intro-redact flex-1 h-3 bg-white/90 origin-left scale-x-0 block" />
            </div>
          ))}
        </div>

        <p className="intro-tagline font-display text-lg sm:text-xl italic text-white/50 opacity-0">
          {site.tagline}
        </p>
      </div>

      <div className="intro-wipe absolute inset-0 bg-white origin-bottom scale-y-0 pointer-events-none" />
    </div>
  );
}
