import type { ArchitectureConfig } from "../../types";
import type { Position } from "../../types";

// Explicit node positions
export const KUEUE_NODE_POSITIONS: Record<string, Position> = {
  // Cohort contains ClusterQueues
  "cluster-queue-1": { x: 80, y: 120 },
  "cluster-queue-2": { x: 409, y: 119 },
  // Namespace-scoped resources
  "local-queue": { x: 120, y: 150 },
  workload: { x: 120, y: 280 },
  // External/Cluster resources
  "resource-flavor": { x: 1412, y: -130 },
  "admission-check": { x: 1414, y: 79 },
};

export const KUEUE_CONFIG: ArchitectureConfig = {
  groups: [
    {
      id: "control-plane",
      name: "Cohort",
      description:
        "A group of ClusterQueues that can borrow unused quota from each other",
      color: "#9C27B0",
    },
    {
      id: "worker-node",
      name: "Namespace Scope",
      description: "Tenant-specific resources within namespaces",
      color: "#FF9800",
    },
  ],
  components: [
    // ClusterQueues inside Cohort
    {
      id: "cluster-queue-1",
      name: "ClusterQueue",
      shortName: "ClusterQueue A",
      group: "control-plane",
      description:
        "A cluster-scoped resource that governs a pool of resources, defining usage limits and Fair Sharing rules.",
      responsibilities: [
        "Defines resource quotas (CPU, memory, GPUs)",
        "Manages admission policies",
        "Configures queueing strategy (StrictFIFO, BestEffortFIFO)",
        "Can borrow/lend quota within Cohort",
      ],
      docsUrl: "https://kueue.sigs.k8s.io/docs/concepts/cluster_queue/",
    },
    {
      id: "cluster-queue-2",
      name: "ClusterQueue",
      shortName: "ClusterQueue B",
      group: "control-plane",
      description:
        "A cluster-scoped resource that governs a pool of resources, defining usage limits and Fair Sharing rules.",
      responsibilities: [
        "Defines resource quotas (CPU, memory, GPUs)",
        "Manages admission policies",
        "Configures queueing strategy (StrictFIFO, BestEffortFIFO)",
        "Can borrow/lend quota within Cohort",
      ],
      docsUrl: "https://kueue.sigs.k8s.io/docs/concepts/cluster_queue/",
    },
    // Namespace-scoped components
    {
      id: "local-queue",
      name: "LocalQueue",
      shortName: "LocalQueue",
      group: "worker-node",
      description:
        "A namespaced resource that groups closely related workloads belonging to a single tenant.",
      responsibilities: [
        "Provides namespace-level queue",
        "Routes workloads to ClusterQueues",
        "Enables multi-tenancy",
        "Isolates team workloads",
      ],
      docsUrl: "https://kueue.sigs.k8s.io/docs/concepts/local_queue/",
    },
    {
      id: "workload",
      name: "Workload",
      shortName: "Workload",
      group: "worker-node",
      description:
        "The unit of admission in Kueue. Represents an application that will run to completion.",
      responsibilities: [
        "Defines resource requests per pod set",
        "Specifies priority for queueing",
        "Tracks admission status",
        "Supports Jobs, RayJobs, MPIJobs, etc.",
      ],
      docsUrl: "https://kueue.sigs.k8s.io/docs/concepts/workload/",
    },
    // External cluster-scoped resources
    {
      id: "resource-flavor",
      name: "ResourceFlavor",
      shortName: "ResourceFlavor",
      description:
        "Represents variations of resources available in the cluster, like different GPU models or node types.",
      responsibilities: [
        "Maps to specific node groups via labels",
        "Defines resource variations (e.g., GPU models)",
        "Enables heterogeneous cluster support",
        "Supports spot vs on-demand instances",
      ],
      docsUrl: "https://kueue.sigs.k8s.io/docs/concepts/resource_flavor/",
    },
    {
      id: "admission-check",
      name: "AdmissionCheck",
      shortName: "AdmissionCheck",
      description:
        "A mechanism allowing internal or external components to influence the timing of workload admission.",
      responsibilities: [
        "Gates workload admission",
        "Integrates external provisioners",
        "Validates resource availability",
        "Supports custom admission logic",
      ],
      docsUrl: "https://kueue.sigs.k8s.io/docs/concepts/admission_check/",
    },
  ],
  connections: [
    // LocalQueue submits to ClusterQueue
    {
      from: "local-queue",
      to: "cluster-queue-1",
      label: "submits to",
      sourceHandle: "top",
      targetHandle: "bottom",
    },
    // Workload queued in LocalQueue
    {
      from: "workload",
      to: "local-queue",
      label: "queued in",
      sourceHandle: "top",
      targetHandle: "bottom",
    },
    // ClusterQueues can borrow from each other
    {
      from: "cluster-queue-1",
      to: "cluster-queue-2",
      label: "borrows quota",
      sourceHandle: "right",
      targetHandle: "left",
    },
    // ClusterQueue references ResourceFlavor
    {
      from: "cluster-queue-1",
      to: "resource-flavor",
      label: "references",
      sourceHandle: "right",
      targetHandle: "left",
    },
    // ClusterQueue uses AdmissionCheck
    {
      from: "cluster-queue-1",
      to: "admission-check",
      label: "uses",
      sourceHandle: "right",
      targetHandle: "left",
    },
  ],
};
