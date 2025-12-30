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

  return (
    <div
      className={`crd-node ${selected ? 'selected' : ''}`}
      style={{
        borderColor: nodeData.color,
        boxShadow: selected ? `0 0 20px ${nodeData.color}` : `0 0 10px ${nodeData.color}40`,
      }}
    >
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      {iconUrl ? (
        <img src={iconUrl} alt={nodeData.name} className="crd-icon" />
      ) : (
        <div
          className="crd-icon-placeholder"
          style={{ backgroundColor: nodeData.color }}
        />
      )}
      <div className="crd-name">{nodeData.name}</div>
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
    </div>
  );
});
