export function typeWriter(
  element: HTMLElement,
  text: string,
  speed: number,
  onComplete?: () => void,
): () => void {
  let i = 0;
  element.textContent = '';
  const timer = window.setInterval(() => {
    element.textContent += text[i];
    i += 1;
    if (i >= text.length) {
      window.clearInterval(timer);
      onComplete?.();
    }
  }, speed);
  return () => window.clearInterval(timer);
}
