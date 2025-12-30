import type { CategoryConfig } from '../../types';

export const CATEGORY_COLORS: Record<string, string> = {
  'Configuration': '#4CAF50',      // Green
  'Network': '#2196F3',            // Blue
  'Resource Management': '#FF9800', // Orange
  'Workloads': '#9C27B0',          // Purple
  'Storage': '#00BCD4',            // Cyan
  'Security': '#F44336',           // Red
};

export const CATEGORY_POSITIONS: Record<string, CategoryConfig> = {
  // 2D grid layout for React Flow (scaled up for better spacing)
  // Top row
  'Configuration': { center: { x: 100, y: 50 }, radius: 150 },
  'Network': { center: { x: 500, y: 50 }, radius: 180 },
  'Resource Management': { center: { x: 900, y: 50 }, radius: 150 },
  // Bottom row
  'Workloads': { center: { x: 100, y: 400 }, radius: 180 },
  'Storage': { center: { x: 500, y: 400 }, radius: 150 },
  'Security': { center: { x: 900, y: 400 }, radius: 180 },
};

export const CONNECTIONS: [string, string][] = [
  ['Deployment', 'ReplicaSet'],
  ['ReplicaSet', 'HorizontalPodAutoscaler'],
  ['Deployment', 'HorizontalPodAutoscaler'],
  ['StatefulSet', 'PersistentVolumeClaim'],
  ['PersistentVolumeClaim', 'PersistentVolume'],
  ['PersistentVolume', 'StorageClass'],
  ['Service', 'Ingress'],
  ['Service', 'NetworkPolicy'],
  ['ServiceAccount', 'Role'],
  ['ServiceAccount', 'ClusterRole'],
  ['Role', 'RoleBinding'],
  ['ClusterRole', 'ClusterRoleBinding'],
  ['Deployment', 'ConfigMap'],
  ['Deployment', 'Secret'],
  ['StatefulSet', 'ConfigMap'],
  ['StatefulSet', 'Secret'],
];
