import type { CategoryConfig, Position } from '../../types';

export const CATEGORY_COLORS: Record<string, string> = {
  'Configuration': '#4CAF50',      // Green
  'Network': '#2196F3',            // Blue
  'Resource Management': '#FF9800', // Orange
  'Pod Generator': '#9C27B0',      // Purple (renamed from Workloads)
  'Storage': '#00BCD4',            // Cyan
  'Security': '#F44336',           // Red
};

export const CATEGORY_POSITIONS: Record<string, CategoryConfig> = {
  // Layout matching image.png
  // Top row (left to right)
  'Configuration': { center: { x: 150, y: 150 }, radius: 100 },
  'Network': { center: { x: 500, y: 150 }, radius: 180 },
  'Resource Management': { center: { x: 850, y: 150 }, radius: 100 },
  // Bottom row (left to right)
  'Pod Generator': { center: { x: 150, y: 450 }, radius: 150 },
  'Storage': { center: { x: 500, y: 500 }, radius: 140 },
  'Security': { center: { x: 850, y: 450 }, radius: 180 },
};

// Explicit node positions matching image.png layout exactly
export const NODE_POSITIONS: Record<string, Position> = {
  // Configuration (top-left) - stacked vertically
  'ConfigMap': { x: 80, y: 80 },
  'Secret': { x: 80, y: 180 },

  // Network/Exposition (top-center) - Service left, Endpoint below, NetworkPolicy top-center, Ingress right
  'Service': { x: 380, y: 120 },
  'NetworkPolicy': { x: 500, y: 50 },
  'Ingress': { x: 620, y: 120 },

  // Resource Management (top-right) - side by side
  'ResourceQuota': { x: 780, y: 100 },
  'LimitRange': { x: 900, y: 100 },

  // Pod Generator (bottom-left) - HPA top, Pod/Deployment/ReplicaSet middle row, StatefulSet bottom
  'HorizontalPodAutoscaler': { x: 80, y: 320 },
  'Pod': { x: 310, y: 420 },
  'Deployment': { x: 50, y: 420 },
  'ReplicaSet': { x: 180, y: 420 },
  'StatefulSet': { x: 115, y: 520 },

  // Storage (center-bottom) - PVC top-left, PV top-right, StorageClass bottom-center
  'PersistentVolumeClaim': { x: 420, y: 420 },
  'PersistentVolume': { x: 560, y: 420 },
  'StorageClass': { x: 490, y: 520 },

  // Security (bottom-right) - complex arrangement
  'ServiceAccount': { x: 760, y: 320 },
  'Role': { x: 900, y: 320 },
  'RoleBinding': { x: 830, y: 420 },
  'ClusterRole': { x: 760, y: 520 },
  'ClusterRoleBinding': { x: 900, y: 520 },
};

// Connection with type info for styling
export interface Connection {
  from: string;
  to: string;
  type: 'creates' | 'references';
  label?: string;
}

export const CONNECTIONS_DETAILED: Connection[] = [
  // Pod Generator "creates" relationships
  { from: 'Deployment', to: 'ReplicaSet', type: 'creates', label: 'creates' },
  { from: 'ReplicaSet', to: 'Pod', type: 'creates', label: 'creates' },
  { from: 'StatefulSet', to: 'Pod', type: 'creates', label: 'creates' },
  { from: 'StatefulSet', to: 'PersistentVolumeClaim', type: 'creates', label: 'creates' },

  // HPA references
  { from: 'HorizontalPodAutoscaler', to: 'Deployment', type: 'references' },
  { from: 'HorizontalPodAutoscaler', to: 'ReplicaSet', type: 'references' },
  { from: 'HorizontalPodAutoscaler', to: 'StatefulSet', type: 'references' },

  // Storage "references" relationships
  { from: 'PersistentVolumeClaim', to: 'PersistentVolume', type: 'references', label: 'references' },
  { from: 'PersistentVolumeClaim', to: 'StorageClass', type: 'references' },
  { from: 'PersistentVolume', to: 'StorageClass', type: 'references' },

  // Network relationships
  { from: 'Ingress', to: 'Service', type: 'references' },
  { from: 'NetworkPolicy', to: 'Service', type: 'references' },

  // Security relationships - Role bindings
  { from: 'RoleBinding', to: 'Role', type: 'references' },
  { from: 'RoleBinding', to: 'ServiceAccount', type: 'references' },
  { from: 'ClusterRoleBinding', to: 'ClusterRole', type: 'references' },
  { from: 'ClusterRoleBinding', to: 'ServiceAccount', type: 'references' },

  // Configuration references (workloads reference these)
  { from: 'Deployment', to: 'ConfigMap', type: 'references', label: 'references' },
  { from: 'Deployment', to: 'Secret', type: 'references', label: 'references' },
  { from: 'StatefulSet', to: 'ConfigMap', type: 'references' },
  { from: 'StatefulSet', to: 'Secret', type: 'references' },
  { from: 'Deployment', to: 'ServiceAccount', type: 'references' },
  { from: 'StatefulSet', to: 'ServiceAccount', type: 'references' },
];

// Legacy format for backwards compatibility
export const CONNECTIONS: [string, string][] = CONNECTIONS_DETAILED.map(c => [c.from, c.to]);
