const SectionIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-gray-400">
    <path d="M1 3L4 0M1 6L7 0M1 9L10 0M4 12L12 4M7 12L12 7M10 12L12 10" stroke="currentColor" strokeWidth="1" />
  </svg>
);

const features = [
  {
    title: 'Prime Logic',
    description: 'We prioritize high-fidelity model alignment to ensure your agents deliver consistent results.',
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="text-gray-500 mb-4">
        <path d="M24 4L6 14v20l18 10 18-10V14L24 4z" stroke="currentColor" strokeWidth="1.5" />
        <path d="M24 4v20" stroke="currentColor" strokeWidth="1" />
        <path d="M24 24L6 14" stroke="currentColor" strokeWidth="1" />
        <path d="M24 24l18-10" stroke="currentColor" strokeWidth="1" />
        <path d="M24 24v20" stroke="currentColor" strokeWidth="1" />
        <circle cx="24" cy="24" r="4" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    title: 'Total Clarity',
    description: 'Gain full observability into how your data is processed, indexed, and retrieved by your AI.',
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="text-gray-500 mb-4">
        <ellipse cx="24" cy="24" rx="16" ry="12" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="24" cy="24" r="6" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="24" cy="24" r="2" fill="currentColor" />
      </svg>
    ),
  },
  {
    title: 'Fast Cycles',
    description: 'Transition from prototype to production in weeks, not months, with our pre-built frameworks.',
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="text-gray-500 mb-4">
        <circle cx="24" cy="24" r="16" stroke="currentColor" strokeWidth="1.5" />
        <path d="M24 12v6M24 30v6M12 24h6M30 24h6" stroke="currentColor" strokeWidth="1" />
        <path d="M28 16l-4 8h6l-4 8" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function OurApproach() {
  return (
    <section className="reveal-section" style={{ backgroundColor: 'var(--bg-light)' }}>
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Left - Image */}
        <div className="relative min-h-[500px] lg:min-h-full">
          <img
            src="/images/img-approach.jpg"
            alt="Abstract neural texture"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>

        {/* Right - Content */}
        <div className="py-24 px-8 lg:px-16">
          <div className="reveal-item flex items-center gap-2 mb-8">
            <SectionIcon />
            <span className="section-label section-label-dark">OUR APPROACH</span>
          </div>

          <div className="reveal-item mb-6">
            <h2 className="heading-2 mb-4" style={{ color: 'var(--text-dark)' }}>
              Built for the long term
            </h2>
            <p className="body-text" style={{ color: 'var(--text-dark-muted)' }}>
              We don&apos;t just ship code; we architect neural ecosystems. Our approach combines rigorous testing with rapid deployment cycles.
            </p>
          </div>

          <div className="mt-12 space-y-0">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className="reveal-item py-8"
                style={{
                  borderTop: '1px solid var(--border-dark)',
                  borderBottom: i === features.length - 1 ? '1px solid var(--border-dark)' : 'none',
                }}
              >
                <div className="flex items-start gap-6">
                  {feature.icon}
                  <div>
                    <h3 className="heading-3 mb-2" style={{ color: 'var(--text-dark)' }}>{feature.title}</h3>
                    <p className="body-sm" style={{ color: 'var(--text-dark-muted)' }}>{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
