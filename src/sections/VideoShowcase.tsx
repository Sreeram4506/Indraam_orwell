import { Clock, Play } from 'lucide-react';

export default function VideoShowcase() {
  return (
    <section className="relative" style={{ backgroundColor: 'var(--bg-dark)' }}>
      <div className="relative w-full" style={{ height: '60vh', minHeight: 400 }}>
        <img
          src="/images/img-article-2.jpg"
          alt="Neural network visualization"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />

        {/* Coming soon overlay (disabled play) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
          <div className="flex flex-col items-center gap-2">
            <div
              className="flex items-center gap-2 text-white/80 text-sm"
              style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.05em' }}
            >
              <Clock size={16} />
              <span>2 Minutes Watch</span>
            </div>

            <div className="text-white text-sm" style={{ letterSpacing: '0.02em' }}>Coming Soon</div>
          </div>

          <button
            disabled
            aria-label="Coming soon"
            className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 disabled:opacity-60 cursor-not-allowed"
            style={{
              backgroundColor: 'rgba(255,255,255,0.15)',
              border: '2px solid rgba(255,255,255,0.3)',
            }}
          >
            <Play size={28} className="text-white ml-1" fill="white" />
          </button>
        </div>
      </div>
    </section>
  );
}
