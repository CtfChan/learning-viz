import type { CRDData } from '../types';

interface InfoPanelProps {
  data: CRDData;
  onClose: () => void;
}

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

export function InfoPanel({ data, onClose }: InfoPanelProps) {
  return (
    <div className="info-panel visible">
      <button className="info-panel-close" onClick={onClose}>
        &times;
      </button>
      <h2>{data.name}</h2>
      <span className="category-badge">{data.category}</span>
      <p className="description">{data.description}</p>

      <h3>Example YAML</h3>
      <pre>
        <code>{escapeHtml(data.example)}</code>
      </pre>

      <h3>Key Fields</h3>
      <ul>
        {data.keyFields.map((field, i) => (
          <li key={i}>
            <code>{field}</code>
          </li>
        ))}
      </ul>

      <h3>Common Use Cases</h3>
      <ul>
        {data.useCases.map((useCase, i) => (
          <li key={i}>{useCase}</li>
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
