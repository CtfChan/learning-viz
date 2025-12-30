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

export interface TopicConfig {
  id: string;
  name: string;
  description: string;
  crds: CRDData[];
  categoryColors: Record<string, string>;
  categoryPositions: Record<string, CategoryConfig>;
  connections: [string, string][];
}
