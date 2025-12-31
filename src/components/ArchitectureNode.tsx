import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import type { ArchitectureNodeData } from '../utils/architectureBuilder';

const handleStyle = {
  width: 8,
  height: 8,
  background: '#555',
  border: '2px solid #888',
};

function ArchitectureNode({ data, selected }: NodeProps) {
  const nodeData = data as unknown as ArchitectureNodeData;

  return (
    <div
      className={`arch-node ${selected ? 'selected' : ''}`}
      style={{ borderColor: nodeData.color }}
    >
      {/* Each position has both source and target handles */}
      <Handle type="source" position={Position.Top} id="top" style={handleStyle} />
      <Handle type="target" position={Position.Top} id="top" style={handleStyle} />

      <Handle type="source" position={Position.Left} id="left" style={handleStyle} />
      <Handle type="target" position={Position.Left} id="left" style={handleStyle} />

      <div className="arch-node-name">{nodeData.shortName}</div>

      <Handle type="source" position={Position.Bottom} id="bottom" style={handleStyle} />
      <Handle type="target" position={Position.Bottom} id="bottom" style={handleStyle} />

      <Handle type="source" position={Position.Right} id="right" style={handleStyle} />
      <Handle type="target" position={Position.Right} id="right" style={handleStyle} />
    </div>
  );
}

export default memo(ArchitectureNode);
