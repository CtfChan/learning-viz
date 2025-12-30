import * as THREE from 'three';
import type { CRDData, NodeData, CategoryConfig } from '../types';

const textureCache = new Map<string, THREE.Texture>();

function loadSvgTexture(iconPath: string): Promise<THREE.Texture | null> {
  if (textureCache.has(iconPath)) {
    return Promise.resolve(textureCache.get(iconPath)!);
  }

  return new Promise((resolve) => {
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, 256, 256);

      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      textureCache.set(iconPath, texture);
      resolve(texture);
    };

    img.onerror = () => {
      console.warn(`Failed to load icon: ${iconPath}`);
      resolve(null);
    };

    // Use import.meta.env.BASE_URL for Vite base path
    img.src = import.meta.env.BASE_URL + iconPath.replace(/^\//, '');
  });
}

export function createNodes(
  scene: THREE.Scene,
  crds: CRDData[],
  categoryColors: Record<string, number>,
  categoryPositions: Record<string, CategoryConfig>
): { nodes: THREE.Object3D[]; nodeDataMap: Map<THREE.Object3D, NodeData> } {
  const nodes: THREE.Object3D[] = [];
  const nodeDataMap = new Map<THREE.Object3D, NodeData>();

  // Create nodes for each CRD
  crds.forEach((crd) => {
    const categoryConfig = categoryPositions[crd.category];
    if (!categoryConfig) return;

    // Calculate position within category cluster
    const crdsInCategory = crds.filter(c => c.category === crd.category);
    const indexInCategory = crdsInCategory.indexOf(crd);
    const angle = (indexInCategory / crdsInCategory.length) * Math.PI * 2;
    const radius = categoryConfig.radius * 0.7;

    const position = new THREE.Vector3(
      categoryConfig.center.x + Math.cos(angle) * radius,
      categoryConfig.center.y + Math.sin(angle) * radius * 0.5,
      Math.sin(angle) * 2 + (Math.random() - 0.5) * 2
    );

    const color = categoryColors[crd.category] || 0xffffff;

    // Create container group
    const group = new THREE.Group();
    group.position.copy(position);

    // Create invisible sphere for raycasting only
    // Uses transparent material with depthWrite disabled so it doesn't occlude other objects
    const hitGeometry = new THREE.SphereGeometry(1.0, 8, 8);
    const hitMaterial = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0,
      depthWrite: false,
    });
    const hitMesh = new THREE.Mesh(hitGeometry, hitMaterial);
    group.add(hitMesh);

    // Store data on the group
    const nodeData: NodeData = {
      ...crd,
      position: position.clone(),
      color,
    };

    // We'll use the group as the "node" for raycasting
    scene.add(group);
    nodes.push(group);
    nodeDataMap.set(group, nodeData);

    // Load and add icon sprite
    if (crd.icon) {
      loadSvgTexture(crd.icon).then((texture) => {
        if (texture) {
          const spriteMaterial = new THREE.SpriteMaterial({
            map: texture,
            transparent: true,
          });
          const sprite = new THREE.Sprite(spriteMaterial);
          sprite.scale.set(2.5, 2.5, 1);
          group.add(sprite);
        } else {
          // Fallback: create a colored sphere if icon fails to load
          addFallbackSphere(group, color);
        }
      });
    } else {
      // No icon: create a colored sphere
      addFallbackSphere(group, color);
    }
  });

  return { nodes, nodeDataMap };
}

function addFallbackSphere(group: THREE.Group, color: number): void {
  const geometry = new THREE.SphereGeometry(0.6, 32, 32);
  const material = new THREE.MeshPhongMaterial({
    color: color,
    emissive: color,
    emissiveIntensity: 0.2,
    shininess: 100,
  });
  const sphere = new THREE.Mesh(geometry, material);
  group.add(sphere);

  // Add glow
  const glowGeometry = new THREE.SphereGeometry(0.8, 32, 32);
  const glowMaterial = new THREE.MeshBasicMaterial({
    color: color,
    transparent: true,
    opacity: 0.15,
  });
  const glow = new THREE.Mesh(glowGeometry, glowMaterial);
  group.add(glow);
}

export function createConnections(
  scene: THREE.Scene,
  nodes: THREE.Object3D[],
  nodeDataMap: Map<THREE.Object3D, NodeData>,
  connections: [string, string][]
): void {
  connections.forEach(([from, to]) => {
    const fromNode = nodes.find(n => nodeDataMap.get(n)?.name === from);
    const toNode = nodes.find(n => nodeDataMap.get(n)?.name === to);

    if (fromNode && toNode) {
      const points = [fromNode.position, toNode.position];
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({
        color: 0x646cff,
        transparent: true,
        opacity: 0.3,
      });
      const line = new THREE.Line(geometry, material);
      scene.add(line);
    }
  });
}

export function highlightNode(node: THREE.Object3D): void {
  node.scale.setScalar(1.3);
}

export function resetNodeHighlight(node: THREE.Object3D): void {
  node.scale.setScalar(1);
}
