const SectionIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-gray-500">
    <path d="M1 3L4 0M1 6L7 0M1 9L10 0M4 12L12 4M7 12L12 7M10 12L12 10" stroke="currentColor" strokeWidth="1" />
  </svg>
);

export default function ProductPlatform() {
  return (
    <section className="reveal-section py-32" style={{ backgroundColor: 'var(--bg-dark)' }}>
      <div className="container-main">
        <div className="reveal-item flex items-center gap-2 mb-8">
          <SectionIcon />
          <span className="section-label section-label-light">OUR PRODUCT</span>
        </div>

        <div className="reveal-item grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          <h2 className="heading-2 text-white">Build logic at scale</h2>
          <p className="body-text" style={{ color: 'var(--text-secondary)' }}>
            Design, deploy, and manage sophisticated AI workflows through an intuitive visual interface. No complex coding—just pure logic.
          </p>
        </div>

        <div className="reveal-item">
          <img
            src="/images/img-workflow-builder.jpg"
            alt="Armory Workflow Builder"
            className="w-full rounded-lg"
            style={{ border: '1px solid var(--border-subtle)' }}
          />
        </div>
      </div>
    </section>
  );
}
