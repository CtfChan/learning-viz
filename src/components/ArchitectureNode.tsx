import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import type { ArchitectureNodeData } from '../utils/architectureBuilder';

function ArchitectureNode({ data, selected }: NodeProps) {
  const nodeData = data as unknown as ArchitectureNodeData;

  return (
    <div
      className={`arch-node ${selected ? 'selected' : ''}`}
      style={{ borderColor: nodeData.color }}
    >
      <Handle type="target" position={Position.Top} />
      <Handle type="target" position={Position.Left} />
      <div className="arch-node-name">{nodeData.shortName}</div>
      <Handle type="source" position={Position.Bottom} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

export default memo(ArchitectureNode);
