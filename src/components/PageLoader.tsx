import { useEffect } from 'react';

export default function PageLoader() {
  useEffect(() => {
    const loader = document.getElementById('page-loader');
    if (!loader) return;

    const hide = () => {
      loader.classList.add('loaded');
      window.setTimeout(() => loader.remove(), 250);
    };

    if (document.readyState === 'complete') {
      hide();
    } else {
      window.addEventListener('load', hide, { once: true });
      const fallback = window.setTimeout(hide, 400);
      return () => window.clearTimeout(fallback);
    }
  }, []);

  return null;
}
