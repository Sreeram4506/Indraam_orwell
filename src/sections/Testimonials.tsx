import { Star } from 'lucide-react';

const SectionIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-gray-400">
    <path d="M1 3L4 0M1 6L7 0M1 9L10 0M4 12L12 4M7 12L12 7M10 12L12 10" stroke="currentColor" strokeWidth="1" />
  </svg>
);

const testimonials = [
  {
    company: 'Vertex Labs',
    headline: 'Infrastructure that finally scales',
    quote: 'The reliability of Armory is unmatched. We\'ve migrated our entire neural pipeline to their edge nodes with zero downtime for our users.',
  },
  {
    company: 'FlowState AI',
    headline: 'Saved us months of R&D',
    quote: 'Instead of building our own agent logic from scratch, we used Armory. We went from a prototype to a global production launch in weeks.',
  },
  {
    company: 'Neural Sync',
    headline: 'Precision in every inference',
    quote: 'The observability tools allow us to monitor agent accuracy in real-time. It has become a vital part of our model evaluation workflow.',
  },
  {
    company: 'Sentinel Ops',
    headline: 'Enterprise-grade by default',
    quote: 'The node-based builder is a game changer for our team. Even our non-technical stakeholders can now help map out complex agent behaviors.',
  },
];

const partners = ['CVS pharmacy', 'United Healthcare', 'aetna', 'cigna', 'Anthem'];

export default function Testimonials() {
  return (
    <section className="reveal-section py-32" style={{ backgroundColor: 'var(--bg-light)' }}>
      <div className="container-main">
        <div className="reveal-item flex items-center gap-2 mb-8">
          <SectionIcon />
          <span className="section-label section-label-dark">TESTIMONIALS</span>
        </div>

        <div className="reveal-item mb-6">
          <h2 className="heading-2 mb-4" style={{ color: 'var(--text-dark)' }}>
            Trusted by the pioneers
          </h2>
          <p className="body-text max-w-xl" style={{ color: 'var(--text-dark-muted)' }}>
            From high-growth startups to enterprise research labs, Armory is the chosen infrastructure for teams building the next era of AI.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mt-12">
          {testimonials.map((t, i) => (
            <div
              key={t.company}
              className="reveal-item p-6"
              style={{
                borderRight: i < testimonials.length - 1 ? '1px solid var(--border-dark)' : 'none',
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ backgroundColor: '#111', color: '#fff' }}
                >
                  {t.company[0]}
                </div>
                <span className="heading-3 text-sm" style={{ color: 'var(--text-dark)' }}>{t.company}</span>
              </div>

              <p className="body-text font-medium mb-4" style={{ color: 'var(--text-dark)' }}>
                {t.headline}
              </p>

              <p className="section-label mb-2" style={{ color: 'var(--text-dark-muted)', fontSize: 10 }}>RATING</p>
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} size={12} fill="var(--text-dark)" color="var(--text-dark)" />
                ))}
              </div>

              <p className="section-label mb-2" style={{ color: 'var(--text-dark-muted)', fontSize: 10 }}>COMMENT</p>
              <p className="body-sm" style={{ color: 'var(--text-dark-muted)' }}>{t.quote}</p>
            </div>
          ))}
        </div>

        {/* Partner logo marquee */}
        <div className="mt-16 overflow-hidden" style={{ borderTop: '1px solid var(--border-dark)', borderBottom: '1px solid var(--border-dark)' }}>
          <div className="marquee-track py-6">
            {[...partners, ...partners].map((partner, i) => (
              <div key={`${partner}-${i}`} className="flex-shrink-0 px-12">
                <span
                  className="text-lg font-medium whitespace-nowrap"
                  style={{ color: 'var(--text-dark-muted)' }}
                >
                  {partner}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
