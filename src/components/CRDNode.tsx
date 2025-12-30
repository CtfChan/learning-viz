import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import type { CRDData } from '../types';

type CRDNodeData = CRDData & { color: string };

export const CRDNode = memo(function CRDNode({ data, selected }: NodeProps) {
  const nodeData = data as unknown as CRDNodeData;
  const iconUrl = nodeData.icon
    ? `${import.meta.env.BASE_URL}${nodeData.icon.replace(/^\//, '')}`
    : null;

  const handleStyle = { opacity: 0, pointerEvents: 'none' as const };

  return (
    <div
      className={`crd-node ${selected ? 'selected' : ''}`}
      style={{
        borderColor: nodeData.color,
        boxShadow: selected ? `0 0 20px ${nodeData.color}` : `0 0 10px ${nodeData.color}40`,
      }}
    >
      {/* Handles on all four sides for flexible edge connections */}
      <Handle type="source" position={Position.Top} id="top" style={handleStyle} />
      <Handle type="source" position={Position.Right} id="right" style={handleStyle} />
      <Handle type="source" position={Position.Bottom} id="bottom" style={handleStyle} />
      <Handle type="source" position={Position.Left} id="left" style={handleStyle} />
      <Handle type="target" position={Position.Top} id="top-target" style={handleStyle} />
      <Handle type="target" position={Position.Right} id="right-target" style={handleStyle} />
      <Handle type="target" position={Position.Bottom} id="bottom-target" style={handleStyle} />
      <Handle type="target" position={Position.Left} id="left-target" style={handleStyle} />

      {iconUrl ? (
        <img src={iconUrl} alt={nodeData.name} className="crd-icon" />
      ) : (
        <div
          className="crd-icon-placeholder"
          style={{ backgroundColor: nodeData.color }}
        />
      )}
      <div className="crd-name">{nodeData.name}</div>
    </div>
  );
});
