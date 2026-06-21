import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

type BookSceneProps = {
  active: boolean;
  velocity: number;
  tiltX: number;
  tiltZ: number;
};

export default function BookScene({ active, velocity, tiltX, tiltZ }: BookSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const modelRef = useRef<THREE.Group | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const w = window.innerWidth;
    const h = window.innerHeight;
    const isMobile = w <= 768;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 100);
    camera.position.set(0, 0, 5);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobile,
      alpha: true,
      canvas,
      powerPreference: 'high-performance',
    });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 2));
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    rendererRef.current = renderer;

    const bookLight = new THREE.SpotLight(0xffffff, 100);
    bookLight.position.set(0, 8, 5);
    bookLight.angle = 0.4;
    bookLight.penumbra = 0.8;
    scene.add(bookLight);
    scene.add(new THREE.AmbientLight(0xffffff, 0.1));

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
    const bookLoader = new GLTFLoader();
    bookLoader.setDRACOLoader(dracoLoader);
    bookLoader.load('/orwell/models/the-book.glb', (gltf) => {
      const bookModel = gltf.scene;
      bookModel.scale.setScalar(isMobile ? 1.1 : 2);
      bookModel.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material = new THREE.MeshStandardMaterial({
            color: 0x111111,
            roughness: 0.9,
            metalness: 0.1,
          });
        }
      });
      scene.add(bookModel);
      modelRef.current = bookModel;
    });

    const onResize = () => {
      const nw = window.innerWidth;
      const nh = window.innerHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      dracoLoader.dispose();
    };
  }, []);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!active) return;
      const model = modelRef.current;
      const renderer = rendererRef.current;
      const camera = cameraRef.current;
      const scene = sceneRef.current;
      if (model) {
        model.rotation.y += 0.005 + velocity * 0.08;
        model.rotation.x += (tiltX - model.rotation.x) * 0.04;
        model.rotation.z += (tiltZ - model.rotation.z) * 0.04;
      }
      if (renderer && camera && scene) renderer.render(scene, camera);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [active, velocity, tiltX, tiltZ]);

  return <canvas ref={canvasRef} id="book-canvas" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />;
}
