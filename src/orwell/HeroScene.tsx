import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { FontLoader, type Font } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import gsap from 'gsap';
import { HERO_BRAND, HERO_FLOATING_CHARS } from './data';

const HAND_MODEL_URL = '/orwell/models/hand.glb';
const FONT_URL = 'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json';
const DIGIT_TARGET_SIZE = 0.72;
const DIGIT_HANG_GAP = 0.06;

const ropeOffsets = [
  new THREE.Vector3(-0.15, -0.9, 0.09),
  new THREE.Vector3(0.05, -0.95, 0.19),
  new THREE.Vector3(0.2, -0.9, 0.09),
  new THREE.Vector3(0.4, -0.65, 0.05),
];

type ThreeFont = Font;

function createDigitGeometry(letter: string, font: ThreeFont) {
  const geometry = new TextGeometry(letter, {
    font,
    size: 0.8,
    depth: 0.1,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.02,
  });
  geometry.computeBoundingBox();
  geometry.center();
  geometry.computeBoundingBox();
  return geometry;
}

function createFloatingDigit(letter: string, font: ThreeFont, geometryCache: Map<string, THREE.BufferGeometry>) {
  let baseGeometry = geometryCache.get(letter);
  if (!baseGeometry) {
    baseGeometry = createDigitGeometry(letter, font);
    geometryCache.set(letter, baseGeometry);
  }
  const geometry = baseGeometry.clone();
  geometry.computeBoundingBox();

  const bbox = geometry.boundingBox!;
  const width = bbox.max.x - bbox.min.x;
  const height = bbox.max.y - bbox.min.y;
  const maxDim = Math.max(width, height, 0.001);
  const scale = DIGIT_TARGET_SIZE / maxDim;

  const mesh = new THREE.Mesh(
    geometry,
    new THREE.MeshStandardMaterial({ color: 0x2a2a2a, metalness: 0.08, roughness: 0.92 }),
  );
  mesh.scale.setScalar(scale);
  mesh.userData.hangHeight = (height * scale) / 2;
  return mesh;
}

export type HeroSceneHandle = {
  canvas: HTMLCanvasElement | null;
  animateHandIn: () => void;
};

type HeroSceneProps = {
  onHandLoaded: () => void;
  visible?: boolean;
};

function createBigBrotherEye() {
  const eyeGroup = new THREE.Group();
  const eyeBall = new THREE.Mesh(
    new THREE.SphereGeometry(4, 32, 32),
    new THREE.MeshStandardMaterial({ color: 0xb0aca0, roughness: 0.95, metalness: 0 }),
  );
  eyeGroup.add(eyeBall);

  const limbus = new THREE.Mesh(
    new THREE.CircleGeometry(2.08, 64),
    new THREE.MeshStandardMaterial({ color: 0x070705, side: THREE.DoubleSide }),
  );
  limbus.position.z = 3.83;
  eyeBall.add(limbus);

  const iris = new THREE.Mesh(
    new THREE.CircleGeometry(1.72, 64),
    new THREE.MeshStandardMaterial({ color: 0x0e0e0b, roughness: 0.22, metalness: 0.04, side: THREE.DoubleSide }),
  );
  iris.position.z = 3.87;
  eyeBall.add(iris);

  const pupil = new THREE.Mesh(new THREE.CircleGeometry(0.52, 32), new THREE.MeshBasicMaterial({ color: 0x000000 }));
  pupil.position.z = 3.92;
  eyeBall.add(pupil);

  const glint = new THREE.Mesh(
    new THREE.CircleGeometry(0.16, 16),
    new THREE.MeshBasicMaterial({ color: 0xd8e4f0, transparent: true, opacity: 0.6 }),
  );
  glint.position.set(0.3, 0.3, 3.93);
  eyeBall.add(glint);

  const cornea = new THREE.Mesh(
    new THREE.SphereGeometry(4.05, 32, 32),
    new THREE.MeshPhongMaterial({
      color: 0xc8d4e8,
      transparent: true,
      opacity: 0.06,
      shininess: 160,
      specular: 0xddeeff,
    }),
  );
  eyeGroup.add(cornea);
  return eyeGroup;
}

function animateBrandIn(brandEl: HTMLDivElement | null) {
  if (!brandEl) return;
  gsap.fromTo(
    brandEl,
    { opacity: 0, y: 24 },
    { opacity: 1, y: 0, duration: 1.4, ease: 'power3.out', delay: 0.4 },
  );
}

function darkenHandMaterials(root: THREE.Object3D) {
  root.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;
    const materials = Array.isArray(child.material) ? child.material : [child.material];
    materials.forEach((material) => {
      if (material instanceof THREE.MeshStandardMaterial) {
        material.color.multiplyScalar(0.5);
        material.roughness = Math.min(1, material.roughness + 0.2);
        material.metalness = Math.max(0, material.metalness - 0.15);
      }
    });
  });
}

function animateHandDrop(hand: THREE.Object3D, brandEl: HTMLDivElement | null) {
  gsap.to(hand.position, { y: 2.5, duration: 3, ease: 'power4.out' });
  animateBrandIn(brandEl);
}

const HeroScene = forwardRef<HeroSceneHandle, HeroSceneProps>(function HeroScene(
  { onHandLoaded, visible = true },
  ref,
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const brandRef = useRef<HTMLDivElement>(null);
  const handRef = useRef<THREE.Group | null>(null);
  const pendingHandInRef = useRef(false);
  const onHandLoadedRef = useRef(onHandLoaded);

  useEffect(() => {
    onHandLoadedRef.current = onHandLoaded;
  }, [onHandLoaded]);

  useImperativeHandle(ref, () => ({
    canvas: canvasRef.current,
    animateHandIn: () => {
      pendingHandInRef.current = true;
      if (handRef.current) {
        animateHandDrop(handRef.current, brandRef.current);
      }
    },
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let alive = true;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const isMobile = w <= 768;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xcc0000);

    const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 100);
    camera.position.set(0, 0, isMobile ? 11 : 7);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobile,
      canvas,
      powerPreference: 'high-performance',
    });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.enableZoom = false;
    controls.enablePan = false;
    if (w <= 1024) controls.enabled = false;

    scene.add(new THREE.AmbientLight(0xffffff, 0.05));
    const mainSpot = new THREE.SpotLight(0xffffff, 220);
    mainSpot.position.set(0, 12, 2);
    mainSpot.angle = 0.3;
    mainSpot.penumbra = 0.8;
    scene.add(mainSpot);
    const fillLight = new THREE.PointLight(0xffffff, 28);
    fillLight.position.set(0, -4, 4);
    scene.add(fillLight);
    const eyeLight = new THREE.PointLight(0xffffff, 35);
    eyeLight.position.set(0, 0, 5);
    scene.add(eyeLight);

    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    if (!isMobile) {
      composer.addPass(new UnrealBloomPass(new THREE.Vector2(w, h), 0.4, 0.1, 0.8));
      composer.addPass(new FilmPass(0.7, false));
      composer.addPass(
        new ShaderPass({
          uniforms: {
            tDiffuse: { value: null },
            strength: { value: 0.15 },
          },
          vertexShader: `
            varying vec2 vUv;
            void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `,
          fragmentShader: `
            uniform sampler2D tDiffuse;
            uniform float strength;
            varying vec2 vUv;
            void main() {
              vec2 uv = vUv - 0.5;
              float dist = dot(uv, uv);
              uv *= 1.0 + strength * dist;
              uv += 0.5;
              vec2 edge = smoothstep(0.0, 0.02, uv) * smoothstep(1.0, 0.98, uv);
              float edgeFactor = edge.x * edge.y;
              vec4 color = texture2D(tDiffuse, clamp(uv, 0.0, 1.0));
              gl_FragColor = mix(vec4(0.0, 0.0, 0.0, 1.0), color, edgeFactor);
            }
          `,
        }),
      );
    }

    const eyes: THREE.Group[] = [];
    const items: THREE.Mesh[] = [];
    const ropeLines: THREE.Line[] = [];
    const digitGeometryCache = new Map<string, THREE.BufferGeometry>();
    const mouse = { x: 0, y: 0 };

    if (!isMobile) {
      const eyePositions: [number, number, number][] = [
        [-7, 4, -6],
        [6, 3, -7],
        [-3, -2, -9],
        [5, -1, -11],
        [-9, 1, -13],
        [1, 6, -15],
      ];
      const eyeScales = [0.5, 0.46, 0.36, 0.34, 0.26, 0.22];
      eyePositions.forEach((pos, i) => {
        const eye = createBigBrotherEye();
        eye.scale.setScalar(eyeScales[i]);
        eye.position.set(...pos);
        scene.add(eye);
        eyes.push(eye);
      });
    }

    const fontLoader = new FontLoader();
    fontLoader.load(
      FONT_URL,
      (font) => {
        if (!alive) return;
        HERO_FLOATING_CHARS.forEach((letter) => {
          const digit = createFloatingDigit(letter, font, digitGeometryCache);
          scene.add(digit);
          items.push(digit);
        });
      },
      undefined,
      (error) => {
        console.error('Failed to load hero digit font:', error);
      },
    );

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    const finishHandLoad = () => {
      if (!alive) return;
      onHandLoadedRef.current();
      if (pendingHandInRef.current && handRef.current) {
        animateHandDrop(handRef.current, brandRef.current);
      }
    };

    gltfLoader.load(
      HAND_MODEL_URL,
      (gltf) => {
        if (!alive) return;
        const hand = gltf.scene;
        darkenHandMaterials(hand);
        hand.scale.setScalar(isMobile ? 3.2 : 4.5);
        hand.rotation.set(Math.PI, Math.PI, Math.PI);
        hand.position.y = 10;
        scene.add(hand);
        handRef.current = hand;

        const ropeCount = Math.min(ropeOffsets.length, HERO_FLOATING_CHARS.length);
        for (let i = 0; i < ropeCount; i++) {
          const geo = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, -1.2, 0),
          ]);
          const line = new THREE.Line(geo, new THREE.LineBasicMaterial({ color: 0xffffff }));
          scene.add(line);
          ropeLines.push(line);
        }

        finishHandLoad();
      },
      undefined,
      (error) => {
        console.error('Failed to load hero hand model:', error);
        finishHandLoad();
      },
    );

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMouseMove);

    let raf = 0;
    const animate = () => {
      if (!alive) return;
      raf = requestAnimationFrame(animate);
      controls.update();
      const hand = handRef.current;
      if (hand) {
        hand.rotation.y += (mouse.x * 0.3 + Math.PI - hand.rotation.y) * 0.05;
        hand.rotation.x += (-mouse.y * 0.15 + Math.PI - hand.rotation.x) * 0.05;
        ropeOffsets.forEach((offset, i) => {
          const digit = items[i];
          if (!digit) return;

          const worldPos = offset.clone().applyMatrix4(hand.matrixWorld);
          const endPos = worldPos.clone();
          endPos.y -= 1.2;
          const positions = ropeLines[i]?.geometry.attributes.position;
          if (positions) {
            positions.setXYZ(0, worldPos.x, worldPos.y, worldPos.z);
            positions.setXYZ(1, endPos.x, endPos.y, endPos.z);
            positions.needsUpdate = true;
          }

          const hangHeight = (digit.userData.hangHeight as number | undefined) ?? 0.36;
          digit.position.set(endPos.x, endPos.y - hangHeight - DIGIT_HANG_GAP, endPos.z);
          digit.quaternion.copy(hand.quaternion);
        });
      }
      const mouse3D = new THREE.Vector3(mouse.x * 10, mouse.y * 10, 0);
      eyes.forEach((eye) => eye.lookAt(mouse3D));
      if (isMobile) renderer.render(scene, camera);
      else composer.render();
    };
    animate();

    const onResize = () => {
      const nw = window.innerWidth;
      const nh = window.innerHeight;
      const aspect = nw / nh;
      camera.aspect = aspect;
      camera.position.z = aspect < 0.75 ? 12 : aspect < 1.1 ? 9 : 7;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
      composer.setSize(nw, nh);
      if (handRef.current) {
        handRef.current.scale.setScalar(aspect < 0.75 ? 3.0 : aspect < 1.1 ? 3.8 : 4.5);
      }
    };
    window.addEventListener('resize', onResize);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      handRef.current = null;
      items.forEach((mesh) => {
        mesh.geometry.dispose();
        if (Array.isArray(mesh.material)) mesh.material.forEach((m) => m.dispose());
        else mesh.material.dispose();
      });
      digitGeometryCache.forEach((geometry) => geometry.dispose());
      renderer.dispose();
      dracoLoader.dispose();
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        id="hero-canvas"
        style={{ visibility: visible ? 'visible' : 'hidden' }}
      />
      <div
        ref={brandRef}
        id="hero-brand"
        style={{
          visibility: visible ? 'visible' : 'hidden',
          opacity: 0,
          position: 'fixed',
          top: 'clamp(14%, 18vh, 24%)',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 6,
          pointerEvents: 'none',
          textAlign: 'center',
          width: 'min(92vw, 900px)',
        }}
      >
        <div
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 'clamp(48px, 10vw, 120px)',
            color: '#fff',
            lineHeight: 0.9,
            letterSpacing: 8,
            textShadow: '0 0 40px rgba(0,0,0,0.35)',
          }}
        >
          {HERO_BRAND.name}
        </div>
        <div
          style={{
            fontFamily: "'EB Garamond', serif",
            fontSize: 'clamp(11px, 1.4vw, 16px)',
            color: 'rgba(255,255,255,0.72)',
            letterSpacing: 'clamp(3px, 0.6vw, 6px)',
            marginTop: 10,
            textTransform: 'uppercase',
          }}
        >
          {HERO_BRAND.tagline}
        </div>
      </div>
    </>
  );
});

export default HeroScene;
