import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import {
  curtainTransition,
  glitchTransition,
  glitchTransitionReverse,
  isTransitionLocked,
  runElTransition,
  staticTransition,
} from '../utils/transitions';
import { getScrollBounds, isMobileViewport } from '../scrollConfig';
import type { HeroSceneHandle } from '../HeroScene';
import type { Section2Handle } from '../sections/Section2';
import type { Section3Handle } from '../sections/Section3';
import type { Section4Handle } from '../sections/Section4';
import type { Section6Handle } from '../sections/Section6';
import type { Section7Handle } from '../sections/Section7';
import type { Section8Handle } from '../sections/Section8';
import type { Section9Handle } from '../sections/Section9';

type ScrollRefs = {
  hero: React.RefObject<HeroSceneHandle | null>;
  s2: React.RefObject<Section2Handle | null>;
  s3: React.RefObject<Section3Handle | null>;
  s4: React.RefObject<Section4Handle | null>;
  s6: React.RefObject<Section6Handle | null>;
  s7: React.RefObject<Section7Handle | null>;
  s8: React.RefObject<Section8Handle | null>;
  s9: React.RefObject<Section9Handle | null>;
};

type ScrollCallbacks = {
  onS6Active: (active: boolean) => void;
  onGrainOpacity: (opacity: number) => void;
  onHeroVisible: (visible: boolean) => void;
};

export function useOrwellScroll(
  enabled: boolean,
  refs: ScrollRefs,
  callbacks: ScrollCallbacks,
) {
  const { hero, s2, s3, s4, s6, s7, s8, s9 } = refs;
  const { onS6Active, onGrainOpacity, onHeroVisible } = callbacks;
  const stateRef = useRef({
    section2Shown: false,
    section3Shown: false,
    section4Shown: false,
    section6Shown: false,
    section7Shown: false,
    section8Shown: false,
    section9Shown: false,
    heroShown: true,
    s6LastScrollY: 0,
    s6Velocity: 0,
  });
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const isMobile = isMobileViewport();
    const bounds = getScrollBounds(isMobile);
    document.body.style.height = `${bounds.bodyVh}vh`;

    const lenis = new Lenis({ lerp: isMobile ? 0.12 : 0.1 });
    lenisRef.current = lenis;

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    const lenisApi = { stop: () => lenis.stop(), start: () => lenis.start() };

    const show = (el: HTMLElement | null) => {
      if (!el) return;
      el.style.opacity = '1';
      el.style.pointerEvents = 'auto';
      el.style.visibility = 'visible';
    };
    const hide = (el: HTMLElement | null) => {
      if (!el) return;
      el.style.opacity = '0';
      el.style.pointerEvents = 'none';
      el.style.visibility = 'hidden';
    };

    const onScroll = () => {
      const state = stateRef.current;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;

      if (state.section6Shown) {
        state.s6Velocity = Math.min(Math.abs(window.scrollY - state.s6LastScrollY) / 20, 3);
      }
      state.s6LastScrollY = window.scrollY;

      const canvas = hero.current?.canvas ?? null;
      const s2Handle = s2.current;
      const s3Handle = s3.current;
      const s4Handle = s4.current;
      const s6Handle = s6.current;
      const s7Handle = s7.current;
      const s8Handle = s8.current;
      const s9Handle = s9.current;

      if (progress > bounds.boundary12 && !state.section2Shown && !isTransitionLocked()) {
        state.section2Shown = true;
        state.heroShown = false;
        onHeroVisible(false);
        glitchTransition(
          canvas,
          () => {
            if (canvas) canvas.style.visibility = 'hidden';
            show(s2Handle?.el ?? null);
            onGrainOpacity(0.12);
            s2Handle?.drawPrisoners();
            s2Handle?.animateTextIn();
          },
          lenisApi,
        );
      }

      if (progress > bounds.boundary23 && state.section2Shown && !state.section3Shown && !state.section4Shown && !isTransitionLocked()) {
        state.section3Shown = true;
        runElTransition(
          s2Handle?.el ?? null,
          s3Handle?.el ?? null,
          () => {
            hide(s2Handle?.el ?? null);
            s2Handle?.animateTextOut();
            show(s3Handle?.el ?? null);
            s3Handle?.animateIn();
          },
          isMobile,
          lenisApi,
        );
      }

      if (progress < bounds.boundary23 - 0.05 && state.section3Shown && !isTransitionLocked()) {
        state.section3Shown = false;
        runElTransition(
          s3Handle?.el ?? null,
          s2Handle?.el ?? null,
          () => {
            hide(s3Handle?.el ?? null);
            s3Handle?.resetHeadline();
            show(s2Handle?.el ?? null);
            s2Handle?.animateTextIn();
          },
          isMobile,
          lenisApi,
        );
      }

      if (progress > bounds.boundary34 && state.section3Shown && !state.section4Shown && !isTransitionLocked()) {
        state.section4Shown = true;
        runElTransition(
          s3Handle?.el ?? null,
          s4Handle?.el ?? null,
          () => {
            hide(s3Handle?.el ?? null);
            show(s4Handle?.el ?? null);
            s4Handle?.animatePortrait();
          },
          isMobile,
          lenisApi,
        );
      }

      if (progress < bounds.boundary34 - 0.05 && state.section4Shown && !isTransitionLocked()) {
        state.section4Shown = false;
        runElTransition(
          s4Handle?.el ?? null,
          s3Handle?.el ?? null,
          () => {
            hide(s4Handle?.el ?? null);
            show(s3Handle?.el ?? null);
            s4Handle?.resetPortrait();
          },
          isMobile,
          lenisApi,
        );
      }

      if (progress > bounds.boundary46 && state.section4Shown && !state.section6Shown && !isTransitionLocked()) {
        state.section6Shown = true;
        staticTransition(() => {
          hide(s4Handle?.el ?? null);
          show(s6Handle?.el ?? null);
          onS6Active(true);
          s6Handle?.initTexts();
          s6Handle?.showThoughtcrime();
        }, lenisApi);
      }

      if (progress < bounds.boundary46 - 0.05 && state.section6Shown && !state.section7Shown && !isTransitionLocked()) {
        state.section6Shown = false;
        onS6Active(false);
        runElTransition(
          s6Handle?.el ?? null,
          s4Handle?.el ?? null,
          () => {
            hide(s6Handle?.el ?? null);
            show(s4Handle?.el ?? null);
            s6Handle?.resetTexts();
          },
          isMobile,
          lenisApi,
        );
      }

      if (progress > bounds.boundary67 && state.section6Shown && !state.section7Shown && !isTransitionLocked()) {
        state.section7Shown = true;
        onS6Active(false);
        staticTransition(() => {
          hide(s6Handle?.el ?? null);
          show(s7Handle?.el ?? null);
          s7Handle?.init();
        }, lenisApi);
      } else if (
        progress > bounds.boundary78 &&
        state.section7Shown &&
        !state.section8Shown &&
        !state.section9Shown &&
        !isTransitionLocked()
      ) {
        state.section8Shown = true;
        curtainTransition(() => {
          [s2Handle, s3Handle, s4Handle, s6Handle, s7Handle].forEach((s) => hide(s?.el ?? null));
          if (canvas) canvas.style.visibility = 'hidden';
          hide(s9Handle?.el ?? null);
          show(s8Handle?.el ?? null);
          const cursor = document.getElementById('cursor-text');
          if (cursor) cursor.style.display = 'none';
          s8Handle?.animate();
        }, lenisApi);
      } else if (progress > bounds.boundary89 && state.section8Shown && !state.section9Shown && !isTransitionLocked()) {
        state.section9Shown = true;
        curtainTransition(() => {
          hide(s8Handle?.el ?? null);
          show(s9Handle?.el ?? null);
          s9Handle?.animate();
        }, lenisApi);
      }

      if (progress < bounds.reverseS7 && state.section7Shown && !isTransitionLocked()) {
        state.section7Shown = false;
        runElTransition(
          s7Handle?.el ?? null,
          s6Handle?.el ?? null,
          () => {
            hide(s7Handle?.el ?? null);
            show(s6Handle?.el ?? null);
            onS6Active(true);
            s7Handle?.reset();
          },
          isMobile,
          lenisApi,
        );
      }

      if (state.section7Shown && !state.section8Shown) {
        const s7Range = 1 - bounds.boundary67;
        const s7Progress = s7Range > 0 ? Math.max(0, Math.min(1, (progress - bounds.boundary67) / s7Range)) : 0;
        s7Handle?.update(s7Progress);
      }

      if (progress < bounds.reverseS9 && state.section9Shown) {
        state.section9Shown = false;
        curtainTransition(() => {
          hide(s9Handle?.el ?? null);
          show(s8Handle?.el ?? null);
        }, lenisApi);
      }

      if (progress < bounds.reverseS8 && (state.section8Shown || state.section9Shown)) {
        state.section8Shown = false;
        state.section9Shown = false;
        curtainTransition(() => {
          hide(s8Handle?.el ?? null);
          hide(s9Handle?.el ?? null);
          show(s7Handle?.el ?? null);
          const cursor = document.getElementById('cursor-text');
          if (cursor) cursor.style.display = '';
        }, lenisApi);
      }

      if (progress < bounds.boundary12 - 0.05 && !state.heroShown && !isTransitionLocked()) {
        state.heroShown = true;
        state.section2Shown = false;
        onHeroVisible(true);
        glitchTransitionReverse(
          canvas,
          s2Handle?.el ?? null,
          () => {
            hide(s2Handle?.el ?? null);
            onGrainOpacity(0);
            s2Handle?.animateTextOut();
            s2Handle?.resetPrisoners();
          },
          lenisApi,
        );
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      lenis.destroy();
      document.body.style.height = '';
    };
  }, [enabled, hero, s2, s3, s4, s6, s7, s8, s9, onGrainOpacity, onHeroVisible, onS6Active]);
}

export function useS6Velocity(enabled: boolean) {
  const velocityRef = useRef(0);
  const lastYRef = useRef(0);

  useEffect(() => {
    if (!enabled) return;
    const onScroll = () => {
      velocityRef.current = Math.min(Math.abs(window.scrollY - lastYRef.current) / 20, 3);
      lastYRef.current = window.scrollY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [enabled]);

  return velocityRef;
}
