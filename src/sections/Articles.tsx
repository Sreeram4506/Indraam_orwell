import { Zap } from 'lucide-react';

const SectionIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-gray-400">
    <path d="M1 3L4 0M1 6L7 0M1 9L10 0M4 12L12 4M7 12L12 7M10 12L12 10" stroke="currentColor" strokeWidth="1" />
  </svg>
);

const articles = [
  {
    image: '/images/img-article-1.jpg',
    date: 'Apr 29, 2026',
    readTime: '2 mins read',
    title: 'What It Takes to Turn AI Into a Business Asset',
    excerpt: 'Using AI tools is easy. Turning them into something that drives real outcomes across your business requires structure.',
  },
  {
    image: '/images/img-article-2.jpg',
    date: 'Apr 29, 2026',
    readTime: '3 mins read',
    title: 'Why Your AI Outputs Feel Inconsistent',
    excerpt: '',
  },
  {
    image: '/images/img-article-3.jpg',
    date: 'Apr 29, 2026',
    readTime: '2 mins read',
    title: 'From Prompting to Systems: The Real Shift in AI',
    excerpt: '',
  },
];

export default function Articles() {
  return (
    <section className="reveal-section py-32" style={{ backgroundColor: 'var(--bg-light)' }}>
      <div className="container-main">
        <div className="reveal-item flex items-center gap-2 mb-8">
          <SectionIcon />
          <span className="section-label section-label-dark">ARTICLES</span>
        </div>

        <div className="reveal-item mb-6">
          <h2 className="heading-2 mb-4" style={{ color: 'var(--text-dark)' }}>
            Insights on neural logic
          </h2>
          <p className="body-text max-w-xl" style={{ color: 'var(--text-dark-muted)' }}>
            Deep dives into AI architecture, agent automation, and the future of enterprise intelligence. Stay ahead of the neural curve.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {articles.map((article) => (
            <div key={article.title} className="reveal-item group cursor-pointer">
              <div className="overflow-hidden rounded-lg mb-4">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full aspect-[16/10] object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="flex items-center gap-3 mb-2">
                <span className="section-label" style={{ color: 'var(--text-dark-muted)', fontSize: 11 }}>{article.date}</span>
                <span className="body-sm" style={{ color: 'var(--text-dark-muted)' }}>{article.readTime}</span>
              </div>
              <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--text-dark)', fontFamily: 'var(--font-sans)' }}>
                {article.title}
              </h3>
              {article.excerpt && (
                <p className="body-sm" style={{ color: 'var(--text-dark-muted)' }}>{article.excerpt}</p>
              )}
            </div>
          ))}
        </div>

        <div className="reveal-item mt-12">
          <button className="btn-dark">
            <Zap size={14} />
            View Articles
          </button>
        </div>
      </div>
    </section>
  );
}
