import { useEffect, useState } from 'react';

export function useSiteTheme() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof document === 'undefined') return 'dark';
    return (document.body.dataset.theme as 'dark' | 'light' | undefined) ?? 'dark';
  });

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const t = document.body.dataset.theme as 'dark' | 'light' | undefined;
      if (t) setTheme(t);
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  return theme;
}
