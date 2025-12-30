import type { Node, Edge } from '@xyflow/react';
import type { TopicConfig } from '../types';

export function buildNodesAndEdges(topic: TopicConfig): {
  initialNodes: Node[];
  initialEdges: Edge[];
} {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // Create nodes for each CRD
  topic.crds.forEach((crd) => {
    const categoryConfig = topic.categoryPositions[crd.category];
    if (!categoryConfig) return;

    // Calculate position within category cluster
    const crdsInCategory = topic.crds.filter((c) => c.category === crd.category);
    const indexInCategory = crdsInCategory.indexOf(crd);
    const angle =
      (indexInCategory / crdsInCategory.length) * Math.PI * 2 - Math.PI / 2;
    const radius = categoryConfig.radius * 0.8;

    const position = {
      x: categoryConfig.center.x + Math.cos(angle) * radius,
      y: categoryConfig.center.y + Math.sin(angle) * radius,
    };

    const color = topic.categoryColors[crd.category] || '#666';

    nodes.push({
      id: crd.name,
      type: 'crd',
      position,
      data: {
        ...crd,
        color,
      },
    });
  });

  // Create edges for connections
  topic.connections.forEach(([from, to], index) => {
    edges.push({
      id: `edge-${index}`,
      source: from,
      target: to,
      type: 'default',
      style: {
        stroke: '#646cff',
        strokeWidth: 2,
        opacity: 0.5,
      },
      animated: false,
    });
  });

  return { initialNodes: nodes, initialEdges: edges };
}
