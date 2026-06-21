import gsap from 'gsap';

let globalTransitionLock = false;

const preventTouch = (e: Event) => e.preventDefault();

export function isTransitionLocked() {
  return globalTransitionLock;
}

function lockScroll(lenisStop?: () => void) {
  globalTransitionLock = true;
  lenisStop?.();
  document.addEventListener('touchmove', preventTouch, { passive: false });
}

function releaseLock(lenisStart?: () => void) {
  globalTransitionLock = false;
  document.removeEventListener('touchmove', preventTouch);
  lenisStart?.();
  window.dispatchEvent(new Event('scroll'));
}

export function glitchTransition(
  canvas: HTMLElement | null,
  onMidpoint: () => void,
  lenis?: { stop: () => void; start: () => void },
) {
  if (!canvas) {
    onMidpoint();
    return;
  }
  lockScroll(lenis?.stop);
  const tl = gsap.timeline({ onComplete: () => releaseLock(lenis?.start) });
  tl.to(canvas, { skewX: 10, duration: 0.05, ease: 'none' })
    .to(canvas, { skewX: -8, duration: 0.05, ease: 'none' })
    .to(canvas, { skewX: 5, duration: 0.05, ease: 'none' })
    .to(canvas, { skewX: 0, duration: 0.05, ease: 'none' })
    .to(canvas, { opacity: 0, duration: 0.1, ease: 'none' })
    .add(() => {
      try {
        onMidpoint();
      } catch {
        /* noop */
      }
    })
    .to(canvas, { skewX: -5, duration: 0.05, ease: 'none' })
    .to(canvas, { skewX: 3, duration: 0.05, ease: 'none' })
    .to(canvas, { skewX: 0, opacity: 1, duration: 0.1, ease: 'none' });
}

export function glitchTransitionEl(
  outEl: HTMLElement | null,
  inEl: HTMLElement | null,
  onMidpoint: () => void,
  lenis?: { stop: () => void; start: () => void },
) {
  lockScroll(lenis?.stop);
  if (inEl) gsap.set(inEl, { opacity: 0 });
  const tl = gsap.timeline({ onComplete: () => releaseLock(lenis?.start) });
  const target = outEl ?? document.body;
  tl.to(target, { skewX: 10, duration: 0.05, ease: 'none' })
    .to(target, { skewX: -8, duration: 0.05, ease: 'none' })
    .to(target, { skewX: 5, duration: 0.05, ease: 'none' })
    .to(target, { skewX: 0, duration: 0.05, ease: 'none' })
    .to(target, { opacity: 0, duration: 0.1, ease: 'none' })
    .add(() => {
      try {
        onMidpoint();
      } catch {
        /* noop */
      }
    });
  if (inEl) {
    tl.to(inEl, { skewX: -5, duration: 0.05, ease: 'none' })
      .to(inEl, { skewX: 3, duration: 0.05, ease: 'none' })
      .to(inEl, { skewX: 0, opacity: 1, duration: 0.1, ease: 'none' });
  }
}

export function glitchTransitionReverse(
  canvas: HTMLElement | null,
  s2: HTMLElement | null,
  onMidpoint: () => void,
  lenis?: { stop: () => void; start: () => void },
) {
  if (!canvas || !s2) {
    onMidpoint();
    return;
  }
  lockScroll(lenis?.stop);
  canvas.style.visibility = 'visible';
  gsap.set(canvas, { opacity: 0, skewX: 0 });
  const tl = gsap.timeline({ onComplete: () => releaseLock(lenis?.start) });
  tl.to(s2, { skewX: 10, duration: 0.05, ease: 'none' })
    .to(s2, { skewX: -8, duration: 0.05, ease: 'none' })
    .to(s2, { skewX: 5, duration: 0.05, ease: 'none' })
    .to(s2, { skewX: 0, duration: 0.05, ease: 'none' })
    .to(s2, { opacity: 0, duration: 0.1, ease: 'none' })
    .add(() => {
      try {
        onMidpoint();
      } catch {
        /* noop */
      }
    })
    .to(canvas, { skewX: -5, duration: 0.05, ease: 'none' })
    .to(canvas, { skewX: 3, duration: 0.05, ease: 'none' })
    .to(canvas, { skewX: 0, opacity: 1, duration: 0.1, ease: 'none' });
}

export function staticTransition(onMidpoint: () => void, lenis?: { stop: () => void; start: () => void }) {
  lockScroll(lenis?.stop);
  const canvas = document.createElement('canvas');
  canvas.style.cssText =
    'position:fixed;top:0;left:0;width:100%;height:100%;z-index:500;pointer-events:none;image-rendering:pixelated;';
  canvas.width = Math.max(1, Math.floor(window.innerWidth / 4));
  canvas.height = Math.max(1, Math.floor(window.innerHeight / 4));
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    onMidpoint();
    releaseLock(lenis?.start);
    return;
  }
  let frame = 0;
  let midpointCalled = false;

  function drawStatic() {
    if (!ctx) return;
    const imageData = ctx.createImageData(canvas.width, canvas.height);
    for (let i = 0; i < imageData.data.length; i += 4) {
      const v = Math.random() * 255;
      imageData.data[i] = imageData.data[i + 1] = imageData.data[i + 2] = v;
      imageData.data[i + 3] = 255;
    }
    ctx.putImageData(imageData, 0, 0);
    frame += 1;
    if (frame === 8 && !midpointCalled) {
      midpointCalled = true;
      try {
        onMidpoint();
      } catch {
        /* noop */
      }
    }
    if (frame < 16) {
      requestAnimationFrame(drawStatic);
    } else {
      canvas.remove();
      releaseLock(lenis?.start);
    }
  }
  drawStatic();
}

export function mobileTransition(onMidpoint: () => void) {
  globalTransitionLock = true;
  const overlay = document.createElement('div');
  overlay.style.cssText =
    'position:fixed;top:0;left:0;width:100%;height:100%;background:#000;z-index:9999;pointer-events:none;opacity:0;transition:opacity 0.25s linear;';
  document.body.appendChild(overlay);
  void overlay.offsetHeight;
  overlay.style.opacity = '1';
  window.setTimeout(() => {
    try {
      onMidpoint();
    } catch {
      /* noop */
    }
    overlay.style.opacity = '0';
    window.setTimeout(() => {
      overlay.remove();
      globalTransitionLock = false;
      window.dispatchEvent(new Event('scroll'));
    }, 270);
  }, 270);
}

export function curtainTransition(onMidpoint: () => void, lenis?: { stop: () => void; start: () => void }) {
  const isMobile = window.innerWidth <= 768 || window.matchMedia('(pointer: coarse)').matches;
  if (isMobile) {
    mobileTransition(onMidpoint);
    return;
  }

  lenis?.stop();
  document.addEventListener('touchmove', preventTouch, { passive: false });
  const overlay = document.createElement('div');
  overlay.style.cssText =
    'position:fixed;top:0;left:0;width:100%;height:100%;background:#000;z-index:9999;pointer-events:all;opacity:0;';
  document.body.appendChild(overlay);
  let midpointCalled = false;
  document.body.style.pointerEvents = 'none';

  const tl = gsap.timeline({
    onComplete: () => {
      overlay.remove();
      document.body.style.pointerEvents = '';
      document.removeEventListener('touchmove', preventTouch);
      lenis?.start();
    },
  });

  tl.to(overlay, {
    opacity: 1,
    duration: 2.5,
    ease: 'power1.inOut',
    onComplete: () => {
      if (!midpointCalled) {
        midpointCalled = true;
        onMidpoint();
      }
    },
  }).to(overlay, { opacity: 0, duration: 3, ease: 'power1.inOut' }, '+=0.5');
}

export function runTransition(
  fn: (cb: () => void) => void,
  onMidpoint: () => void,
  isMobile: boolean,
) {
  if (isMobile) mobileTransition(onMidpoint);
  else fn(onMidpoint);
}

export function runElTransition(
  outEl: HTMLElement | null,
  inEl: HTMLElement | null,
  onMidpoint: () => void,
  isMobile: boolean,
  lenis?: { stop: () => void; start: () => void },
) {
  if (isMobile) {
    mobileTransition(() => {
      if (outEl) {
        outEl.style.opacity = '0';
        outEl.style.pointerEvents = 'none';
        outEl.style.visibility = 'hidden';
      }
      if (inEl) {
        inEl.style.opacity = '1';
        inEl.style.pointerEvents = 'auto';
        inEl.style.visibility = 'visible';
      }
      onMidpoint();
    });
  } else {
    glitchTransitionEl(outEl, inEl, onMidpoint, lenis);
  }
}
