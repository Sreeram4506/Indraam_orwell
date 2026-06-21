import { useState } from 'react';
import { services } from '../data/content';
import { ArrowRight } from 'lucide-react';
import SectionDivider from '../components/SectionDivider';

export default function Services() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const active = services[activeIndex];

  return (
    <section id="services" data-theme="dark" className="section-flow theme-dark relative py-16 sm:py-24 lg:py-32 overflow-hidden">
      <div className="section-parallax absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-black/[0.03] rounded-full blur-[120px] pointer-events-none" />

      <SectionDivider label="Services" />

      <div className="section-inner">
        <div className="container-main relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10 sm:mb-14">
            <div>
              <p className="section-kicker side-left mb-4">02 — Capabilities</p>
              <h2 className="section-heading side-right text-theme">
                <span className="text-shimmer">Expertise</span>
              </h2>
            </div>
            <p className="side-reveal font-body text-theme-muted max-w-md text-sm sm:text-base leading-relaxed">
              Tap a service to explore what we build — from AI agents to full-stack apps.
            </p>
          </div>

          {/* Mobile: horizontal pills */}
          <div className="flex gap-2.5 overflow-x-auto pb-4 mb-6 -mx-4 px-4 scrollbar-hide lg:hidden snap-x snap-mandatory">
            {services.map((service, i) => (
              <button
                key={service.title}
                type="button"
                onClick={() => setActiveIndex(i)}
                className={`service-pill tap-pop px-4 py-3 rounded-full font-mono text-[10px] uppercase tracking-wider border transition-all duration-300 min-h-[48px] snap-center ${
                  activeIndex === i
                    ? 'bg-white text-black border-white'
                    : 'bg-transparent text-theme-muted border-theme'
                }`}
              >
                {service.tag}
              </button>
            ))}
          </div>

          {/* Desktop: bento grid */}
          <div className="bento-grid mb-8 hidden lg:grid">
            {services.map((service, i) => (
              <button
                key={service.title}
                type="button"
                onClick={() => setActiveIndex(i)}
                className={`side-reveal interactive-card rounded-xl p-5 text-left transition-all duration-300 tap-pop ${
                  activeIndex === i ? 'is-active ring-1 ring-black/20' : ''
                }`}
              >
                <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-black/35 block mb-3">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="font-display text-xl leading-tight block mb-1">{service.title}</span>
                <span className="font-mono text-[9px] uppercase tracking-wider text-black/30">{service.tag}</span>
              </button>
            ))}
          </div>

          {/* Detail panel */}
          <div className="side-right interactive-card rounded-2xl p-6 sm:p-10 lg:p-12 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-black/15 to-transparent" />
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
              <div className="max-w-2xl">
                <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-black/40 mb-4 block">
                  {String(activeIndex + 1).padStart(2, '0')} — {active.tag}
                </span>
                <h3 className="font-display text-[clamp(2rem,5vw,3.5rem)] leading-[1] mb-5 text-theme">{active.title}</h3>
                <p className="font-body text-theme-muted text-base sm:text-lg leading-relaxed">{active.description}</p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="group/btn shrink-0 inline-flex items-center justify-center gap-3 px-6 py-4 min-h-[52px] border border-theme font-mono text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300 rounded-full w-full lg:w-auto text-theme"
              >
                Request expertise
                <ArrowRight size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm" onClick={() => setModalOpen(false)}>
          <div
            className="relative w-full sm:max-w-md bg-obsidian border border-black/10 p-6 sm:p-10 rounded-t-2xl sm:rounded-2xl max-h-[90dvh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button type="button" onClick={() => setModalOpen(false)} className="absolute top-5 right-5 text-black/40 hover:text-parchment font-mono text-sm min-w-[44px] min-h-[44px]">
              ✕
            </button>
            <h3 className="font-display text-2xl text-parchment mb-2 pr-10">Request — {active.title}</h3>
            <p className="font-mono text-[10px] uppercase tracking-wider text-black/35 mb-8">We'll reply within 24 hours</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setModalOpen(false);
              }}
              className="space-y-5"
            >
              {['Name', 'Business Name', 'Email', 'Contact Number'].map((field) => (
                <div key={field}>
                  <label className="block font-mono text-[9px] uppercase tracking-widest text-black/40 mb-2">{field}</label>
                  <input
                    type={field === 'Email' ? 'email' : 'text'}
                    required
                    className="w-full bg-transparent border-b border-black/15 pb-3 text-parchment focus:border-black focus:outline-none transition-colors min-h-[44px]"
                  />
                </div>
              ))}
              <button type="submit" className="btn-saffron w-full justify-center mt-2 min-h-[52px]">
                <span>Submit Request</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
