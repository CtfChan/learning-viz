import type { TopicConfig } from '../../types';
import { CRDS } from './data';
import { CATEGORY_COLORS, CATEGORY_POSITIONS, NODE_POSITIONS, CONNECTIONS_DETAILED } from './config';

export const kubernetes: TopicConfig = {
  id: 'kubernetes',
  name: 'Kubernetes',
  description: 'Core Kubernetes Custom Resource Definitions',
  crds: CRDS,
  categoryColors: CATEGORY_COLORS,
  categoryPositions: CATEGORY_POSITIONS,
  nodePositions: NODE_POSITIONS,
  connections: CONNECTIONS_DETAILED,
};
