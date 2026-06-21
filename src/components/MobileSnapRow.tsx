import { useEffect, useRef, useState, type ReactNode } from 'react';

interface MobileSnapRowProps {
  children: ReactNode;
  className?: string;
}

export default function MobileSnapRow({ children, className = '' }: MobileSnapRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const count = Array.isArray(children) ? children.length : 1;

  useEffect(() => {
    const row = rowRef.current;
    if (!row || window.innerWidth >= 640) return;

    const onScroll = () => {
      const { scrollLeft, clientWidth } = row;
      const cardWidth = clientWidth * 0.85 + 12;
      setActive(Math.min(count - 1, Math.round(scrollLeft / cardWidth)));
    };

    row.addEventListener('scroll', onScroll, { passive: true });
    return () => row.removeEventListener('scroll', onScroll);
  }, [count]);

  return (
    <div className="relative">
      <div
        ref={rowRef}
        className={`snap-row -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-3 sm:gap-4 ${className}`}
      >
        {children}
      </div>
      <div className="flex justify-center gap-1.5 mt-4 sm:hidden" aria-hidden="true">
        {Array.from({ length: count }).map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              active === i ? 'w-5 bg-black' : 'w-1.5 bg-black/20'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
