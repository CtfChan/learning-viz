import * as THREE from 'three';
import type { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export function animateCamera(
  camera: THREE.OrthographicCamera,
  controls: OrbitControls,
  _targetPosition: THREE.Vector3,
  lookAt: THREE.Vector3
): void {
  // For 2D orthographic view, we pan the camera to center on the target
  // The camera stays at a fixed Z position looking at the XY plane
  const startTarget = controls.target.clone();
  const targetXY = new THREE.Vector3(lookAt.x, lookAt.y, 0);
  const duration = 500;
  const startTime = Date.now();

  function update() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeOutCubic(progress);

    controls.target.lerpVectors(startTarget, targetXY, eased);
    camera.position.x = controls.target.x;
    camera.position.y = controls.target.y;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  update();
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}
