import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Types
interface CRDData {
  name: string;
  shortName: string;
  category: string;
  description: string;
  example: string;
  keyFields: string[];
  useCases: string[];
  docsUrl: string;
}

interface NodeData extends CRDData {
  position: THREE.Vector3;
  color: number;
}

// Category colors
const CATEGORY_COLORS: Record<string, number> = {
  'Configuration': 0x4CAF50,      // Green
  'Network': 0x2196F3,            // Blue
  'Resource Management': 0xFF9800, // Orange
  'Workloads': 0x9C27B0,          // Purple
  'Storage': 0x00BCD4,            // Cyan
  'Security': 0xF44336,           // Red
};

// Kubernetes CRD Data
const K8S_CRDS: CRDData[] = [
  // Configuration
  {
    name: 'ConfigMap',
    shortName: 'CM',
    category: 'Configuration',
    description: 'ConfigMaps allow you to decouple configuration artifacts from image content to keep containerized applications portable. They store non-confidential data in key-value pairs.',
    example: `apiVersion: v1
kind: ConfigMap
metadata:
  name: game-config
data:
  player_initial_lives: "3"
  ui_properties_file_name: "user-interface.properties"
  game.properties: |
    enemy.types=aliens,monsters
    player.maximum-lives=5`,
    keyFields: ['data', 'binaryData', 'immutable'],
    useCases: [
      'Store application configuration',
      'Environment-specific settings',
      'Feature flags',
      'External service URLs'
    ],
    docsUrl: 'https://kubernetes.io/docs/concepts/configuration/configmap/'
  },
  {
    name: 'Secret',
    shortName: 'Secret',
    category: 'Configuration',
    description: 'Secrets let you store and manage sensitive information such as passwords, OAuth tokens, and SSH keys. Using Secrets is safer than putting confidential data in a Pod definition or container image.',
    example: `apiVersion: v1
kind: Secret
metadata:
  name: db-credentials
type: Opaque
data:
  username: YWRtaW4=
  password: cGFzc3dvcmQxMjM=`,
    keyFields: ['type', 'data', 'stringData', 'immutable'],
    useCases: [
      'Database credentials',
      'API keys and tokens',
      'TLS certificates',
      'SSH keys'
    ],
    docsUrl: 'https://kubernetes.io/docs/concepts/configuration/secret/'
  },
  // Network
  {
    name: 'Service',
    shortName: 'SVC',
    category: 'Network',
    description: 'A Service is an abstraction that defines a logical set of Pods and a policy by which to access them. Services enable network access to a set of Pods, providing load balancing and service discovery.',
    example: `apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app: MyApp
  ports:
    - protocol: TCP
      port: 80
      targetPort: 9376
  type: ClusterIP`,
    keyFields: ['spec.selector', 'spec.ports', 'spec.type', 'spec.clusterIP'],
    useCases: [
      'Internal service discovery',
      'Load balancing across pods',
      'Exposing applications externally',
      'Headless services for StatefulSets'
    ],
    docsUrl: 'https://kubernetes.io/docs/concepts/services-networking/service/'
  },
  {
    name: 'Ingress',
    shortName: 'ING',
    category: 'Network',
    description: 'Ingress exposes HTTP and HTTPS routes from outside the cluster to services within the cluster. Traffic routing is controlled by rules defined on the Ingress resource.',
    example: `apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: minimal-ingress
spec:
  ingressClassName: nginx
  rules:
  - host: myapp.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: my-service
            port:
              number: 80`,
    keyFields: ['spec.rules', 'spec.tls', 'spec.ingressClassName'],
    useCases: [
      'HTTP/HTTPS routing',
      'SSL/TLS termination',
      'Name-based virtual hosting',
      'Path-based routing'
    ],
    docsUrl: 'https://kubernetes.io/docs/concepts/services-networking/ingress/'
  },
  {
    name: 'NetworkPolicy',
    shortName: 'NP',
    category: 'Network',
    description: 'NetworkPolicies are used to control traffic flow at the IP address or port level. They allow you to specify how a pod is allowed to communicate with various network entities.',
    example: `apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: deny-all-ingress
spec:
  podSelector: {}
  policyTypes:
  - Ingress`,
    keyFields: ['spec.podSelector', 'spec.ingress', 'spec.egress', 'spec.policyTypes'],
    useCases: [
      'Isolate namespaces',
      'Restrict pod-to-pod communication',
      'Allow specific ingress/egress',
      'Implement zero-trust networking'
    ],
    docsUrl: 'https://kubernetes.io/docs/concepts/services-networking/network-policies/'
  },
  // Resource Management
  {
    name: 'ResourceQuota',
    shortName: 'RQ',
    category: 'Resource Management',
    description: 'ResourceQuota provides constraints that limit aggregate resource consumption per namespace. It can limit the quantity of objects created and the total amount of compute resources.',
    example: `apiVersion: v1
kind: ResourceQuota
metadata:
  name: compute-quota
spec:
  hard:
    requests.cpu: "4"
    requests.memory: 8Gi
    limits.cpu: "8"
    limits.memory: 16Gi
    pods: "10"`,
    keyFields: ['spec.hard', 'spec.scopeSelector', 'spec.scopes'],
    useCases: [
      'Limit namespace resource usage',
      'Prevent resource exhaustion',
      'Multi-tenant clusters',
      'Cost management'
    ],
    docsUrl: 'https://kubernetes.io/docs/concepts/policy/resource-quotas/'
  },
  {
    name: 'LimitRange',
    shortName: 'LR',
    category: 'Resource Management',
    description: 'LimitRange is a policy to constrain resource allocations for each applicable object kind in a namespace. It can set default, min, and max resource requirements.',
    example: `apiVersion: v1
kind: LimitRange
metadata:
  name: cpu-memory-limits
spec:
  limits:
  - default:
      cpu: 500m
      memory: 512Mi
    defaultRequest:
      cpu: 100m
      memory: 256Mi
    type: Container`,
    keyFields: ['spec.limits', 'spec.limits[].type', 'spec.limits[].default'],
    useCases: [
      'Set default resource requests',
      'Enforce minimum/maximum limits',
      'Prevent resource-less pods',
      'Standardize resource allocation'
    ],
    docsUrl: 'https://kubernetes.io/docs/concepts/policy/limit-range/'
  },
  // Workloads
  {
    name: 'Deployment',
    shortName: 'Deploy',
    category: 'Workloads',
    description: 'A Deployment provides declarative updates for Pods and ReplicaSets. You describe a desired state and the Deployment Controller changes the actual state to match.',
    example: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.21
        ports:
        - containerPort: 80`,
    keyFields: ['spec.replicas', 'spec.selector', 'spec.template', 'spec.strategy'],
    useCases: [
      'Stateless applications',
      'Rolling updates',
      'Rollback deployments',
      'Scale applications'
    ],
    docsUrl: 'https://kubernetes.io/docs/concepts/workloads/controllers/deployment/'
  },
  {
    name: 'ReplicaSet',
    shortName: 'RS',
    category: 'Workloads',
    description: 'ReplicaSet ensures that a specified number of pod replicas are running at any given time. It is often used indirectly through Deployments.',
    example: `apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: frontend
spec:
  replicas: 3
  selector:
    matchLabels:
      tier: frontend
  template:
    metadata:
      labels:
        tier: frontend
    spec:
      containers:
      - name: php-redis
        image: gcr.io/google_samples/gb-frontend:v3`,
    keyFields: ['spec.replicas', 'spec.selector', 'spec.template'],
    useCases: [
      'Maintain pod count',
      'Self-healing pods',
      'Used by Deployments internally',
      'Direct use for specific scenarios'
    ],
    docsUrl: 'https://kubernetes.io/docs/concepts/workloads/controllers/replicaset/'
  },
  {
    name: 'StatefulSet',
    shortName: 'STS',
    category: 'Workloads',
    description: 'StatefulSet manages stateful applications with guarantees about ordering and uniqueness of Pods. Each Pod has a persistent identifier maintained across rescheduling.',
    example: `apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: web
spec:
  serviceName: "nginx"
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx
        volumeMounts:
        - name: www
          mountPath: /usr/share/nginx/html
  volumeClaimTemplates:
  - metadata:
      name: www
    spec:
      accessModes: [ "ReadWriteOnce" ]
      resources:
        requests:
          storage: 1Gi`,
    keyFields: ['spec.serviceName', 'spec.volumeClaimTemplates', 'spec.podManagementPolicy'],
    useCases: [
      'Databases (MySQL, PostgreSQL)',
      'Distributed systems (Kafka, ZooKeeper)',
      'Applications requiring stable network IDs',
      'Ordered deployment and scaling'
    ],
    docsUrl: 'https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/'
  },
  {
    name: 'HorizontalPodAutoscaler',
    shortName: 'HPA',
    category: 'Workloads',
    description: 'HPA automatically scales the number of Pods in a workload resource based on observed CPU utilization or custom metrics.',
    example: `apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: php-apache
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: php-apache
  minReplicas: 1
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 50`,
    keyFields: ['spec.scaleTargetRef', 'spec.minReplicas', 'spec.maxReplicas', 'spec.metrics'],
    useCases: [
      'Auto-scale based on CPU/memory',
      'Handle traffic spikes',
      'Cost optimization',
      'Custom metrics scaling'
    ],
    docsUrl: 'https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/'
  },
  // Storage
  {
    name: 'PersistentVolume',
    shortName: 'PV',
    category: 'Storage',
    description: 'A PersistentVolume (PV) is a piece of storage in the cluster that has been provisioned by an administrator or dynamically provisioned using Storage Classes.',
    example: `apiVersion: v1
kind: PersistentVolume
metadata:
  name: pv-volume
spec:
  capacity:
    storage: 10Gi
  accessModes:
    - ReadWriteOnce
  persistentVolumeReclaimPolicy: Retain
  storageClassName: manual
  hostPath:
    path: "/mnt/data"`,
    keyFields: ['spec.capacity', 'spec.accessModes', 'spec.storageClassName', 'spec.persistentVolumeReclaimPolicy'],
    useCases: [
      'Provision cluster storage',
      'Database storage',
      'Shared file systems',
      'Static provisioning'
    ],
    docsUrl: 'https://kubernetes.io/docs/concepts/storage/persistent-volumes/'
  },
  {
    name: 'PersistentVolumeClaim',
    shortName: 'PVC',
    category: 'Storage',
    description: 'A PersistentVolumeClaim (PVC) is a request for storage by a user. It is similar to a Pod requesting compute resources.',
    example: `apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: pvc-claim
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 3Gi
  storageClassName: standard`,
    keyFields: ['spec.accessModes', 'spec.resources', 'spec.storageClassName', 'spec.volumeName'],
    useCases: [
      'Request storage for pods',
      'Dynamic volume provisioning',
      'Bind to specific PVs',
      'Storage class selection'
    ],
    docsUrl: 'https://kubernetes.io/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims'
  },
  {
    name: 'StorageClass',
    shortName: 'SC',
    category: 'Storage',
    description: 'StorageClass provides a way for administrators to describe different classes of storage. Different classes might map to quality-of-service levels, backup policies, or arbitrary policies.',
    example: `apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: fast
provisioner: kubernetes.io/gce-pd
parameters:
  type: pd-ssd
reclaimPolicy: Retain
allowVolumeExpansion: true`,
    keyFields: ['provisioner', 'parameters', 'reclaimPolicy', 'allowVolumeExpansion'],
    useCases: [
      'Define storage tiers (fast, slow)',
      'Cloud provider integration',
      'Dynamic provisioning',
      'Volume encryption settings'
    ],
    docsUrl: 'https://kubernetes.io/docs/concepts/storage/storage-classes/'
  },
  // Security
  {
    name: 'ServiceAccount',
    shortName: 'SA',
    category: 'Security',
    description: 'A ServiceAccount provides an identity for processes that run in a Pod. When you authenticate to the API server, you identify yourself as a particular ServiceAccount.',
    example: `apiVersion: v1
kind: ServiceAccount
metadata:
  name: my-service-account
automountServiceAccountToken: false`,
    keyFields: ['automountServiceAccountToken', 'secrets', 'imagePullSecrets'],
    useCases: [
      'Pod identity',
      'RBAC authentication',
      'Workload identity (GKE/EKS)',
      'API server access'
    ],
    docsUrl: 'https://kubernetes.io/docs/concepts/security/service-accounts/'
  },
  {
    name: 'Role',
    shortName: 'Role',
    category: 'Security',
    description: 'A Role contains rules that represent a set of permissions within a particular namespace. Roles can only grant access to resources within a single namespace.',
    example: `apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: default
  name: pod-reader
rules:
- apiGroups: [""]
  resources: ["pods"]
  verbs: ["get", "watch", "list"]`,
    keyFields: ['rules', 'rules[].apiGroups', 'rules[].resources', 'rules[].verbs'],
    useCases: [
      'Namespace-scoped permissions',
      'Read-only access to resources',
      'Developer access',
      'CI/CD pipeline permissions'
    ],
    docsUrl: 'https://kubernetes.io/docs/reference/access-authn-authz/rbac/'
  },
  {
    name: 'ClusterRole',
    shortName: 'CR',
    category: 'Security',
    description: 'ClusterRole is similar to Role but is cluster-scoped. It can grant access to cluster-scoped resources like nodes, or to namespaced resources across all namespaces.',
    example: `apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: secret-reader
rules:
- apiGroups: [""]
  resources: ["secrets"]
  verbs: ["get", "watch", "list"]`,
    keyFields: ['rules', 'aggregationRule'],
    useCases: [
      'Cluster-wide permissions',
      'Access to non-namespaced resources',
      'Aggregated ClusterRoles',
      'Admin access patterns'
    ],
    docsUrl: 'https://kubernetes.io/docs/reference/access-authn-authz/rbac/#role-and-clusterrole'
  },
  {
    name: 'RoleBinding',
    shortName: 'RB',
    category: 'Security',
    description: 'RoleBinding grants permissions defined in a Role to a user or set of users within a specific namespace.',
    example: `apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: read-pods
  namespace: default
subjects:
- kind: User
  name: jane
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: Role
  name: pod-reader
  apiGroup: rbac.authorization.k8s.io`,
    keyFields: ['subjects', 'roleRef'],
    useCases: [
      'Bind roles to users',
      'Bind roles to service accounts',
      'Grant namespace access',
      'Team-based permissions'
    ],
    docsUrl: 'https://kubernetes.io/docs/reference/access-authn-authz/rbac/#rolebinding-and-clusterrolebinding'
  },
  {
    name: 'ClusterRoleBinding',
    shortName: 'CRB',
    category: 'Security',
    description: 'ClusterRoleBinding grants permissions cluster-wide, binding a ClusterRole to users across all namespaces.',
    example: `apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: read-secrets-global
subjects:
- kind: Group
  name: manager
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: ClusterRole
  name: secret-reader
  apiGroup: rbac.authorization.k8s.io`,
    keyFields: ['subjects', 'roleRef'],
    useCases: [
      'Cluster-wide access grants',
      'Admin user bindings',
      'Service account cluster access',
      'Cross-namespace permissions'
    ],
    docsUrl: 'https://kubernetes.io/docs/reference/access-authn-authz/rbac/#rolebinding-and-clusterrolebinding'
  },
];

// Scene setup
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let controls: OrbitControls;
let nodes: THREE.Mesh[] = [];
let nodeDataMap = new Map<THREE.Mesh, NodeData>();
let raycaster: THREE.Raycaster;
let mouse: THREE.Vector2;
let hoveredNode: THREE.Mesh | null = null;
let selectedNode: THREE.Mesh | null = null;

// DOM elements
let tooltip: HTMLDivElement;
let infoPanel: HTMLDivElement;

function init() {
  // Create app container
  const app = document.querySelector<HTMLDivElement>('#app')!;

  // Scene
  scene = new THREE.Scene();

  // Camera
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 5, 20);

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  app.appendChild(renderer.domElement);

  // Controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.maxDistance = 50;
  controls.minDistance = 5;

  // Raycaster for mouse interaction
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(10, 20, 10);
  scene.add(directionalLight);

  const pointLight = new THREE.PointLight(0x646cff, 1, 50);
  pointLight.position.set(0, 10, 0);
  scene.add(pointLight);

  // Create nodes
  createNodes();

  // Create connections
  createConnections();

  // Create UI
  createUI(app);

  // Event listeners
  window.addEventListener('resize', onWindowResize);
  renderer.domElement.addEventListener('mousemove', onMouseMove);
  renderer.domElement.addEventListener('click', onClick);

  // Animation loop
  animate();
}

function createNodes() {
  const categories = [...new Set(K8S_CRDS.map(crd => crd.category))];
  const categoryPositions: Record<string, { center: THREE.Vector3, radius: number }> = {
    'Configuration': { center: new THREE.Vector3(-8, 4, 0), radius: 3 },
    'Network': { center: new THREE.Vector3(0, 6, 0), radius: 4 },
    'Resource Management': { center: new THREE.Vector3(8, 4, 0), radius: 3 },
    'Workloads': { center: new THREE.Vector3(-6, -2, 0), radius: 5 },
    'Storage': { center: new THREE.Vector3(6, -2, 0), radius: 4 },
    'Security': { center: new THREE.Vector3(0, -6, 0), radius: 5 },
  };

  // Create category labels (as 3D planes with text)
  categories.forEach(category => {
    const pos = categoryPositions[category];
    if (pos) {
      createCategoryLabel(category, pos.center.clone().add(new THREE.Vector3(0, pos.radius + 1.5, 0)));
    }
  });

  // Create nodes for each CRD
  K8S_CRDS.forEach((crd) => {
    const categoryConfig = categoryPositions[crd.category];
    if (!categoryConfig) return;

    // Calculate position within category cluster
    const crdsInCategory = K8S_CRDS.filter(c => c.category === crd.category);
    const indexInCategory = crdsInCategory.indexOf(crd);
    const angle = (indexInCategory / crdsInCategory.length) * Math.PI * 2;
    const radius = categoryConfig.radius * 0.7;

    const position = new THREE.Vector3(
      categoryConfig.center.x + Math.cos(angle) * radius,
      categoryConfig.center.y + Math.sin(angle) * radius * 0.5,
      Math.sin(angle) * 2 + (Math.random() - 0.5) * 2
    );

    const color = CATEGORY_COLORS[crd.category] || 0xffffff;

    // Create sphere
    const geometry = new THREE.SphereGeometry(0.6, 32, 32);
    const material = new THREE.MeshPhongMaterial({
      color: color,
      emissive: color,
      emissiveIntensity: 0.2,
      shininess: 100,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(position);

    // Store data
    const nodeData: NodeData = {
      ...crd,
      position,
      color,
    };
    nodeDataMap.set(mesh, nodeData);

    // Add glow effect
    const glowGeometry = new THREE.SphereGeometry(0.8, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.15,
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    mesh.add(glow);

    scene.add(mesh);
    nodes.push(mesh);

    // Create label
    createNodeLabel(crd.shortName, position, color);
  });
}

function createNodeLabel(text: string, position: THREE.Vector3, _color: number) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d')!;
  canvas.width = 256;
  canvas.height = 64;

  context.fillStyle = 'transparent';
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.font = 'bold 28px Arial';
  context.textAlign = 'center';
  context.fillStyle = '#ffffff';
  context.fillText(text, canvas.width / 2, canvas.height / 2 + 10);

  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthTest: false,
  });
  const sprite = new THREE.Sprite(material);
  sprite.position.copy(position);
  sprite.position.y -= 1.2;
  sprite.scale.set(2, 0.5, 1);
  scene.add(sprite);
}

function createCategoryLabel(text: string, position: THREE.Vector3) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d')!;
  canvas.width = 512;
  canvas.height = 64;

  context.fillStyle = 'transparent';
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.font = 'bold 32px Arial';
  context.textAlign = 'center';
  context.fillStyle = 'rgba(255, 255, 255, 0.6)';
  context.fillText(text.toUpperCase(), canvas.width / 2, canvas.height / 2 + 10);

  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthTest: false,
  });
  const sprite = new THREE.Sprite(material);
  sprite.position.copy(position);
  sprite.scale.set(6, 0.75, 1);
  scene.add(sprite);
}

function createConnections() {
  // Define relationships between CRDs
  const connections: [string, string][] = [
    ['Deployment', 'ReplicaSet'],
    ['ReplicaSet', 'HorizontalPodAutoscaler'],
    ['Deployment', 'HorizontalPodAutoscaler'],
    ['StatefulSet', 'PersistentVolumeClaim'],
    ['PersistentVolumeClaim', 'PersistentVolume'],
    ['PersistentVolume', 'StorageClass'],
    ['Service', 'Ingress'],
    ['Service', 'NetworkPolicy'],
    ['ServiceAccount', 'Role'],
    ['ServiceAccount', 'ClusterRole'],
    ['Role', 'RoleBinding'],
    ['ClusterRole', 'ClusterRoleBinding'],
    ['Deployment', 'ConfigMap'],
    ['Deployment', 'Secret'],
    ['StatefulSet', 'ConfigMap'],
    ['StatefulSet', 'Secret'],
  ];

  connections.forEach(([from, to]) => {
    const fromNode = nodes.find(n => nodeDataMap.get(n)?.name === from);
    const toNode = nodes.find(n => nodeDataMap.get(n)?.name === to);

    if (fromNode && toNode) {
      const points = [fromNode.position, toNode.position];
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({
        color: 0x646cff,
        transparent: true,
        opacity: 0.3,
      });
      const line = new THREE.Line(geometry, material);
      scene.add(line);
    }
  });
}

function createUI(container: HTMLElement) {
  // Header
  const header = document.createElement('div');
  header.className = 'header';
  header.innerHTML = `
    <h1>Kubernetes CRD Explorer</h1>
    <p>Interactive 3D visualization of Kubernetes Custom Resource Definitions</p>
  `;
  container.appendChild(header);

  // Navigation tabs
  const navTabs = document.createElement('div');
  navTabs.className = 'nav-tabs';
  navTabs.innerHTML = `
    <button class="nav-tab active">Kubernetes</button>
    <button class="nav-tab">Kueue</button>
    <button class="nav-tab">KEDA</button>
    <button class="nav-tab">GCP</button>
    <button class="nav-tab">AWS</button>
  `;
  container.appendChild(navTabs);

  // Legend
  const legend = document.createElement('div');
  legend.className = 'legend';
  legend.innerHTML = `
    <h4>Categories</h4>
    ${Object.entries(CATEGORY_COLORS).map(([name, color]) => `
      <div class="legend-item" data-category="${name}">
        <div class="legend-color" style="background: #${color.toString(16).padStart(6, '0')}"></div>
        <span>${name}</span>
      </div>
    `).join('')}
  `;
  container.appendChild(legend);

  // Tooltip
  tooltip = document.createElement('div');
  tooltip.className = 'tooltip';
  container.appendChild(tooltip);

  // Info Panel
  infoPanel = document.createElement('div');
  infoPanel.className = 'info-panel';
  container.appendChild(infoPanel);

  // Instructions
  const instructions = document.createElement('div');
  instructions.className = 'instructions';
  instructions.innerHTML = `
    <p>Drag to rotate | Scroll to zoom</p>
    <p>Click a node for details</p>
  `;
  container.appendChild(instructions);

  // Legend click handlers
  legend.querySelectorAll('.legend-item').forEach(item => {
    item.addEventListener('click', () => {
      const category = item.getAttribute('data-category');
      focusCategory(category!);
    });
  });
}

function focusCategory(category: string) {
  const categoryNodes = nodes.filter(n => nodeDataMap.get(n)?.category === category);
  if (categoryNodes.length === 0) return;

  // Calculate center of category
  const center = new THREE.Vector3();
  categoryNodes.forEach(node => center.add(node.position));
  center.divideScalar(categoryNodes.length);

  // Animate camera to focus on category
  const targetPosition = center.clone().add(new THREE.Vector3(0, 2, 10));
  animateCamera(targetPosition, center);
}

function animateCamera(targetPosition: THREE.Vector3, lookAt: THREE.Vector3) {
  const startPosition = camera.position.clone();
  const startTarget = controls.target.clone();
  const duration = 1000;
  const startTime = Date.now();

  function update() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeOutCubic(progress);

    camera.position.lerpVectors(startPosition, targetPosition, eased);
    controls.target.lerpVectors(startTarget, lookAt, eased);

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  update();
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function showInfoPanel(data: NodeData) {
  infoPanel.innerHTML = `
    <button class="info-panel-close">&times;</button>
    <h2>${data.name}</h2>
    <span class="category-badge">${data.category}</span>
    <p class="description">${data.description}</p>

    <h3>Example YAML</h3>
    <pre><code>${escapeHtml(data.example)}</code></pre>

    <h3>Key Fields</h3>
    <ul>
      ${data.keyFields.map(field => `<li><code>${field}</code></li>`).join('')}
    </ul>

    <h3>Common Use Cases</h3>
    <ul>
      ${data.useCases.map(useCase => `<li>${useCase}</li>`).join('')}
    </ul>

    <div class="links">
      <a href="${data.docsUrl}" target="_blank" class="link-btn">Official Docs</a>
    </div>
  `;

  infoPanel.classList.add('visible');

  // Close button handler
  infoPanel.querySelector('.info-panel-close')?.addEventListener('click', () => {
    infoPanel.classList.remove('visible');
    if (selectedNode) {
      resetNodeHighlight(selectedNode);
      selectedNode = null;
    }
  });
}

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function highlightNode(mesh: THREE.Mesh) {
  const material = mesh.material as THREE.MeshPhongMaterial;
  material.emissiveIntensity = 0.5;
  mesh.scale.setScalar(1.2);
}

function resetNodeHighlight(mesh: THREE.Mesh) {
  const material = mesh.material as THREE.MeshPhongMaterial;
  material.emissiveIntensity = 0.2;
  mesh.scale.setScalar(1);
}

function onMouseMove(event: MouseEvent) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(nodes);

  if (intersects.length > 0) {
    const node = intersects[0].object as THREE.Mesh;

    if (hoveredNode !== node) {
      if (hoveredNode && hoveredNode !== selectedNode) {
        resetNodeHighlight(hoveredNode);
      }

      hoveredNode = node;
      if (node !== selectedNode) {
        highlightNode(node);
      }

      const data = nodeDataMap.get(node);
      if (data) {
        tooltip.textContent = data.name;
        tooltip.classList.add('visible');
      }
    }

    tooltip.style.left = event.clientX + 15 + 'px';
    tooltip.style.top = event.clientY + 15 + 'px';
    renderer.domElement.style.cursor = 'pointer';
  } else {
    if (hoveredNode && hoveredNode !== selectedNode) {
      resetNodeHighlight(hoveredNode);
    }
    hoveredNode = null;
    tooltip.classList.remove('visible');
    renderer.domElement.style.cursor = 'grab';
  }
}

function onClick(_event: MouseEvent) {
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(nodes);

  if (intersects.length > 0) {
    const node = intersects[0].object as THREE.Mesh;

    // Reset previous selection
    if (selectedNode && selectedNode !== node) {
      resetNodeHighlight(selectedNode);
    }

    selectedNode = node;
    highlightNode(node);

    const data = nodeDataMap.get(node);
    if (data) {
      showInfoPanel(data);

      // Focus camera on selected node
      const targetPosition = node.position.clone().add(new THREE.Vector3(0, 2, 8));
      animateCamera(targetPosition, node.position);
    }
  }
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);

  // Gentle floating animation for nodes
  const time = Date.now() * 0.001;
  nodes.forEach((node, i) => {
    const data = nodeDataMap.get(node);
    if (data) {
      node.position.y = data.position.y + Math.sin(time + i * 0.5) * 0.1;
    }
  });

  controls.update();
  renderer.render(scene, camera);
}

// Initialize
init();
