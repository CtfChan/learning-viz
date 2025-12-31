import { memo } from 'react';
import type { NodeProps } from '@xyflow/react';
import type { GroupNodeData } from '../utils/architectureBuilder';

function GroupNode({ data }: NodeProps) {
  const nodeData = data as unknown as GroupNodeData;

  return (
    <div
      className="group-node"
      style={{ borderColor: nodeData.color }}
    >
      <div className="group-node-header" style={{ borderBottomColor: nodeData.color }}>
        <h3 style={{ color: nodeData.color }}>{nodeData.label}</h3>
        <p>{nodeData.description}</p>
      </div>
      <div className="group-node-content" />
    </div>
  );
}

export default memo(GroupNode);
