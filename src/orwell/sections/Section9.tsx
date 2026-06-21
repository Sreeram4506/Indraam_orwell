import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import gsap from 'gsap';
import { CONTACT } from '../data';
import { interestOptions } from '../../data/content';

export type Section9Handle = {
  el: HTMLElement | null;
  animate: () => void;
};

const Section9 = forwardRef<Section9Handle>(function Section9(_, ref) {
  const sectionRef = useRef<HTMLElement>(null);
  const mastheadRef = useRef<HTMLDivElement>(null);
  const kickerRef = useRef<HTMLParagraphElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadRef = useRef<HTMLParagraphElement>(null);
  const channelsRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const [submitted, setSubmitted] = useState(false);

  const animate = () => {
    const targets = [
      mastheadRef.current,
      kickerRef.current,
      headlineRef.current,
      subheadRef.current,
      channelsRef.current,
      formRef.current,
      footerRef.current,
    ].filter(Boolean);

    gsap.set(targets, { opacity: 0, y: 28 });
    gsap.set(dividerRef.current, { scaleX: 0 });

    gsap
      .timeline()
      .to(mastheadRef.current, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' })
      .to(dividerRef.current, { scaleX: 1, duration: 1.1, ease: 'expo.inOut' }, '-=0.3')
      .to(kickerRef.current, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.5')
      .to(headlineRef.current, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, '-=0.35')
      .to(subheadRef.current, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.5')
      .to(channelsRef.current, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.45')
      .to(formRef.current, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, '-=0.55')
      .to(footerRef.current, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, '-=0.4');
  };

  useImperativeHandle(ref, () => ({
    el: sectionRef.current,
    animate,
  }));

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    window.setTimeout(() => setSubmitted(false), 3000);
    e.currentTarget.reset();
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="contact-section"
      aria-label="Contact"
      style={{ visibility: 'hidden' }}
    >
      <div className="contact-masthead" ref={mastheadRef}>
        {CONTACT.masthead}
      </div>

      <div className="contact-body">
        <div className="contact-divider" ref={dividerRef} />

        <div className="contact-grid">
          <div className="contact-left">
            <p className="contact-kicker" ref={kickerRef}>
              {CONTACT.kicker}
            </p>
            <h2 className="contact-headline" ref={headlineRef}>
              {CONTACT.headline}
            </h2>
            <p className="contact-subhead" ref={subheadRef}>
              {CONTACT.subhead}
            </p>

            <div className="contact-channels" ref={channelsRef}>
              <a href={`mailto:${CONTACT.email}`} className="contact-channel">
                <span className="contact-channel-label">EMAIL</span>
                <span className="contact-channel-value">{CONTACT.email}</span>
              </a>
              <a href={CONTACT.phoneHref} className="contact-channel">
                <span className="contact-channel-label">PHONE</span>
                <span className="contact-channel-value">{CONTACT.phone}</span>
              </a>
              <a
                href={CONTACT.scheduleHref}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-channel contact-channel--cta"
              >
                <span className="contact-channel-label">{CONTACT.scheduleLabel}</span>
                <span className="contact-channel-value">→</span>
              </a>
            </div>
          </div>

          <form ref={formRef} className="contact-form" onSubmit={handleSubmit}>
            <p className="contact-form-label">PROJECT BRIEF</p>

            <div className="contact-form-grid">
              {[
                { name: 'name', label: 'YOUR NAME', type: 'text', required: true },
                { name: 'email', label: 'EMAIL', type: 'email', required: true },
                { name: 'business', label: 'BUSINESS', type: 'text', required: false },
                { name: 'phone', label: 'PHONE', type: 'tel', required: false },
              ].map((field) => (
                <label key={field.name} className="contact-field">
                  <span className="contact-field-label">{field.label}</span>
                  <input
                    name={field.name}
                    type={field.type}
                    required={field.required}
                    className="contact-input"
                  />
                </label>
              ))}
            </div>

            <div className="contact-field">
              <span className="contact-field-label">INTERESTED IN</span>
              <div className="contact-chips">
                {interestOptions.map((opt) => (
                  <label key={opt} className="contact-chip-label">
                    <input type="checkbox" name="interests" value={opt} className="contact-chip-input" />
                    <span className="contact-chip">{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            <label className="contact-field">
              <span className="contact-field-label">MESSAGE</span>
              <textarea
                name="message"
                rows={4}
                placeholder="Goal, timeline, and what success looks like."
                className="contact-textarea"
              />
            </label>

            <button type="submit" className="contact-submit">
              {submitted ? CONTACT.successLabel : CONTACT.submitLabel}
            </button>
          </form>
        </div>
      </div>

      <footer className="contact-footer" ref={footerRef}>
        <span>{CONTACT.footerCredit}</span>
        <a href={`https://${CONTACT.footerUrl}`} target="_blank" rel="noopener noreferrer">
          {CONTACT.footerUrl}
        </a>
      </footer>
    </section>
  );
});

export default Section9;
