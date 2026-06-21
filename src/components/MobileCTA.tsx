import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { scrollToSection } from '../utils/scrollTo';
import { useSiteTheme } from '../hooks/useSiteTheme';

export default function MobileCTA() {
  const [visible, setVisible] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);
  const siteTheme = useSiteTheme();

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const contact = document.getElementById('contact');
      const contactTop = contact?.getBoundingClientRect().top ?? Infinity;
      const pastHero = y > window.innerHeight * 0.45;
      const beforeContact = contactTop > window.innerHeight * 0.6;
      setVisible(pastHero && beforeContact);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    if (visible) {
      gsap.to(el, { y: 0, opacity: 1, duration: 0.45, ease: 'back.out(1.6)' });
    } else {
      gsap.to(el, { y: 80, opacity: 0, duration: 0.3, ease: 'power2.in' });
    }
  }, [visible]);

  return (
    <div
      ref={barRef}
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 p-3 safe-bottom pointer-events-none opacity-0 translate-y-20"
      style={{ willChange: 'transform, opacity' }}
    >
      <div
        className="pointer-events-auto rounded-2xl border p-2 backdrop-blur-xl shadow-[0_-8px_32px_rgba(0,0,0,0.2)]"
        style={{
          borderColor: 'var(--chrome-border)',
          backgroundColor: siteTheme === 'light' ? 'rgba(255,255,255,0.92)' : 'rgba(0,0,0,0.92)',
        }}
      >
        <button
          type="button"
          className="btn-saffron tap-pop w-full justify-center min-h-[52px] rounded-xl"
          onClick={() => scrollToSection('#contact')}
        >
          <span>Let's Build Something Cool ✦</span>
        </button>
      </div>
    </div>
  );
}
