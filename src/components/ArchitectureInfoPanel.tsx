import type { ArchitectureNodeData } from '../utils/architectureBuilder';

interface ArchitectureInfoPanelProps {
  data: ArchitectureNodeData;
  onClose: () => void;
}

export function ArchitectureInfoPanel({ data, onClose }: ArchitectureInfoPanelProps) {
  return (
    <div className="info-panel visible">
      <button className="info-panel-close" onClick={onClose}>
        &times;
      </button>
      <h2>{data.name}</h2>
      <span className="category-badge" style={{ backgroundColor: data.color }}>
        {data.group}
      </span>
      <p className="description">{data.description}</p>

      <h3>Responsibilities</h3>
      <ul>
        {data.responsibilities.map((resp, i) => (
          <li key={i}>{resp}</li>
        ))}
      </ul>

      <div className="links">
        <a href={data.docsUrl} target="_blank" rel="noopener noreferrer" className="link-btn">
          Official Docs
        </a>
      </div>
    </div>
  );
}
