import type { Node, Edge, MarkerType } from '@xyflow/react';
import type { TopicConfig } from '../types';

export function buildNodesAndEdges(topic: TopicConfig): {
  initialNodes: Node[];
  initialEdges: Edge[];
} {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // Create nodes for each CRD
  topic.crds.forEach((crd) => {
    // Use explicit position if available, otherwise fall back to calculated position
    let position = topic.nodePositions[crd.name];

    if (!position) {
      // Fallback: calculate position within category cluster (circular arrangement)
      const categoryConfig = topic.categoryPositions[crd.category];
      if (!categoryConfig) return;

      const crdsInCategory = topic.crds.filter((c) => c.category === crd.category);
      const indexInCategory = crdsInCategory.indexOf(crd);
      const angle =
        (indexInCategory / crdsInCategory.length) * Math.PI * 2 - Math.PI / 2;
      const radius = categoryConfig.radius * 0.8;

      position = {
        x: categoryConfig.center.x + Math.cos(angle) * radius,
        y: categoryConfig.center.y + Math.sin(angle) * radius,
      };
    }

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

  // Create edges for connections with styling based on type
  topic.connections.forEach((connection, index) => {
    const isCreates = connection.type === 'creates';
    const color = isCreates ? '#4CAF50' : '#646cff';

    edges.push({
      id: `edge-${index}`,
      source: connection.from,
      target: connection.to,
      type: 'default',
      markerEnd: {
        type: 'arrowclosed' as MarkerType,
        color: color,
        width: 20,
        height: 20,
      },
      style: {
        stroke: color,
        strokeWidth: isCreates ? 2.5 : 2,
        strokeDasharray: isCreates ? undefined : '5,5', // Dashed for references
        opacity: 0.8,
      },
      animated: false,
    });
  });

  return { initialNodes: nodes, initialEdges: edges };
}
