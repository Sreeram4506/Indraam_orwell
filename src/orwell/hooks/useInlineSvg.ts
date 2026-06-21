import { useEffect, useRef } from 'react';

export function useInlineSvg(url: string) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    fetch(url)
      .then((r) => r.text())
      .then((svg) => {
        if (cancelled || !containerRef.current) return;

        containerRef.current.innerHTML = svg;

        const svgEl = containerRef.current.querySelector('svg');
        if (!svgEl) return;

        // Normalize width/height so inline SVG markup like height="auto" doesn't break.
        svgEl.setAttribute('width', svgEl.getAttribute('width') || '100%');

        const height = svgEl.getAttribute('height');
        if (!height || height === 'auto') {
          svgEl.setAttribute('height', '100%');
        }

        svgEl.style.display = 'block';
        svgEl.style.maxWidth = '100%';
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
