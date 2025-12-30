import type { TopicConfig } from '../types';
import { kubernetes } from './kubernetes';

// Register all topics here
export const topics: Record<string, TopicConfig> = {
  kubernetes,
  // Add more topics as they are implemented:
  // kueue,
  // keda,
  // gcp,
  // aws,
};

export const topicList = Object.values(topics);
export const defaultTopic = kubernetes;
