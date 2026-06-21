import { useState } from 'react';
import { Globe } from 'lucide-react';

const SectionIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-gray-500">
    <path d="M1 3L4 0M1 6L7 0M1 9L10 0M4 12L12 4M7 12L12 7M10 12L12 10" stroke="currentColor" strokeWidth="1" />
  </svg>
);

const tabs = ['DISCOVERY', 'ANALYSIS', 'TRAINING', 'DEPLOY'];

const tabContent = [
  {
    image: '/images/img-scoring-ui.jpg',
    text: 'Evaluate agent performance with surgical precision. Get real-time scoring on accuracy, safety, and contextual relevance. Quantify every interaction for total quality.',
  },
  {
    image: '/images/img-article-1.jpg',
    text: 'Analyze agent behavior patterns across millions of interactions. Identify edge cases, failure modes, and optimization opportunities with comprehensive telemetry dashboards.',
  },
  {
    image: '/images/img-article-3.jpg',
    text: 'Train and fine-tune models on your proprietary data. Our training pipeline supports RLHF, domain adaptation, and continuous learning for ever-improving agent performance.',
  },
  {
    image: '/images/img-chat-ui.jpg',
    text: 'Push your agents to production with a single click. Our secure edge infrastructure ensures sub-50ms latency globally. Deploy to any cloud provider or on-premise.',
    cta: 'Go Live Now',
  },
];

export default function ProductFeaturesTabs() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section className="reveal-section py-32" style={{ backgroundColor: 'var(--bg-dark)' }}>
      <div className="container-main">
        <div className="reveal-item flex items-center gap-2 mb-8">
          <SectionIcon />
          <span className="section-label section-label-light">PRODUCT FEATURES</span>
        </div>

        <div className="reveal-item mb-6">
          <h2 className="heading-2 text-white mb-4">Engineered for autonomy</h2>
          <p className="body-text max-w-xl" style={{ color: 'var(--text-secondary)' }}>
            Go beyond simple chat interfaces. Armory provides the underlying architecture to build, test, and scale enterprise-grade agents.
          </p>
        </div>

        {/* Tabs */}
        <div className="reveal-item grid grid-cols-4 mt-12" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          {tabs.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className="section-label py-4 text-center transition-all duration-200 relative"
              style={{
                color: activeTab === i ? 'var(--text-primary)' : 'var(--text-secondary)',
                backgroundColor: activeTab === i ? 'var(--bg-card)' : 'transparent',
                borderRight: i < tabs.length - 1 ? '1px solid var(--border-subtle)' : 'none',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="reveal-item py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative overflow-hidden rounded-lg" style={{ border: '1px solid var(--border-subtle)' }}>
              <img
                src={tabContent[activeTab].image}
                alt={tabs[activeTab]}
                className="w-full transition-opacity duration-300"
                style={{ aspectRatio: '16/10', objectFit: 'cover' }}
              />
            </div>
            <div className="space-y-6">
              <p className="body-text" style={{ color: 'var(--text-secondary)' }}>
                {tabContent[activeTab].text}
              </p>
              {tabContent[activeTab].cta && (
                <button className="btn-primary">
                  <Globe size={14} />
                  {tabContent[activeTab].cta}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
