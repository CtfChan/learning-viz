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

  // Helper to determine best handles based on relative node positions
  const getHandles = (sourcePos: { x: number; y: number }, targetPos: { x: number; y: number }) => {
    const dx = targetPos.x - sourcePos.x;
    const dy = targetPos.y - sourcePos.y;

    // Determine primary direction
    if (Math.abs(dx) > Math.abs(dy)) {
      // Horizontal connection
      if (dx > 0) {
        return { sourceHandle: 'right', targetHandle: 'left-target' };
      } else {
        return { sourceHandle: 'left', targetHandle: 'right-target' };
      }
    } else {
      // Vertical connection
      if (dy > 0) {
        return { sourceHandle: 'bottom', targetHandle: 'top-target' };
      } else {
        return { sourceHandle: 'top', targetHandle: 'bottom-target' };
      }
    }
  };

  // Create edges for connections with styling based on type
  topic.connections.forEach((connection, index) => {
    const isCreates = connection.type === 'creates';
    const color = isCreates ? '#4CAF50' : '#646cff';

    // Get positions to determine handle placement
    const sourcePos = topic.nodePositions[connection.from];
    const targetPos = topic.nodePositions[connection.to];
    const handles = sourcePos && targetPos
      ? getHandles(sourcePos, targetPos)
      : { sourceHandle: 'bottom', targetHandle: 'top-target' };

    edges.push({
      id: `edge-${index}`,
      source: connection.from,
      target: connection.to,
      sourceHandle: handles.sourceHandle,
      targetHandle: handles.targetHandle,
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
