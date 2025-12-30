import * as THREE from 'three';

export interface CRDData {
  name: string;
  shortName: string;
  category: string;
  description: string;
  example: string;
  keyFields: string[];
  useCases: string[];
  docsUrl: string;
}

export interface NodeData extends CRDData {
  position: THREE.Vector3;
  color: number;
}

export interface CategoryConfig {
  center: THREE.Vector3;
  radius: number;
}

export interface TopicConfig {
  id: string;
  name: string;
  description: string;
  crds: CRDData[];
  categoryColors: Record<string, number>;
  categoryPositions: Record<string, CategoryConfig>;
  connections: [string, string][];
}
