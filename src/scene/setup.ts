import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export interface SceneContext {
  scene: THREE.Scene;
  camera: THREE.OrthographicCamera;
  renderer: THREE.WebGLRenderer;
  controls: OrbitControls;
  raycaster: THREE.Raycaster;
  mouse: THREE.Vector2;
}

// Calculate orthographic camera frustum size based on viewport
function getFrustumSize(): { width: number; height: number } {
  const baseSize = 25; // Controls how much of the scene is visible
  const aspect = window.innerWidth / window.innerHeight;
  if (aspect > 1) {
    return { width: baseSize * aspect, height: baseSize };
  }
  return { width: baseSize, height: baseSize / aspect };
}

export function createScene(container: HTMLElement): SceneContext {
  // Scene
  const scene = new THREE.Scene();

  // Orthographic Camera for 2D view
  const frustum = getFrustumSize();
  const camera = new THREE.OrthographicCamera(
    -frustum.width / 2,
    frustum.width / 2,
    frustum.height / 2,
    -frustum.height / 2,
    0.1,
    1000
  );
  // Position camera looking down at XY plane
  camera.position.set(0, 0, 50);
  camera.lookAt(0, 0, 0);

  // Renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // Controls - configured for 2D panning/zooming
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.enableRotate = false; // Disable rotation for 2D
  controls.screenSpacePanning = true; // Pan in screen space
  controls.minZoom = 0.5;
  controls.maxZoom = 3;

  // Raycaster for mouse interaction
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  // Lighting - simpler for 2D
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
  scene.add(ambientLight);

  return { scene, camera, renderer, controls, raycaster, mouse };
}

export function handleResize(camera: THREE.OrthographicCamera, renderer: THREE.WebGLRenderer): void {
  const frustum = getFrustumSize();
  camera.left = -frustum.width / 2;
  camera.right = frustum.width / 2;
  camera.top = frustum.height / 2;
  camera.bottom = -frustum.height / 2;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
