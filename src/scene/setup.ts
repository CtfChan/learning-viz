import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export interface SceneContext {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  controls: OrbitControls;
  raycaster: THREE.Raycaster;
  mouse: THREE.Vector2;
}

export function createScene(container: HTMLElement): SceneContext {
  // Scene
  const scene = new THREE.Scene();

  // Camera
  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 5, 20);

  // Renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.maxDistance = 50;
  controls.minDistance = 5;

  // Raycaster for mouse interaction
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(10, 20, 10);
  scene.add(directionalLight);

  const pointLight = new THREE.PointLight(0x646cff, 1, 50);
  pointLight.position.set(0, 10, 0);
  scene.add(pointLight);

  return { scene, camera, renderer, controls, raycaster, mouse };
}

export function handleResize(camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer): void {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
