import type { Node, Edge } from '@xyflow/react';
import type { ArchitectureConfig } from '../types';

export interface ArchitectureNodeData {
  id: string;
  name: string;
  shortName: string;
  description: string;
  responsibilities: string[];
  docsUrl: string;
  color: string;
  group: string;
  [key: string]: unknown;
}

export interface GroupNodeData {
  label: string;
  description: string;
  color: string;
  [key: string]: unknown;
}

const GROUP_WIDTH = 580;
const GROUP_HEIGHT = 280;
const GROUP_GAP = 80;
const NODE_WIDTH = 140;
const NODE_HEIGHT = 60;
const PADDING = 30;
const HEADER_HEIGHT = 50;
const SPACING = 20;

export function buildArchitectureGraph(config: ArchitectureConfig): {
  nodes: Node[];
  edges: Edge[];
} {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // Create group nodes (parents)
  config.groups.forEach((group, groupIndex) => {
    const groupX = groupIndex * (GROUP_WIDTH + GROUP_GAP);
    const groupY = 50;

    nodes.push({
      id: group.id,
      type: 'group',
      position: { x: groupX, y: groupY },
      data: {
        label: group.name,
        description: group.description,
        color: group.color,
      } as GroupNodeData,
      style: {
        width: GROUP_WIDTH,
        height: GROUP_HEIGHT,
      },
    });

    // Create child nodes within group
    const componentsInGroup = config.components.filter((c) => c.group === group.id);
    const cols = 3;

    componentsInGroup.forEach((component, compIndex) => {
      const col = compIndex % cols;
      const row = Math.floor(compIndex / cols);

      nodes.push({
        id: component.id,
        type: 'archNode',
        position: {
          x: PADDING + col * (NODE_WIDTH + SPACING),
          y: HEADER_HEIGHT + PADDING + row * (NODE_HEIGHT + SPACING),
        },
        parentId: group.id,
        extent: 'parent',
        data: {
          id: component.id,
          name: component.name,
          shortName: component.shortName,
          description: component.description,
          responsibilities: component.responsibilities,
          docsUrl: component.docsUrl,
          color: group.color,
          group: group.name,
        } as ArchitectureNodeData,
      });
    });
  });

  // Create edges between components
  config.connections.forEach((conn, index) => {
    edges.push({
      id: `arch-edge-${index}`,
      source: conn.from,
      target: conn.to,
      label: conn.label,
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#888', strokeWidth: 2 },
      labelStyle: { fill: '#fff', fontSize: 10 },
      labelBgStyle: { fill: 'rgba(0,0,0,0.7)' },
    });
  });

  return { nodes, edges };
}
