import { useState, useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import type { Node } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import GroupNode from '../components/GroupNode';
import ArchitectureNode from '../components/ArchitectureNode';
import { ArchitectureInfoPanel } from '../components/ArchitectureInfoPanel';
import { Navigation } from '../components/Navigation';
import { KUEUE_CONFIG, KUEUE_NODE_POSITIONS, KUEUE_GROUP_POSITIONS } from '../topics/kubernetes/kueue';
import { buildArchitectureGraph } from '../utils/architectureBuilder';
import type { ArchitectureNodeData } from '../utils/architectureBuilder';

const nodeTypes = {
  group: GroupNode,
  archNode: ArchitectureNode,
};

export function KueuePage() {
  const [selectedComponent, setSelectedComponent] = useState<ArchitectureNodeData | null>(null);

  const { nodes: initialNodes, edges: initialEdges } = useMemo(
    () => buildArchitectureGraph(KUEUE_CONFIG, KUEUE_NODE_POSITIONS, KUEUE_GROUP_POSITIONS),
    []
  );

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    if (node.type === 'archNode') {
      const nodeData = node.data as unknown as ArchitectureNodeData;
      setSelectedComponent(nodeData);
    }
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedComponent(null);
  }, []);

  return (
    <div className="app">
      <div className="header">
        <h1>Kueue Architecture</h1>
        <p>Job queueing and quota management for Kubernetes</p>
      </div>
      <Navigation />
      <div className="arch-legend">
        {KUEUE_CONFIG.groups.map((group) => (
          <div key={group.id} className="legend-item">
            <span
              className="legend-color"
              style={{ backgroundColor: group.color }}
            />
            <span className="legend-label">{group.name}</span>
          </div>
        ))}
        <div className="legend-item">
          <span
            className="legend-color"
            style={{ backgroundColor: '#FF9800' }}
          />
          <span className="legend-label">External</span>
        </div>
      </div>
      <div className="flow-container">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.3 }}
          minZoom={0.5}
          maxZoom={2}
        >
          <Background color="#333" gap={20} />
          <Controls />
          <MiniMap
            nodeColor={(node) => {
              if (node.type === 'group') {
                const data = node.data as { color: string };
                return data.color;
              }
              return '#666';
            }}
            maskColor="rgba(0, 0, 0, 0.8)"
          />
        </ReactFlow>
      </div>
      {selectedComponent && (
        <ArchitectureInfoPanel
          data={selectedComponent}
          onClose={() => setSelectedComponent(null)}
        />
      )}
      <div className="instructions">
        <p>Click a component for details | Scroll to zoom</p>
      </div>
    </div>
  );
}
