import { useState } from 'react';
import { funTickerLines } from '../data/content';

export default function FunTicker() {
  const lines = [...funTickerLines, ...funTickerLines];
  const [paused, setPaused] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setPaused((p) => !p)}
      data-theme="dark"
      className="section-bridge theme-dark relative z-20 w-full overflow-hidden text-left"
      aria-label={paused ? 'Resume ticker' : 'Pause ticker'}
    >
      <p className="editorial-strip">INDRAAM DISPATCH — ALL PROJECTS VERIFIED — SCROLL TO CONTINUE</p>
      <div className={`ticker-fun flex whitespace-nowrap py-3 ${paused ? 'ticker-paused' : ''}`}>
        {lines.map((line, i) => (
          <span key={i} className="inline-flex items-center shrink-0 px-5 sm:px-8">
            <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.12em] uppercase text-theme-muted">{line}</span>
            <span className="mx-5 sm:mx-8 text-theme-faint font-display text-base italic fun-sparkle">✦</span>
          </span>
        ))}
      </div>
      <span className="md:hidden absolute right-4 top-1/2 -translate-y-1/2 font-mono text-[8px] uppercase tracking-wider text-theme-faint">
        {paused ? '▶' : '❚❚'}
      </span>
    </button>
  );
}
