import './style.css';
import * as THREE from 'three';

import type { NodeData, TopicConfig } from './types';
import { topics, defaultTopic } from './topics';
import {
  createScene,
  handleResize,
  createNodes,
  createConnections,
  highlightNode,
  resetNodeHighlight,
  animateCamera,
  type SceneContext,
} from './scene';
import {
  createHeader,
  createNavTabs,
  createLegend,
  createInstructions,
  createInfoPanel,
  createTooltip,
  showInfoPanel,
  showTooltip,
  hideTooltip,
  updateTooltipPosition,
} from './ui';

// State
let sceneCtx: SceneContext;
let currentTopic: TopicConfig = defaultTopic;
let nodes: THREE.Object3D[] = [];
let nodeDataMap = new Map<THREE.Object3D, NodeData>();
let hoveredNode: THREE.Object3D | null = null;
let selectedNode: THREE.Object3D | null = null;

function init() {
  const app = document.querySelector<HTMLDivElement>('#app')!;

  // Create Three.js scene
  sceneCtx = createScene(app);

  // Load initial topic
  loadTopic(currentTopic);

  // Create UI
  createHeader(app, currentTopic);
  createNavTabs(
    app,
    ['Kubernetes', 'Kueue', 'KEDA', 'GCP', 'AWS'],
    currentTopic.id,
    handleTopicChange
  );
  createLegend(app, currentTopic.categoryColors, focusCategory);
  createTooltip(app);
  createInfoPanel(app);
  createInstructions(app);

  // Event listeners
  window.addEventListener('resize', () => handleResize(sceneCtx.camera, sceneCtx.renderer));
  sceneCtx.renderer.domElement.addEventListener('mousemove', onMouseMove);
  sceneCtx.renderer.domElement.addEventListener('click', onClick);

  // Start animation loop
  animate();
}

function loadTopic(topic: TopicConfig) {
  // Create nodes and connections for the topic
  const result = createNodes(
    sceneCtx.scene,
    topic.crds,
    topic.categoryColors,
    topic.categoryPositions
  );
  nodes = result.nodes;
  nodeDataMap = result.nodeDataMap;
  createConnections(sceneCtx.scene, nodes, nodeDataMap, topic.connections);
}

function handleTopicChange(topicId: string) {
  const newTopic = topics[topicId];
  if (!newTopic) {
    console.warn(`Topic "${topicId}" not implemented yet`);
    return;
  }

  // TODO: Clear scene and reload with new topic
  // For now, just log
  console.log(`Switching to topic: ${topicId}`);
}

function focusCategory(category: string) {
  const categoryNodes = nodes.filter(n => nodeDataMap.get(n)?.category === category);
  if (categoryNodes.length === 0) return;

  // Calculate center of category
  const center = new THREE.Vector3();
  categoryNodes.forEach(node => center.add(node.position));
  center.divideScalar(categoryNodes.length);

  // Animate camera to focus on category
  const targetPosition = center.clone().add(new THREE.Vector3(0, 2, 10));
  animateCamera(sceneCtx.camera, sceneCtx.controls, targetPosition, center);
}

function findNodeFromIntersect(object: THREE.Object3D): THREE.Object3D | null {
  // Walk up the parent chain to find the node group
  let current: THREE.Object3D | null = object;
  while (current) {
    if (nodes.includes(current)) {
      return current;
    }
    current = current.parent;
  }
  return null;
}

function onMouseMove(event: MouseEvent) {
  sceneCtx.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  sceneCtx.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  sceneCtx.raycaster.setFromCamera(sceneCtx.mouse, sceneCtx.camera);
  const intersects = sceneCtx.raycaster.intersectObjects(nodes, true);

  if (intersects.length > 0) {
    const node = findNodeFromIntersect(intersects[0].object);

    if (node && hoveredNode !== node) {
      if (hoveredNode && hoveredNode !== selectedNode) {
        resetNodeHighlight(hoveredNode);
      }

      hoveredNode = node;
      if (node !== selectedNode) {
        highlightNode(node);
      }

      const data = nodeDataMap.get(node);
      if (data) {
        showTooltip(data.name, event.clientX, event.clientY);
      }
    } else if (node) {
      updateTooltipPosition(event.clientX, event.clientY);
    }

    sceneCtx.renderer.domElement.style.cursor = 'pointer';
  } else {
    if (hoveredNode && hoveredNode !== selectedNode) {
      resetNodeHighlight(hoveredNode);
    }
    hoveredNode = null;
    hideTooltip();
    sceneCtx.renderer.domElement.style.cursor = 'grab';
  }
}

function onClick() {
  sceneCtx.raycaster.setFromCamera(sceneCtx.mouse, sceneCtx.camera);
  const intersects = sceneCtx.raycaster.intersectObjects(nodes, true);

  if (intersects.length > 0) {
    const node = findNodeFromIntersect(intersects[0].object);
    if (!node) return;

    // Reset previous selection
    if (selectedNode && selectedNode !== node) {
      resetNodeHighlight(selectedNode);
    }

    selectedNode = node;
    highlightNode(node);

    const data = nodeDataMap.get(node);
    if (data) {
      showInfoPanel(data, () => {
        if (selectedNode) {
          resetNodeHighlight(selectedNode);
          selectedNode = null;
        }
      });

      // Focus camera on selected node
      const targetPosition = node.position.clone().add(new THREE.Vector3(0, 2, 8));
      animateCamera(sceneCtx.camera, sceneCtx.controls, targetPosition, node.position);
    }
  }
}

function animate() {
  requestAnimationFrame(animate);
  sceneCtx.controls.update();
  sceneCtx.renderer.render(sceneCtx.scene, sceneCtx.camera);
}

// Initialize
init();
