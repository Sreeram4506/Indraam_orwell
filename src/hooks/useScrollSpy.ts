import { useEffect, useState } from 'react';

const SECTION_IDS = ['home', 'philosophy', 'services', 'work', 'contact'];

export function useScrollSpy() {
  const [activeId, setActiveId] = useState('home');

  useEffect(() => {
    const onScroll = () => {
      const offset = window.innerHeight * 0.35;
      let current = 'home';

      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= offset) current = id;
      }

      setActiveId(current);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return activeId;
}
