# K8s Learning - CRD Explorer

An interactive visualization tool for exploring and understanding Kubernetes Custom Resource Definitions (CRDs), Kueue, KEDA, GCP, and AWS resources. Built with React Flow, this project provides an intuitive way to visualize relationships between different cloud-native resources.

## Features

- **Interactive Graph Visualization**: Explore CRDs and their relationships through an interactive node-based interface
- **Multiple Topics**: Support for various cloud and Kubernetes topics including:
  - Kubernetes Core Resources
  - Kueue
  - KEDA (Kubernetes Event-Driven Autoscaling)
  - GCP Resources
  - AWS Resources
- **Category Organization**: Resources are organized by categories (e.g., Cluster, Configuration, Network, Storage, Security)
- **Detailed Resource Information**: Click on any resource to view detailed information in a side panel
- **Visual Legend**: Color-coded categories with interactive highlighting
- **Zoom & Pan**: Full control over the visualization with zoom, pan, and fit-view capabilities
- **Minimap**: Navigate large graphs easily with the built-in minimap

## Prerequisites

- Node.js (v16 or higher recommended)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd learning-viz
```

2. Install dependencies:
```bash
npm install
```

## Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

## Build

Create a production build:

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

## Project Structure

```
learning-viz/
├── src/
│   ├── App.tsx              # Main application component
│   ├── main.tsx             # Application entry point
│   ├── style.css            # Global styles
│   ├── types.ts             # TypeScript type definitions
│   ├── components/          # React components
│   │   ├── CRDNode.tsx      # Custom node component for resources
│   │   ├── Header.tsx       # Application header
│   │   ├── InfoPanel.tsx    # Resource detail panel
│   │   └── Legend.tsx       # Category legend
│   ├── topics/              # Topic-specific data and configurations
│   │   ├── kubernetes/      # Kubernetes resources
│   │   ├── keda/            # KEDA resources
│   │   ├── kueue/           # Kueue resources
│   │   ├── aws/             # AWS resources
│   │   └── gcp/             # GCP resources
│   └── utils/
│       └── graphBuilder.ts  # Graph construction utilities
├── public/                  # Static assets
│   └── icons/
│       └── k8s/             # Kubernetes icons
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Technologies Used

- **React 19** - UI framework
- **TypeScript** - Type-safe development
- **Vite** - Build tool and dev server
- **React Flow (@xyflow/react)** - Interactive node-based graph visualization
- **CSS** - Styling

## Usage

1. **Navigate the Graph**: Click and drag to pan around the visualization
2. **Zoom**: Use mouse wheel or the controls in the bottom-right corner
3. **View Resource Details**: Click on any node to see detailed information in the side panel
4. **Highlight Categories**: Click on category badges in the legend to temporarily highlight resources in that category
5. **Reset View**: Click on empty space to deselect nodes

## Adding New Topics

To add a new topic:

1. Create a new directory in `src/topics/`
2. Add the following files:
   - `config.ts` - Category colors, positions, and node layouts
   - `data.ts` - Resource definitions and relationships
   - `index.ts` - Export the topic configuration
3. Update `src/topics/index.ts` to include your new topic

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Acknowledgments

- [React Flow](https://reactflow.dev/) - For the excellent graph visualization library
- Kubernetes community - For comprehensive documentation on CRDs
