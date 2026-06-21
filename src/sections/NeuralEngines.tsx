import { useRef } from 'react';
import { philosophyPrinciples } from '../data/content';
import SectionDivider from '../components/SectionDivider';

export default function Philosophy() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section ref={sectionRef} id="philosophy" data-theme="light" className="section-flow theme-light relative overflow-hidden py-16 sm:py-24 lg:py-32">
      <div
        className="section-parallax absolute top-0 right-0 w-[50vw] h-[50vw] max-w-[500px] -translate-y-1/4 translate-x-1/4 pointer-events-none opacity-40 blur-[100px] hidden lg:block"
        style={{ background: 'radial-gradient(circle, rgba(0, 0, 0, 0.06) 0%, transparent 70%)' }}
      />

      <SectionDivider label="About" />

      <div className="section-inner">
        <div className="container-main relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 mb-12 sm:mb-16">
            <div className="lg:col-span-5">
              <p className="section-kicker side-left mb-4">01 — Why work with us</p>
              <h2 className="section-heading side-left text-theme">
                Built for <span className="text-shimmer italic">business</span> results
              </h2>
            </div>
            <div className="lg:col-span-7 flex flex-col justify-end gap-6">
              <p className="side-left font-body text-theme-muted text-base sm:text-lg leading-relaxed max-w-xl">
                We dismantle slow workflows and replace them with software that saves time, cuts costs, and helps you grow.
              </p>
              <p className="side-right font-body text-theme-muted text-base sm:text-lg leading-relaxed max-w-xl">
                No jargon. No vanity projects. Just digital products your team and customers actually love using.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            {philosophyPrinciples.map((p, i) => (
              <article
                key={p.title}
                className={`side-reveal interactive-card rounded-2xl p-6 sm:p-8 group tap-pop ${i === 1 ? 'md:translate-y-4 lg:translate-y-6' : ''}`}
              >
                <span className="font-mono text-[10px] tracking-[0.3em] text-theme-faint uppercase mb-6 block">{p.num}</span>
                <h3 className="font-display text-2xl sm:text-3xl text-theme mb-3 group-hover:translate-x-1 transition-transform duration-300">
                  {p.title}
                </h3>
                <p className="font-body text-theme-muted text-sm sm:text-base leading-relaxed">{p.description}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
