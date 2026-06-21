import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projects } from '../data/content';
import { ArrowRight, Play } from 'lucide-react';
import SectionDivider from '../components/SectionDivider';

gsap.registerPlugin(ScrollTrigger);

export default function Work() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      el.querySelectorAll('.project-card').forEach((card) => {
        const media = card.querySelector('.project-media');
        if (!media) return;
        gsap.fromTo(
          media,
          { clipPath: 'inset(0 100% 0 0)', opacity: 0.6 },
          {
            clipPath: 'inset(0 0% 0 0)',
            opacity: 1,
            ease: 'power2.out',
            scrollTrigger: reduced
              ? { trigger: card, start: 'top 85%', once: true }
              : { trigger: card, start: 'top 92%', end: 'top 45%', scrub: 1.2 },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="work" data-theme="light" className="section-flow theme-light relative py-16 sm:py-24 lg:py-32 overflow-hidden">
      <SectionDivider label="Work" />

      <div className="section-inner">
        <div className="container-main relative z-10">
          <div className="mb-12 sm:mb-16">
            <p className="section-kicker side-left mb-4">03 — Selected work</p>
            <h2 className="section-heading side-right text-theme">Projects that ship</h2>
          </div>

          <div className="space-y-16 sm:space-y-24">
            {projects.map((project) => (
              <article key={project.num} className="project-card group">
                <div className="project-media relative w-full aspect-[4/3] sm:aspect-[16/10] lg:aspect-[16/9] overflow-hidden rounded-2xl border border-theme bg-theme-card">
                  <video
                    src={project.video}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-95 group-hover:scale-[1.03] transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8">
                    <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-obsidian/70 mb-2 block">{project.category}</span>
                    <h3 className="font-display text-3xl sm:text-5xl text-obsidian leading-none">{project.title}</h3>
                  </div>
                  <div className="absolute top-4 right-4 w-11 h-11 rounded-full bg-obsidian/90 border border-black/10 flex items-center justify-center md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                    <Play size={16} className="text-parchment ml-0.5" fill="currentColor" />
                  </div>
                </div>

                <div className="mt-6 sm:mt-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                  <div className="md:col-span-8">
                    <p className="side-left font-body text-theme-muted text-base sm:text-lg leading-relaxed">{project.description}</p>
                  </div>
                  <div className="md:col-span-4 flex md:justify-end">
                    <button
                      type="button"
                      className="side-right inline-flex items-center justify-center gap-3 w-full md:w-auto min-h-[52px] px-6 py-3 rounded-full border border-black/12 font-mono text-[10px] uppercase tracking-widest hover:bg-black hover:text-obsidian hover:border-black transition-all duration-300"
                    >
                      View case study
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </article>
            ))}

            <div className="side-reveal interactive-card rounded-2xl p-10 sm:p-14 text-center">
              <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-black/35 mb-3 block">Coming soon</span>
              <p className="font-display text-2xl sm:text-3xl text-theme-faint">More ambitious builds on the way</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
