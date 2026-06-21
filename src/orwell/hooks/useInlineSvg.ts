import { useEffect, useRef } from 'react';

export function useInlineSvg(url: string) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(url)
      .then((r) => r.text())
      .then((svg) => {
        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = svg;
          const svgEl = containerRef.current.querySelector('svg');
          if (svgEl) {
            svgEl.setAttribute('width', '100%');
            svgEl.setAttribute('height', 'auto');
            svgEl.style.display = 'block';
            svgEl.style.maxWidth = '100%';
          }
        }
      })
      .catch(() => {
        /* noop */
      });
    return () => {
      cancelled = true;
    };
  }, [url]);

  return containerRef;
}
