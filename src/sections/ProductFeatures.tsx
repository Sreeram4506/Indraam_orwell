const features = [
  {
    title: 'Infinite Visual Canvas',
    description: 'Map out multi-step agent behaviors on a high-precision grid. Drag and drop triggers, logic gates, and actions to craft custom paths.',
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="text-gray-400 mb-4">
        <rect x="8" y="8" width="32" height="32" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 16h32M8 24h32M8 32h32M16 8v32M24 8v32M32 8v32" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
        <rect x="18" y="18" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    title: 'Autonomous Execution',
    description: 'Run complex decision trees without manual intervention. Our engine handles conditional branching and error recovery automatically.',
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="text-gray-400 mb-4">
        <circle cx="24" cy="24" r="16" stroke="currentColor" strokeWidth="1.5" />
        <path d="M24 12v4M24 32v4M12 24h4M32 24h4" stroke="currentColor" strokeWidth="1.5" />
        <path d="M20 20l4 4 4-4" stroke="currentColor" strokeWidth="1.5" />
        <path d="M20 28h8" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    title: 'End-to-End Encryption',
    description: 'Every node and data transfer is shielded by industrial-grade security. Maintain total control over your organizational data flow.',
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="text-gray-400 mb-4">
        <rect x="14" y="22" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M18 22V16a6 6 0 0112 0v6" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="24" cy="30" r="3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M24 33v3" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    title: 'Production-Ready Stack',
    description: 'Connect core business platforms and internal services through secure, ready integrations that scale with your volume.',
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="text-gray-400 mb-4">
        <rect x="6" y="16" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <rect x="28" y="8" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <rect x="28" y="28" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M20 23h8M28 16v-4M28 32v4" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
];

export default function ProductFeatures() {
  return (
    <section className="reveal-section py-16" style={{ backgroundColor: 'var(--bg-dark)' }}>
      <div className="container-main">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className="reveal-item p-8"
              style={{
                borderRight: i < features.length - 1 ? '1px solid var(--border-subtle)' : 'none',
              }}
            >
              {feature.icon}
              <h3 className="heading-3 text-white mb-3">{feature.title}</h3>
              <p className="body-sm" style={{ color: 'var(--text-secondary)' }}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
