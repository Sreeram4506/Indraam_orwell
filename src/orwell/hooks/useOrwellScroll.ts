import type { RefObject } from 'react';
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
  hero: RefObject<HeroSceneHandle | null>;
  s2: RefObject<Section2Handle | null>;
  s3: RefObject<Section3Handle | null>;
  s4: RefObject<Section4Handle | null>;
  s6: RefObject<Section6Handle | null>;
  s7: RefObject<Section7Handle | null>;
  s8: RefObject<Section8Handle | null>;
  s9: RefObject<Section9Handle | null>;
};

type ScrollCallbacks = {
  onS6Active: (active: boolean) => void;
  onS6Velocity: (velocity: number) => void;
  onGrainOpacity: (opacity: number) => void;
  onHeroVisible: (visible: boolean) => void;
};

export function useOrwellScroll(
  enabled: boolean,
  refs: ScrollRefs,
  callbacks: ScrollCallbacks,
) {
  const { hero, s2, s3, s4, s6, s7, s8, s9 } = refs;
  const { onS6Active, onS6Velocity, onGrainOpacity, onHeroVisible } = callbacks;

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
    // On mobile we removed swipe-to-snap, so keep native/continuous scrolling.
    // Do not force an artificial body height.

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

    const lenisApi = {
      stop: () => lenisRef.current?.stop(),
      start: () => lenisRef.current?.start(),
    };

    const onScroll = () => {
      const state = stateRef.current;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;

      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.debug('[orwell scroll]', {
          y: window.scrollY,
          maxScroll,
          progress,
          innerHeight: window.innerHeight,
          docScrollHeight: document.documentElement.scrollHeight,
          boundaries: {
            b12: bounds.boundary12,
            b23: bounds.boundary23,
            b34: bounds.boundary34,
            b46: bounds.boundary46,
            b67: bounds.boundary67,
            b78: bounds.boundary78,
            b89: bounds.boundary89,
            reverseS7: bounds.reverseS7,
            reverseS8: bounds.reverseS8,
            reverseS9: bounds.reverseS9,
          },
          shown: {
            hero: state.heroShown,
            s2: state.section2Shown,
            s3: state.section3Shown,
            s4: state.section4Shown,
            s6: state.section6Shown,
            s7: state.section7Shown,
            s8: state.section8Shown,
            s9: state.section9Shown,
          },
          isMobile,
        });
      }

      if (state.section6Shown) {
        state.s6Velocity = Math.min(Math.abs(window.scrollY - state.s6LastScrollY) / 20, 3);
      }
      state.s6LastScrollY = window.scrollY;
      onS6Velocity(state.s6Velocity);

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

        if (isMobile) {
          runElTransition(
            canvas?.parentElement ?? null,
            s2Handle?.el ?? null,
            () => {
              show(s2Handle?.el ?? null);
              onGrainOpacity(0.12);
              s2Handle?.drawPrisoners();
              s2Handle?.animateTextIn();
            },
            true,
            lenisApi,
          );
          return;
        }

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

        if (isMobile) {
          runElTransition(
            s2Handle?.el ?? null,
            canvas?.parentElement ?? null,
            () => {
              hide(s2Handle?.el ?? null);
              onGrainOpacity(0);
              s2Handle?.animateTextOut();
              s2Handle?.resetPrisoners();
              if (canvas) canvas.style.visibility = 'visible';
            },
            true,
            lenisApi,
          );
          return;
        }

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

    if (!isMobile) {
      const lenis = new Lenis({ lerp: 0.1 });
      lenisRef.current = lenis;

      let rafId: number | null = null;
      const raf = (time: number) => {
        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      };
      rafId = requestAnimationFrame(raf);

      // Lenis handles smooth scrolling; we only need a single native scroll listener
      // for progress-based transitions.
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();

      return () => {
        window.removeEventListener('scroll', onScroll);
        if (rafId != null) cancelAnimationFrame(rafId);
        lenis.destroy();
        lenisRef.current = null;
        document.body.style.height = '';
      };
    }

    // Mobile: keep normal continuous scrolling (no swipe-to-snap),
    // but we still must provide scroll room for progress-based transitions.
    // Safety net: remove any Lenis classes that might have been added globally.
    document.documentElement.classList.remove('lenis', 'lenis-smooth', 'lenis-stopped');

    // IMPORTANT: Don't set body height on mobile; OrwellApp's spacer div provides scroll height.
    // document.body.style.height = `${bounds.bodyVh}vh`;

    // Still run transitions on scroll so section animations respond as the user scrolls.
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      // document.body.style.height = '';
    };
  }, [enabled, hero, s2, s3, s4, s6, s7, s8, s9, onGrainOpacity, onHeroVisible, onS6Active, onS6Velocity]);
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
