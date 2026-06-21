import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { heroCopy, heroStats, valueProps } from '../data/content';
import MagneticButton from '../components/MagneticButton';
import TiltCard from '../components/TiltCard';
import RotatingWord from '../components/RotatingWord';
import MobileSnapRow from '../components/MobileSnapRow';
import { scrollToSection } from '../utils/scrollTo';

export default function Hero({ introDone = true }: { introDone?: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!introDone) return;
    const ctx = gsap.context(() => {
      gsap.timeline({ delay: 0.08 })
        .fromTo('.hero-badge', { opacity: 0, y: -10, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(2)' })
        .fromTo('.hero-headline', { opacity: 0, y: 36 }, { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out' }, 0.08)
        .fromTo('.hero-desc', { opacity: 0, x: -16 }, { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' }, 0.2)
        .fromTo('.hero-cta > *', { opacity: 0, y: 12, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.4, stagger: 0.08, ease: 'back.out(1.8)' }, 0.3)
        .fromTo('.hero-stat', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.35, stagger: 0.06, ease: 'back.out(1.6)' }, 0.4)
        .fromTo('.hero-card', { opacity: 0, y: 24, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.45, stagger: 0.08, ease: 'back.out(1.5)' }, 0.45);
    }, sectionRef);
    return () => ctx.revert();
  }, [introDone]);

  useEffect(() => {
    const el = sectionRef.current;
    const canvas = canvasRef.current;
    if (!el || !canvas || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const ctx2d = canvas.getContext('2d');
    if (!ctx2d) return;

    let raf = 0;
    let w = 1;
    let h = 1;
    let dpr = 1;
    const pointer = { x: 0, y: 0, vx: 0, vy: 0, lastX: 0, lastY: 0 };
    type Particle = { x: number; y: number; vx: number; vy: number; life: number; alpha: number };
    const particles: Particle[] = [];

    const resize = () => {
      const rect = el.getBoundingClientRect();
      w = Math.max(1, Math.floor(rect.width));
      h = Math.max(1, Math.floor(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      pointer.vx = e.clientX - rect.left - pointer.lastX;
      pointer.vy = e.clientY - rect.top - pointer.lastY;
      pointer.lastX = e.clientX - rect.left;
      pointer.lastY = e.clientY - rect.top;
      pointer.x = pointer.lastX;
      pointer.y = pointer.lastY;
      const mag = Math.hypot(pointer.vx, pointer.vy);
      const count = Math.min(14, Math.max(2, Math.floor(mag / 10)));
      const dir = Math.atan2(pointer.vy, pointer.vx || 1e-6);
      for (let i = 0; i < count; i++) {
        const angle = dir + (Math.random() - 0.5) * 1.1;
        particles.push({
          x: pointer.x,
          y: pointer.y,
          vx: Math.cos(angle) * (1 + Math.random() * 2.5),
          vy: Math.sin(angle) * (1 + Math.random() * 2.5),
          life: 1,
          alpha: 0.35 + Math.random() * 0.5,
        });
      }
    };

    const draw = () => {
      ctx2d.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx2d.fillRect(0, 0, w, h);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.018;
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }
        const a = p.life * p.alpha;
        ctx2d.strokeStyle = `rgba(255, 255, 255, ${a * 0.75})`;
        ctx2d.lineWidth = 1.2;
        ctx2d.lineCap = 'round';
        ctx2d.beginPath();
        ctx2d.moveTo(p.x, p.y);
        ctx2d.lineTo(p.x - p.vx * 4, p.y - p.vy * 4);
        ctx2d.stroke();
      }
      raf = requestAnimationFrame(draw);
    };

    resize();
    raf = requestAnimationFrame(draw);
    el.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener('pointermove', onMove);
      window.removeEventListener('resize', resize);
    };
  }, []);

  const scrollTo = scrollToSection;

  return (
    <section
      ref={sectionRef}
      id="home"
      data-theme="dark"
      className="section-flow theme-dark relative min-h-[100dvh] flex flex-col justify-center overflow-hidden pt-[4.5rem] pb-24 md:pt-0 md:pb-16"
    >
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 w-full h-full opacity-70 hidden lg:block pointer-events-none" style={{ zIndex: 1 }} />
      <div className="absolute inset-0 bg-grid opacity-[0.15] hidden md:block pointer-events-none section-parallax" />

      <div className="section-inner w-full">
        <div className="container-main relative z-[3] py-6 md:py-20 lg:py-28">
          <div className="max-w-4xl">
            <p className="hero-badge inline-flex items-center gap-2 font-mono text-[10px] sm:text-[11px] tracking-[0.14em] uppercase text-theme-muted mb-5 sm:mb-7 px-3 py-1.5 border border-theme rounded-full bg-theme-card">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              {heroCopy.badge}
            </p>

            <h1 className="hero-headline font-display text-[clamp(2.25rem,8vw,4.75rem)] leading-[0.98] tracking-tight mb-5 sm:mb-7">
              {heroCopy.headlinePrefix}{' '}
              <RotatingWord words={heroCopy.rotatingWords} />
              <br />
              <span className="text-theme-muted">{heroCopy.headlineSuffix}</span>
            </h1>

            <p className="hero-desc font-body text-theme-muted text-[15px] sm:text-lg leading-relaxed max-w-2xl mb-8 sm:mb-10 pl-4 border-l-2 border-theme">
              {heroCopy.description}
            </p>

            <div className="hero-cta flex flex-col gap-3 sm:gap-4 mb-10 sm:mb-12">
              <MagneticButton className="btn-saffron btn-glow tap-pop w-full sm:w-auto justify-center min-h-[52px] rounded-xl sm:rounded-none" onClick={() => scrollTo('#contact')}>
                <span className="flex items-center gap-3 font-bold">
                  {heroCopy.primaryCta}
                  <ArrowRight size={14} />
                </span>
              </MagneticButton>
              <MagneticButton className="btn-outline tap-pop w-full sm:w-auto justify-center min-h-[52px] rounded-xl sm:rounded-none" onClick={() => scrollTo('#work')} strength={0.2}>
                <span className="flex items-center gap-3">{heroCopy.secondaryCta}</span>
              </MagneticButton>
            </div>

            <div className="hero-stats grid grid-cols-3 gap-2 sm:gap-8 max-w-lg border-t border-theme pt-6 sm:pt-8">
              {heroStats.map((stat) => (
                <div key={stat.label} className="hero-stat text-center sm:text-left">
                  <p className="font-display text-2xl sm:text-4xl text-theme leading-none mb-1">{stat.value}</p>
                  <p className="font-mono text-[8px] sm:text-[9px] uppercase tracking-wider text-theme-faint leading-tight">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 sm:mt-14">
            <div className="flex items-center justify-between mb-4 md:hidden">
              <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-theme-faint">Swipe cards →</p>
              <span className="font-mono text-[9px] text-theme-faint animate-pulse-soft">● ● ●</span>
            </div>
            <MobileSnapRow>
              {valueProps.map((item) => (
                <TiltCard key={item.title} className="hero-card interactive-card rounded-2xl p-5 sm:p-6 h-full">
                  <span className="text-3xl mb-3 block fun-emoji">{item.emoji}</span>
                    <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-theme-faint mb-2">{item.icon}</p>
                    <h2 className="font-display text-xl sm:text-2xl text-theme mb-2 leading-tight">{item.title}</h2>
                    <p className="font-body text-theme-muted text-sm leading-relaxed">{item.description}</p>
                </TiltCard>
              ))}
            </MobileSnapRow>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => scrollTo('#philosophy')}
        className="absolute bottom-5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 z-[3] text-theme-faint active:text-theme-muted transition-colors md:bottom-6"
        aria-label="Scroll to next section"
      >
        <span className="font-mono text-[8px] sm:text-[9px] tracking-[0.35em] uppercase">Keep going</span>
        <ChevronDown size={18} className="animate-bounce" />
      </button>
    </section>
  );
}
