import { funTickerLines, heroStats } from '../data/content';
import SectionDivider from '../components/SectionDivider';

export default function Statistics() {
  return (
    <section
      id="work"
      className="section-flow theme-dark relative overflow-hidden border-t border-theme"
      style={{ backgroundColor: 'var(--bg-dark)' }}
    >
      <SectionDivider label="Work" />

      <div className="section-inner">
        <div className="container-main py-20 sm:py-28">
          <div className="max-w-3xl mb-14">
            <p className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.14em] text-theme-muted mb-4">
              Recent proof of work
            </p>
            <h2 className="font-display text-[clamp(2rem,5vw,3.2rem)] leading-[1.02] tracking-tight text-theme mb-5">
              Built to ship. Designed to convert.
            </h2>
            <p className="font-body text-theme-muted max-w-2xl text-base sm:text-lg leading-relaxed">
              A quick snapshot of what we optimize: speed, reliability, and measurable business outcomes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-14">
            {heroStats.map((stat) => (
              <div
                key={stat.label}
                className="reveal-item rounded-2xl p-6 sm:p-7"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div className="font-display text-4xl sm:text-5xl text-theme leading-none mb-3">{stat.value}</div>
                <div className="font-mono text-[9px] uppercase tracking-wider text-theme-faint">{stat.label}</div>
              </div>
            ))}
          </div>

          <div
            className="reveal-item border border-theme rounded-2xl p-6 sm:p-8 overflow-hidden"
            style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}
          >
            <div className="flex items-center justify-between gap-6 mb-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-theme-faint">Signals we care about</p>
              <div className="hidden sm:block h-px flex-1 bg-theme-muted/30" />
            </div>

            <div className="marquee-track">
              {[...funTickerLines, ...funTickerLines].map((line, i) => (
                <div key={`${line}-${i}`} className="flex-shrink-0 flex items-center px-6 sm:px-10">
                  <span className="font-display text-xl sm:text-2xl tracking-tight text-theme">{line}</span>
                  <span className="w-2 h-2 bg-theme-muted/50 rounded-full mx-6 sm:mx-8" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
