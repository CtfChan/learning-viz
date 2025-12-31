export interface CRDData {
  name: string;
  shortName: string;
  category: string;
  description: string;
  example: string;
  keyFields: string[];
  useCases: string[];
  docsUrl: string;
  icon?: string;
}

export interface Position {
  x: number;
  y: number;
}

export interface CategoryConfig {
  center: Position;
  radius: number;
}

export interface Connection {
  from: string;
  to: string;
  type: 'creates' | 'references';
  label?: string;
}

export interface TopicConfig {
  id: string;
  name: string;
  description: string;
  crds: CRDData[];
  categoryColors: Record<string, string>;
  categoryPositions: Record<string, CategoryConfig>;
  nodePositions: Record<string, Position>; // Explicit position for each node by name
  connections: Connection[];
}

// Architecture visualization types
export interface ArchitectureComponent {
  id: string;
  name: string;
  shortName: string;
  group: 'control-plane' | 'worker-node';
  description: string;
  responsibilities: string[];
  docsUrl: string;
}

export interface ArchitectureGroup {
  id: 'control-plane' | 'worker-node';
  name: string;
  description: string;
  color: string;
}

export interface ArchitectureConnection {
  from: string;
  to: string;
  label?: string;
}

export interface ArchitectureConfig {
  groups: ArchitectureGroup[];
  components: ArchitectureComponent[];
  connections: ArchitectureConnection[];
}
