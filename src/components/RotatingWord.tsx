import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface RotatingWordProps {
  words: string[];
  interval?: number;
}

export default function RotatingWord({ words, interval = 2600 }: RotatingWordProps) {
  const [index, setIndex] = useState(0);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % words.length), interval);
    return () => clearInterval(id);
  }, [words.length, interval]);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;
    const mobile = window.innerWidth < 768;
    gsap.fromTo(
      el,
      { y: mobile ? 18 : 24, opacity: 0, scale: 0.92, rotate: mobile ? -2 : 0 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        rotate: 0,
        duration: mobile ? 0.5 : 0.55,
        ease: 'back.out(2)',
      }
    );
  }, [index]);

  return (
    <span className="inline-block relative overflow-hidden align-bottom min-w-[3ch]">
      <span ref={textRef} key={words[index]} className="text-shimmer italic inline-block">
        {words[index]}
      </span>
    </span>
  );
}
