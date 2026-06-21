import { useRef, type ReactNode, type MouseEvent, type TouchEvent } from 'react';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
}

export default function TiltCard({ children, className = '' }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const setTransform = (x: number, y: number, active: boolean) => {
    const el = ref.current;
    if (!el) return;
    if (active) {
      el.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateZ(6px)`;
    } else {
      el.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) translateZ(0)';
    }
  };

  const onMove = (clientX: number, clientY: number) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (clientX - rect.left) / rect.width - 0.5;
    const y = (clientY - rect.top) / rect.height - 0.5;
    setTransform(x, y, true);
  };

  const onMouseMove = (e: MouseEvent) => onMove(e.clientX, e.clientY);
  const onMouseLeave = () => setTransform(0, 0, false);

  const onTouchMove = (e: TouchEvent) => {
    const touch = e.touches[0];
    if (touch) onMove(touch.clientX, touch.clientY);
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onTouchStart={onTouchMove}
      onTouchMove={onTouchMove}
      onTouchEnd={onMouseLeave}
      className={`tilt-card transition-transform duration-300 ease-out will-change-transform ${className}`}
    >
      {children}
    </div>
  );
}
