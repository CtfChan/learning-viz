import * as THREE from 'three';
import type { CategoryConfig } from '../../types';

export const CATEGORY_COLORS: Record<string, number> = {
  'Configuration': 0x4CAF50,      // Green
  'Network': 0x2196F3,            // Blue
  'Resource Management': 0xFF9800, // Orange
  'Workloads': 0x9C27B0,          // Purple
  'Storage': 0x00BCD4,            // Cyan
  'Security': 0xF44336,           // Red
};

export const CATEGORY_POSITIONS: Record<string, CategoryConfig> = {
  'Configuration': { center: new THREE.Vector3(-8, 4, 0), radius: 3 },
  'Network': { center: new THREE.Vector3(0, 6, 0), radius: 4 },
  'Resource Management': { center: new THREE.Vector3(8, 4, 0), radius: 3 },
  'Workloads': { center: new THREE.Vector3(-6, -2, 0), radius: 5 },
  'Storage': { center: new THREE.Vector3(6, -2, 0), radius: 4 },
  'Security': { center: new THREE.Vector3(0, -6, 0), radius: 5 },
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
