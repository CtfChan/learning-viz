interface LegendProps {
  categoryColors: Record<string, string>;
  onCategoryClick: (category: string) => void;
}

export function Legend({ categoryColors, onCategoryClick }: LegendProps) {
  return (
    <div className="legend">
      <h4>Categories</h4>
      {Object.entries(categoryColors).map(([name, color]) => (
        <div
          key={name}
          className="legend-item"
          onClick={() => onCategoryClick(name)}
        >
          <div className="legend-color" style={{ background: color }} />
          <span>{name}</span>
        </div>
      ))}

      <h4 style={{ marginTop: '16px' }}>Connections</h4>
      <div className="legend-item">
        <svg width="30" height="12" style={{ marginRight: '8px' }}>
          <line x1="0" y1="6" x2="24" y2="6" stroke="#4CAF50" strokeWidth="2.5" />
          <polygon points="24,6 18,2 18,10" fill="#4CAF50" />
        </svg>
        <span>creates</span>
      </div>
      <div className="legend-item">
        <svg width="30" height="12" style={{ marginRight: '8px' }}>
          <line x1="0" y1="6" x2="24" y2="6" stroke="#646cff" strokeWidth="2" strokeDasharray="4,3" />
          <polygon points="24,6 18,2 18,10" fill="#646cff" />
        </svg>
        <span>references</span>
      </div>
    </div>
  );
}
