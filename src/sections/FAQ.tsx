import { useState } from 'react';
import { Plus, X, HelpCircle, Users, Bot, MessageSquare, Globe, Infinity as InfinityIcon } from 'lucide-react';

const SectionIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-gray-400">
    <path d="M1 3L4 0M1 6L7 0M1 9L10 0M4 12L12 4M7 12L12 7M10 12L12 10" stroke="currentColor" strokeWidth="1" />
  </svg>
);

const tabs = ['Overview', 'Security', 'Protocols', 'Licensing'];

const faqData: Record<string, { question: string; answer: string; icon: React.ReactNode }[]> = {
  Overview: [
    {
      question: 'What is the Armory platform?',
      answer: 'Armory is a specialized infrastructure for building and deploying custom AI agents. We provide the neural logic and edge nodes required to run autonomous workflows at enterprise scale.',
      icon: <Bot size={18} />,
    },
    {
      question: 'Who is this template designed for?',
      answer: 'Armory is designed for teams and organizations looking to deploy production-grade AI agents without building infrastructure from scratch. It serves startups, enterprises, and research labs.',
      icon: <Users size={18} />,
    },
    {
      question: 'Does Armory provide pre-built agents?',
      answer: 'Yes, Armory includes a library of pre-built agent templates for common use cases such as customer support, data analysis, and content generation. You can customize these or build from scratch.',
      icon: <Bot size={18} />,
    },
    {
      question: 'How does it differ from a standard chatbot?',
      answer: 'Unlike standard chatbots that follow simple decision trees, Armory agents can perform multi-step reasoning, access external tools, maintain context across long conversations, and execute autonomous workflows.',
      icon: <MessageSquare size={18} />,
    },
    {
      question: 'Can I use my own custom domain?',
      answer: 'Absolutely. Armory supports custom domains with SSL certificates, allowing you to deploy agents under your own brand.',
      icon: <Globe size={18} />,
    },
    {
      question: 'Is there a limit to how many agents I can build?',
      answer: 'No hard limits. Our infrastructure scales dynamically to support any number of agents, from a single prototype to thousands of production deployments.',
      icon: <InfinityIcon size={18} />,
    },
  ],
  Security: [
    {
      question: 'How is my data protected?',
      answer: 'All data is encrypted at rest and in transit using AES-256 and TLS 1.3. We maintain SOC 2 Type II compliance and perform regular third-party security audits.',
      icon: <HelpCircle size={18} />,
    },
    {
      question: 'Do you support on-premise deployments?',
      answer: 'Yes, Armory Enterprise supports fully air-gapped on-premise deployments for organizations with strict data residency requirements.',
      icon: <HelpCircle size={18} />,
    },
  ],
  Protocols: [
    {
      question: 'What APIs does Armory support?',
      answer: 'Armory supports REST, GraphQL, gRPC, and WebSocket APIs. We also provide SDKs for Python, TypeScript, and Go.',
      icon: <HelpCircle size={18} />,
    },
    {
      question: 'Can I integrate with my existing tools?',
      answer: 'Yes, Armory offers native integrations with 100+ tools including Slack, Salesforce, HubSpot, Jira, and custom webhooks.',
      icon: <HelpCircle size={18} />,
    },
  ],
  Licensing: [
    {
      question: 'What licensing options are available?',
      answer: 'We offer SaaS, Enterprise, and OEM licensing models. Contact our sales team for a customized quote based on your usage requirements.',
      icon: <HelpCircle size={18} />,
    },
  ],
};

export default function FAQ() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [openIndex, setOpenIndex] = useState(0);

  const currentFaq = faqData[activeTab] || [];

  return (
    <section className="reveal-section py-32" style={{ backgroundColor: 'var(--bg-light)' }}>
      <div className="container-main">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
          {/* Left column */}
          <div className="lg:col-span-2">
            <div className="reveal-item flex items-center gap-2 mb-8">
              <SectionIcon />
              <span className="section-label section-label-dark">FAQ</span>
            </div>

            <div className="reveal-item mb-6">
              <h2 className="heading-2 mb-4" style={{ color: 'var(--text-dark)' }}>
                Common inquiries
              </h2>
              <p className="body-text" style={{ color: 'var(--text-dark-muted)' }}>
                Everything you need to know about deploying, scaling, and securing your neural agents with Armory. Can&apos;t find an answer?
              </p>
            </div>

            <div className="reveal-item mt-8">
              <button className="btn-dark">
                Contact Us
              </button>
            </div>
          </div>

          {/* Right column */}
          <div className="lg:col-span-3">
            {/* Tabs */}
            <div className="reveal-item flex mb-8" style={{ borderBottom: '1px solid var(--border-dark)' }}>
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => { setActiveTab(tab); setOpenIndex(0); }}
                  className="section-label py-3 px-6 relative transition-colors duration-200"
                  style={{
                    color: activeTab === tab ? 'var(--text-dark)' : 'var(--text-dark-muted)',
                  }}
                >
                  {tab}
                  {activeTab === tab && (
                    <div
                      className="absolute bottom-0 left-0 right-0 h-0.5"
                      style={{ backgroundColor: 'var(--text-dark)' }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Accordion */}
            <div className="reveal-item">
              {currentFaq.map((item, i) => (
                <div
                  key={item.question}
                  style={{ borderBottom: '1px solid var(--border-dark)' }}
                >
                  <button
                    onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
                    className="w-full flex items-center justify-between py-5 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span style={{ color: 'var(--text-dark-muted)' }}>{item.icon}</span>
                      <span className="body-text" style={{ color: 'var(--text-dark)' }}>{item.question}</span>
                    </div>
                    {openIndex === i ? (
                      <X size={18} style={{ color: 'var(--text-dark-muted)' }} />
                    ) : (
                      <Plus size={18} style={{ color: 'var(--text-dark-muted)' }} />
                    )}
                  </button>
                  <div
                    className="overflow-hidden transition-all duration-300"
                    style={{
                      maxHeight: openIndex === i ? '200px' : '0',
                      opacity: openIndex === i ? 1 : 0,
                    }}
                  >
                    <p className="body-sm pb-5 pl-10" style={{ color: 'var(--text-dark-muted)' }}>
                      {item.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
