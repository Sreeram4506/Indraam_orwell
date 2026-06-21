import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import gsap from 'gsap';
import BookScene from '../BookScene';
import { S6_LEFT_TEXT, S6_RIGHT_TEXT, S6_THOUGHTCRIME } from '../data';
import { isMobileViewport } from '../scrollConfig';

export type Section6Handle = {
  el: HTMLElement | null;
  initTexts: () => void;
  resetTexts: () => void;
  showThoughtcrime: () => void;
};

type Section6Props = {
  active: boolean;
  velocity: number;
  tiltX: number;
  tiltZ: number;
};

const Section6 = forwardRef<Section6Handle, Section6Props>(function Section6(
  { active, velocity, tiltX, tiltZ },
  ref,
) {
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const thoughtcrimeRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);
  const leftYRef = useRef(0);
  const rightYRef = useRef(0);
  const leftLoopRef = useRef(0);
  const rightLoopRef = useRef(0);
  const velocityRef = useRef(velocity);
  const [tiltState, setTiltState] = useState({ x: tiltX, z: tiltZ });

  useEffect(() => {
    velocityRef.current = velocity;
  }, [velocity]);

  const initTexts = () => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    if (leftRef.current) leftRef.current.innerHTML = S6_LEFT_TEXT.repeat(3);
    if (rightRef.current) rightRef.current.innerHTML = S6_RIGHT_TEXT.repeat(3);
    requestAnimationFrame(() => {
      if (leftRef.current) leftLoopRef.current = leftRef.current.scrollHeight / 3;
      if (rightRef.current) {
        rightLoopRef.current = rightRef.current.scrollHeight / 3;
        rightRef.current.style.transform = `translateY(${-2 * rightLoopRef.current}px)`;
      }
    });
  };

  const resetTexts = () => {
    leftYRef.current = 0;
    rightYRef.current = 0;
    if (leftRef.current) leftRef.current.style.transform = 'translateY(0)';
    if (rightRef.current) rightRef.current.style.transform = 'translateY(0)';
  };

  const showThoughtcrime = () => {
    const mobile = isMobileViewport();
    window.setTimeout(() => {
      if (!thoughtcrimeRef.current) return;
      gsap.to(thoughtcrimeRef.current, {
        opacity: 1,
        duration: mobile ? 0.3 : 0.5,
        onComplete: () => {
          window.setTimeout(() => {
            if (thoughtcrimeRef.current) gsap.to(thoughtcrimeRef.current, { opacity: 0, duration: mobile ? 0.3 : 0.5 });
          }, mobile ? 1800 : 3000);
        },
      });
    }, mobile ? 3600 : 8000);
  };

  useImperativeHandle(ref, () => ({
    el: sectionRef.current,
    initTexts,
    resetTexts,
    showThoughtcrime,
  }));

  useEffect(() => {
    if (!active) return;
    const mobile = isMobileViewport();
    let raf = 0;
    const tick = () => {
      const speed = (mobile ? 2.4 : 1.2) + velocityRef.current * (mobile ? 6.5 : 4);
      velocityRef.current *= mobile ? 0.82 : 0.9;
      leftYRef.current += speed;
      if (leftLoopRef.current > 0 && leftYRef.current >= leftLoopRef.current) {
        leftYRef.current -= leftLoopRef.current;
      }
      rightYRef.current += speed * (mobile ? 0.75 : 0.6);
      if (rightLoopRef.current > 0 && rightYRef.current >= rightLoopRef.current) {
        rightYRef.current -= rightLoopRef.current;
      }
      const blur = Math.min(velocityRef.current * (mobile ? 1.3 : 1.8), mobile ? 2.4 : 3.5);
      if (leftRef.current) {
        leftRef.current.style.filter = blur > 0.1 ? `blur(${blur}px)` : '';
        leftRef.current.style.transform = `translateY(-${leftYRef.current}px)`;
      }
      if (rightRef.current && rightLoopRef.current > 0) {
        rightRef.current.style.filter = blur > 0.1 ? `blur(${blur}px)` : '';
        rightRef.current.style.transform = `translateY(${-2 * rightLoopRef.current + rightYRef.current}px)`;
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [active]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const onMove = (e: MouseEvent) => {
      if (!active) return;
      const nx = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      const ny = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
      setTiltState({ x: ny * 0.45, z: -nx * 0.25 });
    };
    const onLeave = () => {
      setTiltState({ x: 0, z: 0 });
    };
    section.addEventListener('mousemove', onMove);
    section.addEventListener('mouseleave', onLeave);
    return () => {
      section.removeEventListener('mousemove', onMove);
      section.removeEventListener('mouseleave', onLeave);
    };
  }, [active]);

  return (
    <section
      ref={sectionRef}
      id="section-6"
      style={{
        position: 'fixed',
        inset: 0,
        background: '#cc0000',
        opacity: 0,
        pointerEvents: 'none',
        visibility: 'hidden',
        zIndex: 47,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <div
        id="s6-left"
        style={{
          position: 'absolute',
          left: '3%',
          top: 0,
          width: '22%',
          height: '100%',
          overflow: 'hidden',
          maskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)',
        }}
      >
        <div
          ref={leftRef}
          id="s6-left-text"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 'clamp(11px, 1.1vw, 16px)',
            color: '#fff',
            lineHeight: 2,
            letterSpacing: 1,
            willChange: 'transform',
          }}
        >
          {S6_LEFT_TEXT}
        </div>
      </div>
      <div
        id="s6-right"
        style={{
          position: 'absolute',
          right: '3%',
          top: 0,
          width: '22%',
          height: '100%',
          overflow: 'hidden',
          maskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)',
        }}
      >
        <div
          ref={rightRef}
          id="s6-right-text"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 'clamp(11px, 1.1vw, 16px)',
            color: '#fff',
            lineHeight: 2,
            letterSpacing: 1,
            willChange: 'transform',
          }}
        >
          {S6_RIGHT_TEXT}
        </div>
      </div>
      <BookScene active={active} velocity={velocity} tiltX={tiltState.x} tiltZ={tiltState.z} />
      <div
        ref={thoughtcrimeRef}
        id="s6-thoughtcrime"
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 20,
          opacity: 0,
          zIndex: 10,
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 'clamp(40px, 6vw, 100px)',
            color: 'white',
            letterSpacing: 8,
            textAlign: 'center',
          }}
        >
          {S6_THOUGHTCRIME.title}
        </div>
        <div
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 'clamp(16px, 2vw, 28px)',
            color: 'white',
            letterSpacing: 4,
          }}
        >
          {S6_THOUGHTCRIME.subtitle}
        </div>
      </div>
    </section>
  );
});

export default Section6;
