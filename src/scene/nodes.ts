import * as THREE from 'three';
import type { CRDData, NodeData, CategoryConfig } from '../types';

export function createNodes(
  scene: THREE.Scene,
  crds: CRDData[],
  categoryColors: Record<string, number>,
  categoryPositions: Record<string, CategoryConfig>
): { nodes: THREE.Mesh[]; nodeDataMap: Map<THREE.Mesh, NodeData> } {
  const nodes: THREE.Mesh[] = [];
  const nodeDataMap = new Map<THREE.Mesh, NodeData>();
  const categories = [...new Set(crds.map(crd => crd.category))];

  // Create category labels
  categories.forEach(category => {
    const pos = categoryPositions[category];
    if (pos) {
      createCategoryLabel(
        scene,
        category,
        pos.center.clone().add(new THREE.Vector3(0, pos.radius + 1.5, 0))
      );
    }
  });

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

    // Create sphere
    const geometry = new THREE.SphereGeometry(0.6, 32, 32);
    const material = new THREE.MeshPhongMaterial({
      color: color,
      emissive: color,
      emissiveIntensity: 0.2,
      shininess: 100,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(position);

    // Store data
    const nodeData: NodeData = {
      ...crd,
      position,
      color,
    };
    nodeDataMap.set(mesh, nodeData);

    // Add glow effect
    const glowGeometry = new THREE.SphereGeometry(0.8, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.15,
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    mesh.add(glow);

    scene.add(mesh);
    nodes.push(mesh);

    // Create label
    createNodeLabel(scene, crd.shortName, position);
  });

  return { nodes, nodeDataMap };
}

function createNodeLabel(scene: THREE.Scene, text: string, position: THREE.Vector3): void {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d')!;
  canvas.width = 256;
  canvas.height = 64;

  context.fillStyle = 'transparent';
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.font = 'bold 28px Arial';
  context.textAlign = 'center';
  context.fillStyle = '#ffffff';
  context.fillText(text, canvas.width / 2, canvas.height / 2 + 10);

  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthTest: false,
  });
  const sprite = new THREE.Sprite(material);
  sprite.position.copy(position);
  sprite.position.y -= 1.2;
  sprite.scale.set(2, 0.5, 1);
  scene.add(sprite);
}

function createCategoryLabel(scene: THREE.Scene, text: string, position: THREE.Vector3): void {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d')!;
  canvas.width = 512;
  canvas.height = 64;

  context.fillStyle = 'transparent';
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.font = 'bold 32px Arial';
  context.textAlign = 'center';
  context.fillStyle = 'rgba(255, 255, 255, 0.6)';
  context.fillText(text.toUpperCase(), canvas.width / 2, canvas.height / 2 + 10);

  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthTest: false,
  });
  const sprite = new THREE.Sprite(material);
  sprite.position.copy(position);
  sprite.scale.set(6, 0.75, 1);
  scene.add(sprite);
}

export function createConnections(
  scene: THREE.Scene,
  nodes: THREE.Mesh[],
  nodeDataMap: Map<THREE.Mesh, NodeData>,
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

export function highlightNode(mesh: THREE.Mesh): void {
  const material = mesh.material as THREE.MeshPhongMaterial;
  material.emissiveIntensity = 0.5;
  mesh.scale.setScalar(1.2);
}

export function resetNodeHighlight(mesh: THREE.Mesh): void {
  const material = mesh.material as THREE.MeshPhongMaterial;
  material.emissiveIntensity = 0.2;
  mesh.scale.setScalar(1);
}
