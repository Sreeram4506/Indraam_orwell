import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import OrwellLoader from './OrwellLoader';
import HeroScene, { type HeroSceneHandle } from './HeroScene';
import CornerLabels, { GrainOverlay, OrwellCursor } from './Chrome';
import Section2, { type Section2Handle } from './sections/Section2';
import Section3, { type Section3Handle } from './sections/Section3';
import Section4, { type Section4Handle } from './sections/Section4';
import Section6, { type Section6Handle } from './sections/Section6';
import Section7, { type Section7Handle } from './sections/Section7';
import Section8, { type Section8Handle } from './sections/Section8';
import Section9, { type Section9Handle } from './sections/Section9';
import { useOrwellScroll } from './hooks/useOrwellScroll';
import { getScrollBounds, isMobileViewport } from './scrollConfig';
import AdminContact from '../sections/AdminContact';
import Contact from '../sections/Newsletter';
import './orwell.css';

export default function OrwellApp() {
  const [loaderVisible, setLoaderVisible] = useState(true);
  const [showAdmin, setShowAdmin] = useState(() => window.location.hash === '#admin');
  const [scrollEnabled, setScrollEnabled] = useState(false);
  const [grainOpacity, setGrainOpacity] = useState(0);
  const [heroVisible, setHeroVisible] = useState(true);
  const [s6Active, setS6Active] = useState(false);
  const [s6Tilt] = useState({ x: 0, z: 0 });
  const [scrollSpacerVh, setScrollSpacerVh] = useState(() => getScrollBounds().bodyVh);

  const handResolveRef = useRef<() => void>(() => {});
  const handLoadPromise = useMemo(
    () =>
      new Promise<void>((resolve) => {
        handResolveRef.current = resolve;
      }),
    [],
  );

  const heroRef = useRef<HeroSceneHandle>(null);
  const s2Ref = useRef<Section2Handle>(null);
  const s3Ref = useRef<Section3Handle>(null);
  const s4Ref = useRef<Section4Handle>(null);
  const s6Ref = useRef<Section6Handle>(null);
  const s7Ref = useRef<Section7Handle>(null);
  const s8Ref = useRef<Section8Handle>(null);
  const s9Ref = useRef<Section9Handle>(null);

  const onHandLoaded = useCallback(() => {
    handResolveRef.current();
  }, []);

  const onLoaderHidden = useCallback(() => {
    setLoaderVisible(false);
    setScrollEnabled(true);

    // Ensure mobile scrolling isn't left locked by the loader.
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';

    heroRef.current?.animateHandIn();
  }, []);

  const scrollCallbacks = useMemo(
    () => ({
      onS6Active: (active: boolean) => setS6Active(active),
      onGrainOpacity: setGrainOpacity,
      onHeroVisible: setHeroVisible,
    }),
    [],
  );

  const scrollRefs = useMemo(
    () => ({
      hero: heroRef,
      s2: s2Ref,
      s3: s3Ref,
      s4: s4Ref,
      s6: s6Ref,
      s7: s7Ref,
      s8: s8Ref,
      s9: s9Ref,
    }),
    [],
  );

  useOrwellScroll(scrollEnabled, scrollRefs, scrollCallbacks);

  useEffect(() => {
    // When scrolling is enabled, explicitly allow overflow again (mobile safari/chrome sometimes keeps it locked).
    if (scrollEnabled) {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
  }, [scrollEnabled]);

  useEffect(() => {
    const syncSpacer = () => setScrollSpacerVh(getScrollBounds(isMobileViewport()).bodyVh);
    syncSpacer();
    window.addEventListener('resize', syncSpacer);
    return () => window.removeEventListener('resize', syncSpacer);
  }, [scrollEnabled]);

  useEffect(() => {
    const onHashChange = () => setShowAdmin(window.location.hash === '#admin');
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return (
    <div className="orwell-root">
      {loaderVisible && <OrwellLoader handLoadPromise={handLoadPromise} onHidden={onLoaderHidden} />}
      <CornerLabels />
      <HeroScene ref={heroRef} onHandLoaded={onHandLoaded} visible={heroVisible} />
      <div
        id="hero-vignette"
        aria-hidden="true"
        style={{
          opacity: heroVisible ? 1 : 0,
          visibility: heroVisible ? 'visible' : 'hidden',
          transition: 'opacity 220ms ease',
        }}
      />
      <GrainOverlay opacity={grainOpacity} />
      <OrwellCursor />
      <Section2 ref={s2Ref} />
      <Section3 ref={s3Ref} />
      <Section4 ref={s4Ref} />
      <Section6
        ref={s6Ref}
        active={s6Active}
        velocity={0}
        tiltX={s6Tilt.x}
        tiltZ={s6Tilt.z}
      />
      <Section7 ref={s7Ref} />
      <Section8 ref={s8Ref} />
      <Section9 ref={s9Ref} />
      <div style={{ height: `${scrollSpacerVh}vh`, pointerEvents: 'none' }} aria-hidden />
      {!loaderVisible ? <Contact /> : null}
      {!loaderVisible && showAdmin ? <AdminContact /> : null}
    </div>
  );
}
