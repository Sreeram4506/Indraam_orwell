import { ArrowUp } from 'lucide-react';
import SectionDivider from '../components/SectionDivider';
import { site } from '../data/content';

const marqueeItems = ['AI Automation', 'Custom Apps', 'Websites', 'Branding', 'Business Growth'];

export default function Footer() {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer data-theme="dark" className="section-flow theme-dark relative overflow-hidden border-t border-theme">
      <SectionDivider label="Footer" />

      <div className="section-inner">
        <div className="border-b border-theme overflow-hidden bg-white text-black py-4 sm:py-5">
          <div className="marquee-track">
            {[...marqueeItems, ...marqueeItems].map((item, i) => (
              <div key={i} className="flex-shrink-0 flex items-center px-6 sm:px-10">
                <span className="font-display text-xl sm:text-3xl tracking-tight whitespace-nowrap">{item}</span>
                <div className="w-1.5 h-1.5 bg-black rounded-full mx-5 sm:mx-8 opacity-60" />
              </div>
            ))}
          </div>
        </div>

        <div className="container-main py-12 sm:py-16">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10">
            <div>
              <p className="font-display text-[clamp(2.5rem,10vw,5rem)] leading-none tracking-tight uppercase mb-4 text-theme">
                {site.name}
              </p>
              <p className="font-body text-theme-muted max-w-sm text-sm sm:text-base leading-relaxed">{site.description}</p>
            </div>
            <button
              type="button"
              onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-saffron w-full sm:w-auto justify-center min-h-[52px]"
            >
              <span>Start a project</span>
            </button>
          </div>
        </div>

        <div className="container-main py-6 border-t border-theme flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-mono text-[9px] uppercase tracking-widest text-theme-faint">Indraam Studio © 2026</span>
          <button
            type="button"
            onClick={scrollTop}
            className="group flex items-center gap-2 font-mono text-[9px] uppercase tracking-widest text-theme-muted hover:text-theme transition-colors min-h-[44px]"
            aria-label="Back to top"
          >
            Back to top
            <span className="w-9 h-9 rounded-full border border-theme flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-300">
              <ArrowUp size={14} />
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}
