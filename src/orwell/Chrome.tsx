import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { CORNERS, CURSOR_WORDS } from './data';

export default function CornerLabels() {
  return (
    <>
      <div id="top-left" className="corner">
        {CORNERS.topLeft}
      </div>
      <div id="top-right" className="corner">
        {CORNERS.topRight}
      </div>
      <div id="bottom-left" className="corner">
        {CORNERS.bottomLeft}
      </div>
      <div id="bottom-right" className="corner">
        {CORNERS.bottomRight}
      </div>
    </>
  );
}

export function GrainOverlay({ opacity }: { opacity: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || window.innerWidth <= 768) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const grainRes = 1;
    let raf = 0;

    const resize = () => {
      canvas.width = Math.ceil(window.innerWidth / grainRes);
      canvas.height = Math.ceil(window.innerHeight / grainRes);
    };
    resize();

    const draw = () => {
      const img = ctx.createImageData(canvas.width, canvas.height);
      for (let i = 0; i < img.data.length; i += 4) {
        const v = (Math.random() * 255) | 0;
        img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
        img.data[i + 3] = 255;
      }
      ctx.putImageData(img, 0, 0);
      raf = requestAnimationFrame(draw);
    };
    draw();
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 999,
        opacity,
        imageRendering: 'pixelated',
      }}
    />
  );
}

export function OrwellCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cursorRef.current;
    if (!el || window.innerWidth <= 768) return;
    const words = [...CURSOR_WORDS];
    let wordIndex = 0;
    let shown = false;

    const onMove = (e: MouseEvent) => {
      el.style.left = `${e.clientX}px`;
      el.style.top = `${e.clientY}px`;
      if (!shown) {
        shown = true;
        el.style.opacity = '1';
      }
    };
    window.addEventListener('mousemove', onMove);

    const interval = window.setInterval(() => {
      if (!shown) return;
      wordIndex = wordIndex === 0 ? 1 : 0;
      gsap.to(el, {
        opacity: 0,
        duration: 0.2,
        onComplete: () => {
          el.textContent = words[wordIndex];
          gsap.to(el, { opacity: 1, duration: 0.2 });
        },
      });
    }, 600);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.clearInterval(interval);
    };
  }, []);

  return <div ref={cursorRef} id="cursor-text" />;
}
