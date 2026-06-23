import { useEffect, useRef } from 'react';

export function useInlineSvg(url: string) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    fetch(url)
      .then((r) => r.text())
      .then((svg) => {
        if (cancelled || !containerRef.current) return;

        // Some source SVGs ship with height="auto", which browsers reject on inline SVG.
        containerRef.current.innerHTML = svg.replace(/\sheight="auto"/gi, '');

        const svgEl = containerRef.current.querySelector('svg');
        if (!svgEl) return;

        // Normalize inline SVG sizing so markup like height="auto" doesn't break.
        svgEl.setAttribute('width', svgEl.getAttribute('width') || '100%');

        const height = svgEl.getAttribute('height');
        // If the SVG uses height="auto" (or has no height), removing the attribute avoids
        // invalid attribute value errors and lets CSS control sizing.
        if (!height || height === 'auto') {
          svgEl.removeAttribute('height');
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
