import type { CRDData } from '../../types';

export const CRDS: CRDData[] = [
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
    docsUrl: 'https://kubernetes.io/docs/concepts/configuration/configmap/',
    icon: '/icons/k8s/cm.svg'
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
    docsUrl: 'https://kubernetes.io/docs/concepts/configuration/secret/',
    icon: '/icons/k8s/secret.svg'
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
    docsUrl: 'https://kubernetes.io/docs/concepts/services-networking/service/',
    icon: '/icons/k8s/svc.svg'
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
    docsUrl: 'https://kubernetes.io/docs/concepts/services-networking/ingress/',
    icon: '/icons/k8s/ing.svg'
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
    docsUrl: 'https://kubernetes.io/docs/concepts/services-networking/network-policies/',
    icon: '/icons/k8s/netpol.svg'
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
    docsUrl: 'https://kubernetes.io/docs/concepts/policy/resource-quotas/',
    icon: '/icons/k8s/quota.svg'
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
    docsUrl: 'https://kubernetes.io/docs/concepts/policy/limit-range/',
    icon: '/icons/k8s/limits.svg'
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
    docsUrl: 'https://kubernetes.io/docs/concepts/workloads/controllers/deployment/',
    icon: '/icons/k8s/deploy.svg'
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
    docsUrl: 'https://kubernetes.io/docs/concepts/workloads/controllers/replicaset/',
    icon: '/icons/k8s/rs.svg'
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
    docsUrl: 'https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/',
    icon: '/icons/k8s/sts.svg'
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
    docsUrl: 'https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/',
    icon: '/icons/k8s/hpa.svg'
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
    docsUrl: 'https://kubernetes.io/docs/concepts/storage/persistent-volumes/',
    icon: '/icons/k8s/pv.svg'
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
    docsUrl: 'https://kubernetes.io/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims',
    icon: '/icons/k8s/pvc.svg'
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
    docsUrl: 'https://kubernetes.io/docs/concepts/storage/storage-classes/',
    icon: '/icons/k8s/sc.svg'
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
    docsUrl: 'https://kubernetes.io/docs/concepts/security/service-accounts/',
    icon: '/icons/k8s/sa.svg'
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
    docsUrl: 'https://kubernetes.io/docs/reference/access-authn-authz/rbac/',
    icon: '/icons/k8s/role.svg'
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
    docsUrl: 'https://kubernetes.io/docs/reference/access-authn-authz/rbac/#role-and-clusterrole',
    icon: '/icons/k8s/c-role.svg'
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
    docsUrl: 'https://kubernetes.io/docs/reference/access-authn-authz/rbac/#rolebinding-and-clusterrolebinding',
    icon: '/icons/k8s/rb.svg'
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
    docsUrl: 'https://kubernetes.io/docs/reference/access-authn-authz/rbac/#rolebinding-and-clusterrolebinding',
    icon: '/icons/k8s/crb.svg'
  },
];
