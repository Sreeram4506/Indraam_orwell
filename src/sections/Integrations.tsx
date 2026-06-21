const SectionIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-gray-500">
    <path d="M1 3L4 0M1 6L7 0M1 9L10 0M4 12L12 4M7 12L12 7M10 12L12 10" stroke="currentColor" strokeWidth="1" />
  </svg>
);

const integrations = [
  { name: 'AI', label: 'Anthropic' },
  { name: 'AWS', label: 'Amazon' },
  { name: 'MS', label: 'Microsoft' },
  { name: 'Bolt', label: 'Bolt' },
  { name: 'Meta', label: 'Meta' },
  { name: 'AI2', label: 'AI Lab' },
  { name: 'M', label: 'Mistral' },
  { name: 'V', label: 'Vercel' },
];

export default function Integrations() {
  return (
    <section className="reveal-section py-32" style={{ backgroundColor: 'var(--bg-dark)' }}>
      <div className="container-main">
        <div className="reveal-item flex items-center gap-2 mb-8">
          <SectionIcon />
          <span className="section-label section-label-light">INTEGRATIONS</span>
        </div>

        <div className="reveal-item text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-serif text-3xl md:text-4xl leading-tight text-white">
            Armory bridges the gap between your data and your tools.{' '}
            <span className="text-gray-400">Deploy agents that live where you work, from Slack to GitHub and beyond.</span>
          </h2>
        </div>

        <div className="reveal-item grid grid-cols-2 md:grid-cols-4">
          {integrations.map((integration, i) => (
            <div
              key={integration.name}
              className="flex items-center justify-center py-12 px-8"
              style={{
                borderRight: (i + 1) % 4 !== 0 ? '1px solid var(--border-subtle)' : 'none',
                borderBottom: i < 4 ? '1px solid var(--border-subtle)' : 'none',
              }}
            >
              <span
                className="text-white/60 font-medium tracking-wider"
                style={{ fontFamily: 'var(--font-sans)', fontSize: '1.1rem' }}
              >
                {integration.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
