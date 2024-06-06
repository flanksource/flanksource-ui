import { ConfigRelationships } from "@flanksource-ui/api/types/configs";

export const applicationSetController = [
  {
    id: "51a1fccc-8117-4919-b249-3fb7cd8b6057",
    name: "argo-argocd-applicationset-controller-764547bfd6",
    type: "Kubernetes::ReplicaSet",
    relation_type: "outgoing",
    direction: "outgoing",
    related_ids: ["9580a93f-7b74-437b-836f-9a419252f3dd"],
    depth: 1,
    tags: {
      cluster: "aws",
      namespace: "argo"
    },
    changes: [
      {
        change_type: "SuccessfulDelete",
        severity: "",
        total: 1
      },
      {
        change_type: "diff",
        severity: "",
        total: 4
      }
    ],
    created_at: "2024-05-10T08:34:05+00:00",
    updated_at: "2024-05-13T04:33:47.931132+00:00",
    agent_id: "00000000-0000-0000-0000-000000000000",
    health: "unknown",
    ready: true,
    status: "Scaled to Zero"
  },
  {
    id: "492dd2e3-aee3-45aa-91b1-a12661a6d4a8",
    name: "argo-argocd-applicationset-controller-5cdc847b88",
    type: "Kubernetes::ReplicaSet",
    relation_type: "outgoing",
    direction: "outgoing",
    related_ids: ["9580a93f-7b74-437b-836f-9a419252f3dd"],
    depth: 1,
    tags: {
      cluster: "aws",
      namespace: "argo"
    },
    changes: [
      {
        change_type: "SuccessfulDelete",
        severity: "",
        total: 1
      },
      {
        change_type: "diff",
        severity: "",
        total: 3
      }
    ],

    created_at: "2024-05-13T04:33:34+00:00",
    updated_at: "2024-05-13T23:03:02.640177+00:00",
    agent_id: "00000000-0000-0000-0000-000000000000",
    health: "unknown",
    ready: true,
    status: "Scaled to Zero"
  },
  {
    id: "532fb54a-5325-431a-a618-0617020b1ab2",
    name: "argo-argocd-applicationset-controller-d6667d499",
    type: "Kubernetes::ReplicaSet",
    relation_type: "outgoing",
    direction: "outgoing",
    related_ids: ["9580a93f-7b74-437b-836f-9a419252f3dd"],
    depth: 1,
    tags: {
      cluster: "aws",
      namespace: "argo"
    },

    created_at: "2024-05-14T15:19:57+00:00",
    updated_at: "2024-05-14T15:20:00.574682+00:00",
    agent_id: "00000000-0000-0000-0000-000000000000",
    health: "healthy",
    ready: true,
    status: "Running"
  },
  {
    id: "f5c71026-fcab-4709-ae00-2edcc7e3086a",
    name: "argo",
    type: "Kubernetes::Namespace",
    relation_type: "incoming",
    direction: "incoming",
    related_ids: ["9580a93f-7b74-437b-836f-9a419252f3dd"],
    depth: 1,
    tags: {
      cluster: "aws"
    },

    created_at: "2023-10-19T13:43:09+00:00",
    updated_at: "2024-03-18T14:38:00.361031+00:00",
    agent_id: "00000000-0000-0000-0000-000000000000",
    health: "unknown",
    ready: true,
    status: "Healthy"
  },
  {
    id: "00f3ddcd-2f2a-4b3b-af4a-ba5091bd4501",
    name: "argo-argocd-applicationset-controller-864b6c68",
    type: "Kubernetes::ReplicaSet",
    relation_type: "outgoing",
    direction: "outgoing",
    related_ids: ["9580a93f-7b74-437b-836f-9a419252f3dd"],
    depth: 1,
    tags: {
      cluster: "aws",
      namespace: "argo"
    },
    changes: [
      {
        change_type: "SuccessfulDelete",
        severity: "",
        total: 1
      },
      {
        change_type: "diff",
        severity: "",
        total: 1
      }
    ],

    created_at: "2024-05-13T23:01:17+00:00",
    updated_at: "2024-05-14T15:20:00.763095+00:00",
    agent_id: "00000000-0000-0000-0000-000000000000",
    health: "unknown",
    ready: true,
    status: "Scaled to Zero"
  },
  {
    id: "33616137-3536-6531-6236-633631376130",
    name: "aws",
    type: "Kubernetes::Cluster",
    relation_type: "hard",
    direction: "incoming",
    related_ids: ["f5c71026-fcab-4709-ae00-2edcc7e3086a"],
    depth: 2,
    tags: {
      cluster: "aws"
    },

    created_at: "0001-01-01T00:00:00+00:00",
    updated_at: "2024-05-03T12:51:34.940468+00:00",
    agent_id: "00000000-0000-0000-0000-000000000000",

    ready: false
  },
  {
    id: "b9317816-adbb-462e-9fde-0578b6b8d10f",
    name: "argo-argocd-applicationset-controller-d6667d499-86bck",
    type: "Kubernetes::Pod",
    relation_type: "hard",
    direction: "outgoing",
    related_ids: ["532fb54a-5325-431a-a618-0617020b1ab2"],
    depth: 2,
    tags: {
      cluster: "aws",
      namespace: "argo"
    },
    changes: [
      {
        change_type: "Started",
        severity: "",
        total: 1
      },
      {
        change_type: "Scheduled",
        severity: "",
        total: 1
      }
    ],

    created_at: "2024-05-14T15:19:57+00:00",
    updated_at: "2024-05-14T15:20:00.574682+00:00",
    agent_id: "00000000-0000-0000-0000-000000000000",
    health: "healthy",
    ready: true,
    status: "Running"
  }
] satisfies ConfigRelationships[];

export const applicationSetControllerRootConfig = {
  id: "9580a93f-7b74-437b-836f-9a419252f3dd",
  agent_id: "00000000-0000-0000-0000-000000000000",

  scraper_id: "b8e78065-c9e4-40c8-bcf0-de3a39423092",
  config_class: "Deployment",
  external_id: [
    "9580a93f-7b74-437b-836f-9a419252f3dd",
    "Kubernetes/Deployment/argo/argo-argocd-applicationset-controller"
  ],
  type: "Kubernetes::Deployment",
  name: "argo-argocd-applicationset-controller",
  description: "1 pods ready",
  source: "",
  tags: {
    cluster: "aws",
    namespace: "argo"
  },
  parent_id: "f5c71026-fcab-4709-ae00-2edcc7e3086a",
  path: "33616137-3536-6531-6236-633631376130.f5c71026-fcab-4709-ae00-2edcc7e3086a.9580a93f-7b74-437b-836f-9a419252f3dd",

  created_at: "2023-10-19T13:44:28+00:00",
  updated_at: "2024-05-14T15:20:00.752425+00:00",

  status: "Running",
  delete_reason: "",

  is_pushed: true,
  last_scraped_time: "2024-05-15T07:55:27.208541+00:00",
  labels: {
    cluster: "aws",
    namespace: "argo",
    apiVersion: "apps/v1",
    "helm.sh/chart": "argo-cd-6.9.2",
    "app.kubernetes.io/name": "argocd-applicationset-controller",
    "app.kubernetes.io/part-of": "argocd",
    "app.kubernetes.io/version": "v2.11.0",
    "app.kubernetes.io/instance": "argo",
    "app.kubernetes.io/component": "applicationset-controller",
    "helm.toolkit.fluxcd.io/name": "argo",
    "app.kubernetes.io/managed-by": "Helm",
    "helm.toolkit.fluxcd.io/namespace": "argo"
  },
  health: "healthy",
  ready: true,
  summary: {
    relationships: 18,
    analysis: 0,
    changes: 0,
    playbook_runs: 0
  },
  config_scrapers: {
    id: "b8e78065-c9e4-40c8-bcf0-de3a39423092",
    name: "mission-control/kubernetes"
  }
};
