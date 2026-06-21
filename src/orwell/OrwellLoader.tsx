import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { LOADER_NUMBERS } from './data';

type OrwellLoaderProps = {
  handLoadPromise: Promise<void>;
  onHidden: () => void;
};

export default function OrwellLoader({ handLoadPromise, onHidden }: OrwellLoaderProps) {
  const [number, setNumber] = useState('');
  const numberRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const animDoneRef = useRef(false);
  const hidingRef = useRef(false);

  useEffect(() => {
    history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    document.body.style.overflow = 'hidden';

    const isMob = window.innerWidth <= 768;
    let numIndex = 0;

    const tryHide = () => {
      if (!animDoneRef.current || hidingRef.current) return;
      hidingRef.current = true;
      const timeout = new Promise<void>((r) => window.setTimeout(r, 5000));
      Promise.race([handLoadPromise, timeout]).then(doHide);
    };

    const doHide = () => {
      const loaderEl = rootRef.current;
      if (!loaderEl) return;
      const W = window.innerWidth;
      const H = window.innerHeight;
      const glitch = document.createElement('canvas');
      glitch.style.cssText =
        'position:fixed;top:0;left:0;width:100%;height:100%;z-index:100000;pointer-events:none;';
      glitch.width = W;
      glitch.height = H;
      document.body.appendChild(glitch);
      const ctx = glitch.getContext('2d');
      if (!ctx) {
        loaderEl.style.display = 'none';
        document.body.style.overflow = '';
        onHidden();
        return;
      }

      const start = Date.now();
      const DURATION = 620;

      const frame = () => {
        const t = Math.min(1, (Date.now() - start) / DURATION);
        const ease = t * t;
        ctx.clearRect(0, 0, W, H);
        const bars = Math.floor(4 + ease * 20);
        for (let i = 0; i < bars; i++) {
          const y = Math.random() * H;
          const h = 1 + Math.random() * (ease * 55);
          const dx = (Math.random() - 0.5) * ease * 160;
          ctx.fillStyle = 'rgba(0,0,0,0.9)';
          ctx.fillRect(0, y, W, h);
          if (Math.random() < 0.65) {
            ctx.fillStyle = `rgba(204,0,0,${Math.random() * 0.6 * ease})`;
            ctx.fillRect(dx - 6, y, W, h);
          }
          if (Math.random() < 0.55) {
            ctx.fillStyle = `rgba(180,230,255,${Math.random() * 0.45 * ease})`;
            ctx.fillRect(dx + 9, y, W, h);
          }
        }
        if (Math.random() < ease * 0.45) {
          ctx.fillStyle = `rgba(255,255,255,${0.4 + Math.random() * 0.6})`;
          ctx.fillRect(0, Math.random() * H, W, Math.random() < 0.6 ? 1 : 2);
        }
        if (t > 0.48) {
          loaderEl.style.opacity = String(Math.max(0, 1 - (t - 0.48) * 1.92));
        }
        if (t < 1) {
          requestAnimationFrame(frame);
        } else {
          ctx.fillStyle = '#000';
          ctx.fillRect(0, 0, W, H);
          loaderEl.style.opacity = '0';
          window.setTimeout(() => {
            glitch.remove();
            loaderEl.style.display = 'none';
            document.body.style.overflow = '';
            onHidden();
          }, 55);
        }
      };
      frame();
    };

    const showNumber = (num: number, callback: () => void) => {
      const el = numberRef.current;
      if (!el) return;
      const staggerIn = isMob ? 0.08 : 0.15;
      const staggerOut = isMob ? 0.05 : 0.1;

      const animateIn = () => {
        setNumber(String(num));
        requestAnimationFrame(() => {
          const spans = el.querySelectorAll('span');
          gsap.set(spans, { clipPath: 'inset(100% 0 0% 0)', y: 60 });
          gsap.to(spans, {
            clipPath: 'inset(0% 0 0% 0)',
            y: 0,
            duration: 0.5,
            ease: 'power3.out',
            stagger: staggerIn,
            onComplete: callback,
          });
        });
      };

      const existing = el.querySelectorAll('span');
      if (existing.length > 0) {
        gsap.to(existing, {
          clipPath: 'inset(0 0 100% 0)',
          y: -40,
          duration: 0.4,
          ease: 'power3.in',
          stagger: staggerOut,
          onComplete: animateIn,
        });
      } else {
        animateIn();
      }
    };

    const runNumbers = () => {
      if (numIndex >= LOADER_NUMBERS.length) return;
      const num = LOADER_NUMBERS[numIndex++];
      const wait = isMob ? 300 : 600;
      showNumber(num, () => {
        const numberEl = numberRef.current;
        if (num === 100 && numberEl) {
          gsap.to(numberEl, {
            color: '#cc0000',
            duration: 0.3,
            delay: 0.2,
            onComplete: () => {
              window.setTimeout(() => {
                animDoneRef.current = true;
                tryHide();
              }, 300);
            },
          });
        } else {
          window.setTimeout(runNumbers, wait);
        }
      });
    };

    // Start animating the percentage immediately (title text removed).
    runNumbers();

    animDoneRef.current = false;

    return () => {
      document.body.style.overflow = '';
    };
  }, [handLoadPromise, onHidden]);

  return (
    <div
      ref={rootRef}
      id="loader"
      style={{
        position: 'fixed',
        inset: 0,
        background: '#000',
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: typeof window !== 'undefined' && window.innerWidth <= 768 ? 24 : 40,
      }}
    >
      <div
        ref={numberRef}
        id="loader-number"
        style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 'clamp(120px, 20vw, 280px)',
          color: 'white',
          lineHeight: 1,
          letterSpacing: -2,
          height: 'clamp(120px, 20vw, 280px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {number.split('').map((d, i) => (
          <span key={`${d}-${i}`} style={{ display: 'inline-block' }}>
            {d}
          </span>
        ))}
      </div>
      {/* Text below the loading percentage removed */}
    </div>
  );
}
