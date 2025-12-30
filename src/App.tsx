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

import { CRDNode } from './components/CRDNode';
import { InfoPanel } from './components/InfoPanel';
import { Header } from './components/Header';
import { Legend } from './components/Legend';
import type { CRDData } from './types';
import { defaultTopic } from './topics';
import { buildNodesAndEdges } from './utils/graphBuilder';

interface CRDNodeData extends CRDData {
  color: string;
}

const nodeTypes = {
  crd: CRDNode,
};

function App() {
  const [selectedCRD, setSelectedCRD] = useState<CRDData | null>(null);
  const currentTopic = defaultTopic;

  const { initialNodes, initialEdges } = useMemo(
    () => buildNodesAndEdges(currentTopic),
    [currentTopic]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    const crdData = node.data as unknown as CRDNodeData;
    setSelectedCRD(crdData);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedCRD(null);
  }, []);

  const focusCategory = useCallback(
    (category: string) => {
      const categoryNodes = nodes.filter(
        (n) => (n.data as unknown as CRDNodeData).category === category
      );
      if (categoryNodes.length === 0) return;

      // Highlight the category nodes
      setNodes((nds) =>
        nds.map((n) => ({
          ...n,
          style: {
            ...n.style,
            opacity: (n.data as unknown as CRDNodeData).category === category ? 1 : 0.3,
          },
        }))
      );

      // Reset after a delay
      setTimeout(() => {
        setNodes((nds) =>
          nds.map((n) => ({
            ...n,
            style: { ...n.style, opacity: 1 },
          }))
        );
      }, 2000);
    },
    [nodes, setNodes]
  );

  return (
    <div className="app">
      <Header topic={currentTopic} />
      <Legend
        categoryColors={currentTopic.categoryColors}
        onCategoryClick={focusCategory}
      />
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
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.3}
          maxZoom={2}
        >
          <Background color="#333" gap={20} />
          <Controls />
          <MiniMap
            nodeColor={(node) => {
              const data = node.data as unknown as CRDNodeData;
              return currentTopic.categoryColors[data.category] || '#666';
            }}
            maskColor="rgba(0, 0, 0, 0.8)"
          />
        </ReactFlow>
      </div>
      {selectedCRD && (
        <InfoPanel data={selectedCRD} onClose={() => setSelectedCRD(null)} />
      )}
      <div className="instructions">
        <p>Drag to pan | Scroll to zoom</p>
        <p>Click a node for details</p>
      </div>
    </div>
  );
}

export default App;
