import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import gsap from 'gsap';
import { S7_COUNT, S7_EXPERTISE, S7_EXPERTISE_LABEL, S7_MATH } from '../data';
import { isMobileViewport } from '../scrollConfig';

export type Section7Handle = {
  el: HTMLElement | null;
  init: () => void;
  reset: () => void;
  update: (progress: number) => void;
};

const s7Rotations = [-6, 5, -8, 4, -3, 7, -5, 3, 0];
const s7Offsets = [
  { x: 8, y: -12 },
  { x: -10, y: 8 },
  { x: 6, y: -8 },
  { x: -8, y: 12 },
  { x: 12, y: -6 },
  { x: -6, y: 8 },
  { x: 4, y: -4 },
  { x: -4, y: 4 },
  { x: 0, y: 0 },
];

function getCardOffset(i: number) {
  const scale = isMobileViewport() ? 0.28 : 1;
  return { x: s7Offsets[i].x * scale, y: s7Offsets[i].y * scale };
}

const Section7 = forwardRef<Section7Handle>(function Section7(_, ref) {
  const sectionRef = useRef<HTMLElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const mathRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLParagraphElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const triggeredRef = useRef<boolean[]>(new Array(S7_COUNT).fill(false));
  const climaxDoneRef = useRef(false);
  const readyRef = useRef(false);
  const autoPlayTimersRef = useRef<number[]>([]);

  const clearAutoPlay = () => {
    autoPlayTimersRef.current.forEach((id) => window.clearTimeout(id));
    autoPlayTimersRef.current = [];
  };

  const getStarts = () => {
    const W = window.innerWidth;
    const H = window.innerHeight;
    const presets: [number, number][] = [
      [-W * 1.9, -H * 1.6],
      [W * 1.9, H * 1.6],
      [W * 1.9, -H * 1.6],
      [-W * 1.9, H * 1.6],
      [-W * 2.0, 0],
      [W * 2.0, 0],
      [0, -H * 2.0],
      [0, H * 2.0],
      [-W * 1.9, -H * 0.8],
    ];
    return presets.map(([x, y]) => ({ x, y }));
  };

  const flyCard = (i: number) => {
    const card = cardRefs.current[i];
    if (!card) return;
    const offset = getCardOffset(i);

    if (i === 0 && labelRef.current) {
      gsap.to(labelRef.current, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
    }
    if (hintRef.current && isMobileViewport()) {
      gsap.to(hintRef.current, { opacity: 0.7, duration: 0.5, delay: 0.3 });
    }

    gsap.to(card, {
      x: offset.x,
      y: offset.y,
      rotation: s7Rotations[i],
      duration: isMobileViewport() ? 0.45 : 0.9,
      ease: 'back.out(1.15)',
      onComplete: () => {
        if (i === S7_COUNT - 1) {
          readyRef.current = true;
          climax();
          if (hintRef.current) {
            gsap.to(hintRef.current, { opacity: 0, duration: 0.4, delay: 1.2 });
          }
        }
      },
    });
  };

  const triggerCard = (i: number) => {
    if (triggeredRef.current[i]) return;
    triggeredRef.current[i] = true;
    flyCard(i);
  };

  const scheduleAutoPlay = () => {
    clearAutoPlay();
    const mobile = isMobileViewport();
    const stagger = mobile ? 180 : 380;

    autoPlayTimersRef.current.push(
      window.setTimeout(() => {
        for (let i = 0; i < S7_COUNT; i++) {
          autoPlayTimersRef.current.push(
            window.setTimeout(() => triggerCard(i), i * stagger),
          );
        }
      }, mobile ? 120 : 320),
    );
  };

  const init = () => {
    clearAutoPlay();
    triggeredRef.current = new Array(S7_COUNT).fill(false);
    climaxDoneRef.current = false;
    readyRef.current = false;
    if (mathRef.current) gsap.set(mathRef.current, { opacity: 0, scale: 3, x: 0, y: 0 });
    if (labelRef.current) gsap.set(labelRef.current, { opacity: 0, y: 20 });
    if (hintRef.current) gsap.set(hintRef.current, { opacity: 0 });
    if (sectionRef.current) sectionRef.current.style.background = '#cc0000';
    wrapperRef.current?.classList.remove('s7-alive');
    mathRef.current?.classList.remove('s7-alive');
    const starts = getStarts();
    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      card.style.filter = '';
      gsap.set(card, { x: starts[i].x, y: starts[i].y, rotation: 0, rotateX: 0, rotateY: 0, zIndex: i + 1 });
    });
    scheduleAutoPlay();
  };

  const climax = () => {
    if (climaxDoneRef.current || !sectionRef.current) return;
    climaxDoneRef.current = true;
    gsap
      .timeline()
      .to(sectionRef.current, { filter: 'hue-rotate(180deg) saturate(4) brightness(2)', duration: 0.05 })
      .to(sectionRef.current, { filter: 'hue-rotate(-90deg) saturate(5) brightness(0.2)', duration: 0.05 })
      .to(sectionRef.current, { filter: 'hue-rotate(60deg) saturate(2) brightness(1.8)', duration: 0.05 })
      .to(sectionRef.current, { filter: 'none', duration: 0.07 })
      .to(mathRef.current, { opacity: 1, scale: 1, duration: 0.55, ease: 'expo.out', delay: 0.05 })
      .add(() => {
        wrapperRef.current?.classList.add('s7-alive');
        mathRef.current?.classList.add('s7-alive');
      });
  };

  const update = (p: number) => {
    if (!sectionRef.current) return;
    const bgT = Math.min(1, p / 0.3);
    const r = Math.round(204 * (1 - bgT));
    sectionRef.current.style.background = `rgb(${r},0,0)`;

    const divisor = isMobileViewport() ? S7_COUNT + 2 : S7_COUNT + 1;
    const mobileProgressBoost = isMobileViewport() ? 0.12 : 0;
    for (let i = 0; i < S7_COUNT; i++) {
      const thresh = i / divisor - mobileProgressBoost;
      if (!triggeredRef.current[i] && p > Math.max(0, thresh)) {
        triggerCard(i);
      }
    }
  };

  const reset = () => init();

  useImperativeHandle(ref, () => ({
    el: sectionRef.current,
    init,
    reset,
    update,
  }));

  const handleInteraction = (nx: number, ny: number, clientX: number, clientY: number) => {
    if (!readyRef.current) return;
    if (spotlightRef.current) {
      const radius = isMobileViewport() ? 120 : 190;
      spotlightRef.current.style.background = `radial-gradient(circle ${radius}px at ${clientX}px ${clientY}px, rgba(255,252,220,0.30) 0%, rgba(255,240,200,0.09) 50%, transparent 72%)`;
    }
    [6, 7, 8].forEach((idx, i) => {
      const card = cardRefs.current[idx];
      if (!card) return;
      const d = (i + 1) / 3;
      const offset = getCardOffset(idx);
      const tilt = isMobileViewport() ? 8 : 14;
      const shift = isMobileViewport() ? 16 : 30;
      gsap.to(card, {
        rotateX: -ny * tilt * d,
        rotateY: nx * tilt * d,
        x: offset.x - nx * shift * d,
        y: offset.y - ny * shift * d,
        duration: 0.9,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    });
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const onMove = (e: MouseEvent) => {
      const nx = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      const ny = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
      handleInteraction(nx, ny, e.clientX, e.clientY);
    };
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      const nx = (t.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      const ny = (t.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
      handleInteraction(nx, ny, t.clientX, t.clientY);
    };

    section.addEventListener('mousemove', onMove);
    section.addEventListener('touchmove', onTouch, { passive: true });

    return () => {
      clearAutoPlay();
      section.removeEventListener('mousemove', onMove);
      section.removeEventListener('touchmove', onTouch);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="section-7"
      className="s7-section"
      style={{
        position: 'fixed',
        inset: 0,
        background: '#cc0000',
        opacity: 0,
        pointerEvents: 'none',
        visibility: 'hidden',
        zIndex: 49,
        overflow: 'hidden',
        perspective: 1200,
        touchAction: 'auto',
      }}
    >
      <div ref={spotlightRef} id="s7-spotlight" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 25 }} />
      <div ref={labelRef} id="s7-expertise-label" className="s7-expertise-label">
        {S7_EXPERTISE_LABEL}
      </div>
      <div ref={mathRef} id="s7-math" className="s7-math">
        {S7_MATH}
      </div>
      <p ref={hintRef} id="s7-mobile-hint" className="s7-mobile-hint">
        KEEP SCROLLING — EXPERTISE DEPLOYING
      </p>
      <div ref={wrapperRef} id="s7-cards-wrapper" className="s7-cards-wrapper">
        {S7_EXPERTISE.map((item, i) => (
          <div
            key={item.num}
            className="s7-card expertise-card"
            id={`s7-card-${i + 1}`}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
          >
            <div className="expertise-card-inner">
              <span className="expertise-card-num">{item.num}</span>
              <span className="expertise-card-title">{item.title}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
});

export default Section7;
