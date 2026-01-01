import { Link } from "react-router-dom";

interface VisualizationCard {
  title: string;
  description: string;
  path: string;
  icon: string;
  color: string;
}

const visualizations: VisualizationCard[] = [
  {
    title: "CRD Explorer",
    description:
      "Explore Kubernetes Custom Resource Definitions and their relationships in an interactive graph visualization.",
    path: "/crds",
    icon: "🔷",
    color: "#646cff",
  },
  {
    title: "Architecture",
    description:
      "Understand the Kubernetes architecture with Control Plane and Worker Node components visualized.",
    path: "/architecture",
    icon: "🏗️",
    color: "#4CAF50",
  },
  {
    title: "Kueue",
    description:
      "Explore Kueue's job queueing system with ClusterQueues, LocalQueues, and resource management.",
    path: "/kueue",
    icon: "📊",
    color: "#9C27B0",
  },
];

export function HomePage() {
  return (
    <div className="home-page">
      <div className="home-hero">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="hero-icon">☸️</span>
            Learning Viz
          </h1>
          <p className="hero-subtitle">
            Interactive visualizations for understanding cloud concepts
          </p>
        </div>
        <div className="hero-glow" />
      </div>

      <div className="home-cards">
        {visualizations.map((viz) => (
          <Link
            to={viz.path}
            key={viz.path}
            className="viz-card"
            style={{ "--card-color": viz.color } as React.CSSProperties}
          >
            <div className="viz-card-icon">{viz.icon}</div>
            <h2 className="viz-card-title">{viz.title}</h2>
            <p className="viz-card-description">{viz.description}</p>
            <div className="viz-card-arrow">→</div>
          </Link>
        ))}
      </div>

      <footer className="home-footer">
        <p>Built with React Flow & TypeScript</p>
      </footer>
    </div>
  );
}
