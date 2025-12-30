import type { CategoryConfig, Position } from "../../types";

export const CATEGORY_COLORS: Record<string, string> = {
  Cluster: "#607D8B", // Blue Grey
  Configuration: "#4CAF50", // Green
  Network: "#2196F3", // Blue
  "Resource Management": "#FF9800", // Orange
  "Pod Generator": "#9C27B0", // Purple (renamed from Workloads)
  Storage: "#00BCD4", // Cyan
  Security: "#F44336", // Red
};

export const CATEGORY_POSITIONS: Record<string, CategoryConfig> = {
  // Layout matching image.png
  // Top row (left to right)
  Cluster: { center: { x: 1100, y: 150 }, radius: 100 },
  Configuration: { center: { x: 150, y: 150 }, radius: 100 },
  Network: { center: { x: 500, y: 150 }, radius: 180 },
  "Resource Management": { center: { x: 850, y: 150 }, radius: 100 },
  // Bottom row (left to right)
  "Pod Generator": { center: { x: 150, y: 450 }, radius: 150 },
  Storage: { center: { x: 500, y: 500 }, radius: 140 },
  Security: { center: { x: 850, y: 450 }, radius: 180 },
};

// Explicit node positions
export const NODE_POSITIONS: Record<string, Position> = {
  // Cluster
  Namespace: { x: 1099, y: -6 },
  Node: { x: 1097, y: 180 },

  // Configuration
  ConfigMap: { x: 348, y: 98 },
  Secret: { x: 205, y: 90 },

  // Network
  Service: { x: 559, y: 27 },
  Endpoints: { x: 558, y: 195 },
  Ingress: { x: 727, y: 185 },
  NetworkPolicy: { x: 718, y: 23 },

  // Resource Management
  ResourceQuota: { x: 887, y: -4 },
  LimitRange: { x: 896, y: 178 },

  // Pod Generator
  HorizontalPodAutoscaler: { x: -213, y: 264 },
  Pod: { x: 310, y: 420 },
  Deployment: { x: -315, y: 432 },
  ReplicaSet: { x: -88, y: 426 },
  StatefulSet: { x: -34, y: 659 },
  DaemonSet: { x: -21, y: 265 },
  Job: { x: 34, y: 128 },

  // Storage
  PersistentVolume: { x: 333, y: 584 },
  PersistentVolumeClaim: { x: 516, y: 583 },
  StorageClass: { x: 532, y: 761 },

  // Security
  ServiceAccount: { x: 738, y: 366 },
  Role: { x: 929, y: 656 },
  ClusterRole: { x: 1022, y: 527 },
  RoleBinding: { x: 747, y: 650 },
  ClusterRoleBinding: { x: 1009, y: 369 },
};

import type { Connection } from "../../types";

export const CONNECTIONS_DETAILED: Connection[] = [
  // Network relationships
  { from: "Service", to: "Endpoints", type: "creates", label: "creates" },
  { from: "Endpoints", to: "Pod", type: "references", label: "references" },
  {
    from: "NetworkPolicy",
    to: "Service",
    type: "references",
    label: "references",
  },

  // Configuration references
  { from: "Pod", to: "ConfigMap", type: "references", label: "references" },
  { from: "Pod", to: "Secret", type: "references", label: "references" },

  // Storage references
  {
    from: "Pod",
    to: "PersistentVolume",
    type: "references",
    label: "references",
  },
  {
    from: "StorageClass",
    to: "PersistentVolumeClaim",
    type: "creates",
    label: "creates",
  },
  {
    from: "PersistentVolume",
    to: "PersistentVolumeClaim",
    type: "references",
    label: "references",
  },

  // Pod generator relationships
  { from: "ReplicaSet", to: "Pod", type: "creates", label: "creates" },
  { from: "StatefulSet", to: "Pod", type: "creates", label: "creates" },
  { from: "DaemonSet", to: "Pod", type: "creates", label: "creates" },
  {
    from: "StatefulSet",
    to: "PersistentVolume",
    type: "creates",
    label: "creates",
  },
  { from: "Deployment", to: "ReplicaSet", type: "creates", label: "creates" },
  { from: "HorizontalPodAutoscaler", to: "Deployment", type: "references" },
  { from: "HorizontalPodAutoscaler", to: "ReplicaSet", type: "references" },
  { from: "Job", to: "Pod", type: "creates", label: "creates" },

  // IAM relationships
  {
    from: "Pod",
    to: "ServiceAccount",
    type: "references",
    label: "references",
  },
  {
    from: "ClusterRoleBinding",
    to: "ServiceAccount",
    type: "references",
    label: "references",
  },
  {
    from: "ClusterRoleBinding",
    to: "ClusterRole",
    type: "references",
    label: "references",
  },
  {
    from: "RoleBinding",
    to: "ServiceAccount",
    type: "references",
    label: "references",
  },
  { from: "RoleBinding", to: "Role", type: "references", label: "references" },
];
