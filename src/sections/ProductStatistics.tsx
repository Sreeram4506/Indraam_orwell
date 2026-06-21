import { Activity, Shield, BarChart3, TrendingUp, Zap } from 'lucide-react';

const SectionIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-gray-500">
    <path d="M1 3L4 0M1 6L7 0M1 9L10 0M4 12L12 4M7 12L12 7M10 12L12 10" stroke="currentColor" strokeWidth="1" />
  </svg>
);

const metrics = [
  {
    icon: <Activity size={20} />,
    title: 'System Load',
    value: '98.7%',
    subtitle: 'Active neural processing',
    footer: [
      { label: 'CACHE', value: '99%' },
      { label: 'UPTIME', value: '6M' },
    ],
    chart: (
      <svg width="100%" height="80" viewBox="0 0 200 80" fill="none">
        <circle cx="100" cy="55" r="35" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
        <circle cx="100" cy="55" r="35" stroke="white" strokeWidth="8" strokeDasharray="165 220" strokeLinecap="round" transform="rotate(-90 100 55)" />
        <text x="100" y="55" textAnchor="middle" fill="white" fontSize="20" fontFamily="Instrument Serif">15</text>
        <text x="100" y="68" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="8" fontFamily="Geist Mono">Core Systems</text>
      </svg>
    ),
  },
  {
    icon: <Shield size={20} />,
    title: 'SLA Response',
    value: '99.99%',
    subtitle: 'Global uptime monitoring',
    footer: [
      { label: 'SLA', value: '99%' },
    ],
    chart: (
      <svg width="100%" height="80" viewBox="0 0 200 80" fill="none">
        <rect x="30" y="65" width="8" height="10" rx="1" fill="rgba(255,255,255,0.1)" />
        <rect x="50" y="55" width="8" height="20" rx="1" fill="rgba(255,255,255,0.15)" />
        <rect x="70" y="40" width="8" height="35" rx="1" fill="rgba(255,255,255,0.2)" />
        <rect x="90" y="50" width="8" height="25" rx="1" fill="rgba(255,255,255,0.15)" />
        <rect x="110" y="25" width="8" height="50" rx="1" fill="white" />
        <rect x="130" y="45" width="8" height="30" rx="1" fill="rgba(255,255,255,0.15)" />
        <rect x="150" y="55" width="8" height="20" rx="1" fill="rgba(255,255,255,0.1)" />
        <rect x="170" y="60" width="8" height="15" rx="1" fill="rgba(255,255,255,0.08)" />
        <line x1="20" y1="70" x2="185" y2="70" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
      </svg>
    ),
  },
  {
    icon: <BarChart3 size={20} />,
    title: 'Token Usage',
    value: '8.4M',
    subtitle: 'Monthly volume throughput',
    footer: [
      { label: 'TOTAL QUERIES', value: '152' },
      { label: 'ACTIVE NODES', value: '115' },
    ],
    chart: (
      <svg width="100%" height="80" viewBox="0 0 200 80" fill="none">
        <path d="M20 60 Q60 20, 100 35 T180 25" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" fill="none" />
        <circle cx="100" cy="35" r="3" fill="white" />
        <text x="100" y="55" textAnchor="middle" fill="white" fontSize="20" fontFamily="Instrument Serif">345</text>
      </svg>
    ),
  },
  {
    icon: <TrendingUp size={20} />,
    title: 'Growth Vector',
    value: '99.98%',
    subtitle: 'Efficiency gains over 30 days',
    footer: [
      { label: 'NET GROWTH', value: '82%' },
    ],
    chart: (
      <svg width="100%" height="80" viewBox="0 0 200 80" fill="none">
        <text x="20" y="35" fill="white" fontSize="28" fontFamily="Instrument Serif">82%</text>
        <text x="20" y="55" fill="rgba(255,255,255,0.5)" fontSize="8" fontFamily="Geist Mono">NET GROWTH</text>
        <path d="M120 50 Q140 45, 160 35 T190 20" stroke="rgba(255,255,255,0.3)" strokeWidth="1" fill="none" />
      </svg>
    ),
  },
];

export default function ProductStatistics() {
  return (
    <section className="reveal-section py-32" style={{ backgroundColor: 'var(--bg-dark)' }}>
      <div className="container-main">
        <div className="reveal-item flex items-center gap-2 mb-8">
          <SectionIcon />
          <span className="section-label section-label-light">PRODUCT STATISTICS</span>
        </div>

        <div className="reveal-item grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          <h2 className="heading-2 text-white">Optimized for performance</h2>
          <p className="body-text" style={{ color: 'var(--text-secondary)' }}>
            Monitor every neural pulse in real-time. Armory provides deep telemetry into agent accuracy, server latency, and token efficiency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {metrics.map((metric) => (
            <div
              key={metric.title}
              className="reveal-item p-6 rounded-lg"
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-gray-400">
                  {metric.icon}
                  <span className="heading-3 text-white text-sm">{metric.title}</span>
                </div>
                <span className="text-white font-serif text-lg">{metric.value}</span>
              </div>

              {/* Subtitle */}
              <p className="body-sm mb-4" style={{ color: 'var(--text-secondary)' }}>{metric.subtitle}</p>

              {/* Chart */}
              <div className="mb-4">{metric.chart}</div>

              {/* Footer */}
              <div className="flex gap-6 pt-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                {metric.footer.map((f) => (
                  <div key={f.label}>
                    <span className="section-label text-gray-500 mr-2">{f.label}</span>
                    <span className="text-white text-sm">{f.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="reveal-item flex justify-end">
          <button className="btn-primary">
            <Zap size={14} />
            Request Demo
          </button>
        </div>
      </div>
    </section>
  );
}
