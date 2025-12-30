import * as THREE from 'three';
import type { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export function animateCamera(
  camera: THREE.PerspectiveCamera,
  controls: OrbitControls,
  targetPosition: THREE.Vector3,
  lookAt: THREE.Vector3
): void {
  const startPosition = camera.position.clone();
  const startTarget = controls.target.clone();
  const duration = 1000;
  const startTime = Date.now();

  function update() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeOutCubic(progress);

    camera.position.lerpVectors(startPosition, targetPosition, eased);
    controls.target.lerpVectors(startTarget, lookAt, eased);

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  update();
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}
