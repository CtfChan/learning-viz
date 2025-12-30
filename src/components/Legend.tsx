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
    </div>
  );
}
