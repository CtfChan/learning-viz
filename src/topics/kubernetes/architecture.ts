import type { ArchitectureConfig } from '../../types';

export const ARCHITECTURE_CONFIG: ArchitectureConfig = {
  groups: [
    {
      id: 'control-plane',
      name: 'Control Plane',
      description: 'Makes global decisions about the cluster and detects/responds to cluster events',
      color: '#4CAF50',
    },
    {
      id: 'worker-node',
      name: 'Worker Node',
      description: 'Runs containerized applications and provides the Kubernetes runtime environment',
      color: '#2196F3',
    },
  ],
  components: [
    // Control Plane Components
    {
      id: 'kube-apiserver',
      name: 'kube-apiserver',
      shortName: 'API Server',
      group: 'control-plane',
      description: 'Exposes the Kubernetes API. It is the front-end for the Kubernetes control plane.',
      responsibilities: [
        'Validates and configures data for API objects',
        'Services REST operations',
        'Provides the frontend to the cluster shared state',
        'Horizontally scalable - can run multiple instances',
      ],
      docsUrl: 'https://kubernetes.io/docs/concepts/overview/components/#kube-apiserver',
    },
    {
      id: 'etcd',
      name: 'etcd',
      shortName: 'etcd',
      group: 'control-plane',
      description: 'Consistent and highly-available key-value store used as Kubernetes backing store for all cluster data.',
      responsibilities: [
        'Stores all cluster data',
        'Provides distributed consensus',
        'Requires backup plan for production clusters',
      ],
      docsUrl: 'https://kubernetes.io/docs/concepts/overview/components/#etcd',
    },
    {
      id: 'kube-scheduler',
      name: 'kube-scheduler',
      shortName: 'Scheduler',
      group: 'control-plane',
      description: 'Watches for newly created Pods with no assigned node and selects a node for them to run on.',
      responsibilities: [
        'Selects optimal node for new pods',
        'Considers resource requirements',
        'Respects hardware/software constraints',
        'Handles affinity and anti-affinity rules',
      ],
      docsUrl: 'https://kubernetes.io/docs/concepts/overview/components/#kube-scheduler',
    },
    {
      id: 'kube-controller-manager',
      name: 'kube-controller-manager',
      shortName: 'Controller Manager',
      group: 'control-plane',
      description: 'Runs controller processes that regulate the state of the cluster.',
      responsibilities: [
        'Node Controller: Monitors node health',
        'Job Controller: Creates pods for one-off tasks',
        'EndpointSlice Controller: Links Services and Pods',
        'ServiceAccount Controller: Creates default accounts',
      ],
      docsUrl: 'https://kubernetes.io/docs/concepts/overview/components/#kube-controller-manager',
    },
    {
      id: 'cloud-controller-manager',
      name: 'cloud-controller-manager',
      shortName: 'Cloud Controller',
      group: 'control-plane',
      description: 'Embeds cloud-specific control logic. Only runs on cloud provider environments.',
      responsibilities: [
        'Node Controller: Checks cloud for node deletion',
        'Route Controller: Sets up routes in cloud infrastructure',
        'Service Controller: Creates cloud load balancers',
      ],
      docsUrl: 'https://kubernetes.io/docs/concepts/overview/components/#cloud-controller-manager',
    },
    // Worker Node Components
    {
      id: 'kubelet',
      name: 'kubelet',
      shortName: 'kubelet',
      group: 'worker-node',
      description: 'An agent that runs on each node in the cluster. It ensures containers are running in a Pod.',
      responsibilities: [
        'Registers node with API server',
        'Watches for PodSpecs',
        'Ensures containers are running and healthy',
        'Reports node and pod status to control plane',
      ],
      docsUrl: 'https://kubernetes.io/docs/concepts/overview/components/#kubelet',
    },
    {
      id: 'kube-proxy',
      name: 'kube-proxy',
      shortName: 'kube-proxy',
      group: 'worker-node',
      description: 'A network proxy that runs on each node, implementing part of the Kubernetes Service concept.',
      responsibilities: [
        'Maintains network rules on nodes',
        'Enables Service abstraction',
        'Handles TCP, UDP, and SCTP forwarding',
        'Uses OS packet filtering when available',
      ],
      docsUrl: 'https://kubernetes.io/docs/concepts/overview/components/#kube-proxy',
    },
    {
      id: 'container-runtime',
      name: 'Container Runtime',
      shortName: 'Runtime',
      group: 'worker-node',
      description: 'The software responsible for running containers (e.g., containerd, CRI-O).',
      responsibilities: [
        'Pulls container images',
        'Runs containers',
        'Manages container lifecycle',
        'Implements Container Runtime Interface (CRI)',
      ],
      docsUrl: 'https://kubernetes.io/docs/concepts/overview/components/#container-runtime',
    },
  ],
  connections: [
    // API server is the hub - connects to everything
    { from: 'kube-apiserver', to: 'etcd', label: 'reads/writes state' },
    { from: 'kube-scheduler', to: 'kube-apiserver', label: 'watches pods' },
    { from: 'kube-controller-manager', to: 'kube-apiserver', label: 'watches/updates' },
    { from: 'cloud-controller-manager', to: 'kube-apiserver', label: 'watches/updates' },
    { from: 'kubelet', to: 'kube-apiserver', label: 'reports status' },
    { from: 'kubelet', to: 'container-runtime', label: 'manages containers' },
  ],
};
