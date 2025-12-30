import type { TopicConfig } from '../types';

interface HeaderProps {
  topic: TopicConfig;
}

export function Header({ topic }: HeaderProps) {
  return (
    <div className="header">
      <h1>{topic.name} CRD Explorer</h1>
      <p>{topic.description}</p>
    </div>
  );
}
