import { useState } from 'react';
import { Send, ArrowRight } from 'lucide-react';
import { interestOptions } from '../data/content';
import SectionDivider from '../components/SectionDivider';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const fd = new FormData(form);
    const interests = form.querySelectorAll('input[name="interests"]:checked');

    const payload = {
      id: `${Date.now()}_${Math.random().toString(16).slice(2)}`,
      createdAt: Date.now(),
      name: String(fd.get('name') ?? ''),
      email: String(fd.get('email') ?? ''),
      business: String(fd.get('business') ?? ''),
      phone: String(fd.get('phone') ?? ''),
      message: String(fd.get('message') ?? ''),
      interests: Array.from(interests).map((el) => (el as HTMLInputElement).value),
    };

    try {
      const key = 'contact_submissions_v1';
      const existingRaw = localStorage.getItem(key);
      const existing = existingRaw ? (JSON.parse(existingRaw) as unknown[]) : [];
      const next = Array.isArray(existing) ? [...existing, payload] : [payload];
      localStorage.setItem(key, JSON.stringify(next));
    } catch {
      // If storage is blocked, still show the success state.
    }

    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    form.reset();
  };

  return (
    <section
      id="contact"
      data-theme="dark"
      className="section-flow theme-dark relative py-16 sm:py-24 lg:py-32 overflow-x-hidden"
      style={{ position: 'relative', opacity: 1, pointerEvents: 'auto' }}
    >
      <div className="section-parallax absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] max-w-[700px] bg-black/[0.02] rounded-full blur-[120px] pointer-events-none" />

      <SectionDivider label="Contact" />

      <div className="section-inner">
        <div className="container-main relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-5">
              <p className="section-kicker side-left mb-4">04 - Get in touch</p>
              <h2 className="section-heading side-right text-theme mb-6">
                Got a vision? <span className="text-shimmer italic">Let's build it.</span>
              </h2>
              <p className="side-left font-body text-theme-muted text-base leading-relaxed mb-8 max-w-md">
                Tell us what you're working on. We'll reply with honest feedback and a clear path forward - no sales fluff.
              </p>

              <div className="space-y-6">
                <a href="mailto:hello@indraam.com" className="side-reveal interactive-card rounded-xl p-5 block group">
                  <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-black/35 mb-2 block">Email</span>
                  <span className="font-display text-xl sm:text-2xl group-hover:translate-x-1 inline-block transition-transform duration-300">
                    hello@indraam.com
                  </span>
                </a>
                <a href="tel:+12036402437" className="side-reveal interactive-card rounded-xl p-5 block group">
                  <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-black/35 mb-2 block">Phone</span>
                  <span className="font-display text-xl group-hover:translate-x-1 inline-block transition-transform duration-300">
                    +1 (203) 640-2437
                  </span>
                </a>
              </div>
            </div>

            <form className="lg:col-span-7 side-left interactive-card rounded-2xl p-6 sm:p-10 space-y-6" onSubmit={handleSubmit}>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-black/35">Project brief</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                {[
                  { name: 'name', label: 'Your Name', type: 'text' },
                  { name: 'email', label: 'Email', type: 'email' },
                  { name: 'business', label: 'Business', type: 'text' },
                  { name: 'phone', label: 'Phone', type: 'tel' },
                ].map((field) => (
                  <div key={field.name} className="side-reveal">
                    <label className="block font-mono text-[9px] uppercase tracking-[0.25em] text-black/35 mb-2">{field.label}</label>
                    <input
                      name={field.name}
                      type={field.type}
                      required={field.name !== 'business'}
                      className="w-full bg-transparent border-b border-black/12 pb-3 text-parchment text-base focus:border-black focus:outline-none transition-colors min-h-[44px]"
                    />
                  </div>
                ))}
              </div>

              <div className="side-reveal">
                <label className="block font-mono text-[9px] uppercase tracking-[0.25em] text-black/35 mb-3">Interested in</label>
                <div className="flex flex-wrap gap-2">
                  {interestOptions.map((opt) => (
                    <label key={opt} className="cursor-pointer">
                      <input type="checkbox" name="interests" value={opt} className="peer sr-only" />
                      <span className="inline-flex items-center min-h-[40px] px-3.5 py-2 border border-black/10 rounded-full font-mono text-[9px] uppercase tracking-wider text-black/40 peer-checked:bg-black peer-checked:text-obsidian peer-checked:border-black transition-all duration-200">
                        {opt}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="side-reveal">
                <label className="block font-mono text-[9px] uppercase tracking-[0.25em] text-black/35 mb-2">Tell us more</label>
                <textarea
                  name="message"
                  rows={4}
                  placeholder="What's the goal, timeline, and budget range?"
                  className="w-full bg-transparent border border-black/10 rounded-xl p-4 text-parchment text-base placeholder:text-black/25 focus:border-black focus:outline-none transition-colors resize-none"
                />
              </div>

              <button type="submit" className="side-right btn-saffron w-full sm:w-auto justify-center min-h-[52px]">
                <span className="flex items-center gap-3">
                  {submitted ? 'Message sent!' : 'Send message'}
                  <Send size={14} />
                </span>
              </button>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="/admin"
                  className="inline-flex items-center gap-2 rounded-full border border-black/10 px-4 py-2 font-mono text-[9px] uppercase tracking-wider text-black/45 hover:bg-black hover:text-obsidian transition-colors duration-200"
                >
                  View admin page
                  <ArrowRight size={12} />
                </a>
                <span className="font-body text-theme-muted text-sm">
                  See the form fillings in a dedicated dashboard.
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
