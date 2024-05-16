import { ConfigRelationships } from "@flanksource-ui/api/types/configs";

export const argoArgocdNotificationsController = [
  {
    id: "26a39243-80b7-4b82-941b-1ce15758b292",
    name: "argo-argocd-notifications-controller-5b445ddccf",
    type: "Kubernetes::ReplicaSet",
    relation_type: "outgoing",
    direction: "outgoing",
    related_id: "b59c1752-1be4-4a51-9f84-8225ebe7c136",
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

    created_at: "2024-05-13T23:01:18+00:00",
    updated_at: "2024-05-14T15:20:00.887554+00:00",
    agent_id: "00000000-0000-0000-0000-000000000000",
    health: "unknown",
    ready: true,
    status: "Scaled to Zero"
  },
  {
    id: "92c4c176-6570-4a5d-bdcd-b2dbc7c9a26c",
    name: "argo-argocd-notifications-controller-777f7984cd",
    type: "Kubernetes::ReplicaSet",
    relation_type: "outgoing",
    direction: "outgoing",
    related_id: "b59c1752-1be4-4a51-9f84-8225ebe7c136",
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

    created_at: "2024-05-13T04:33:35+00:00",
    updated_at: "2024-05-13T23:03:02.661845+00:00",
    agent_id: "00000000-0000-0000-0000-000000000000",
    health: "unknown",
    ready: true,
    status: "Scaled to Zero"
  },
  {
    id: "a15f91b1-dbee-4884-89af-9cd5370c2644",
    name: "argo-argocd-notifications-controller-5f47765dfd",
    type: "Kubernetes::ReplicaSet",
    relation_type: "outgoing",
    direction: "outgoing",
    related_id: "b59c1752-1be4-4a51-9f84-8225ebe7c136",
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

    created_at: "2024-05-10T08:34:06+00:00",
    updated_at: "2024-05-13T04:33:46.653767+00:00",
    agent_id: "00000000-0000-0000-0000-000000000000",
    health: "unknown",
    ready: true,
    status: "Scaled to Zero"
  },
  {
    id: "f5c71026-fcab-4709-ae00-2edcc7e3086a",
    name: "argo",
    type: "Kubernetes::Namespace",
    relation_type: "incoming",
    direction: "incoming",
    related_id: "b59c1752-1be4-4a51-9f84-8225ebe7c136",
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
    id: "301902be-86af-4791-95fe-3f432c190276",
    name: "argo-argocd-notifications-controller-54747746f8",
    type: "Kubernetes::ReplicaSet",
    relation_type: "outgoing",
    direction: "outgoing",
    related_id: "b59c1752-1be4-4a51-9f84-8225ebe7c136",
    depth: 1,
    tags: {
      cluster: "aws",
      namespace: "argo"
    },
    changes: [
      {
        change_type: "diff",
        severity: "",
        total: 1
      }
    ],

    created_at: "2024-05-14T15:19:58+00:00",
    updated_at: "2024-05-14T15:20:15.358938+00:00",
    agent_id: "00000000-0000-0000-0000-000000000000",
    health: "healthy",
    ready: true,
    status: "Running"
  },
  {
    id: "8cc44af9-61f5-452f-94c9-ab33d8cb470c",
    name: "argo-argocd-notifications-controller-54747746f8-k966m",
    type: "Kubernetes::Pod",
    relation_type: "hard",
    direction: "outgoing",
    related_id: "301902be-86af-4791-95fe-3f432c190276",
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
        change_type: "diff",
        severity: "",
        total: 1
      },
      {
        change_type: "Scheduled",
        severity: "",
        total: 1
      }
    ],

    created_at: "2024-05-14T15:19:58+00:00",
    updated_at: "2024-05-14T15:20:15.371623+00:00",
    agent_id: "00000000-0000-0000-0000-000000000000",
    health: "healthy",
    ready: true,
    status: "Running"
  },
  {
    id: "33616137-3536-6531-6236-633631376130",
    name: "aws",
    type: "Kubernetes::Cluster",
    relation_type: "hard",
    direction: "incoming",
    related_id: "f5c71026-fcab-4709-ae00-2edcc7e3086a",
    depth: 2,
    tags: {
      cluster: "aws"
    },

    created_at: "0001-01-01T00:00:00+00:00",
    updated_at: "2024-05-03T12:51:34.940468+00:00",
    agent_id: "00000000-0000-0000-0000-000000000000",
    ready: false
  }
] satisfies ConfigRelationships[];

export const argoArgocdNotificationsControllerRoot = {
  id: "b59c1752-1be4-4a51-9f84-8225ebe7c136",
  agent_id: "00000000-0000-0000-0000-000000000000",

  scraper_id: "b8e78065-c9e4-40c8-bcf0-de3a39423092",
  config_class: "Deployment",
  external_id: [
    "b59c1752-1be4-4a51-9f84-8225ebe7c136",
    "Kubernetes/Deployment/argo/argo-argocd-notifications-controller"
  ],
  type: "Kubernetes::Deployment",

  name: "argo-argocd-notifications-controller",
  description: "1 pods ready",
  source: "",
  tags: {
    cluster: "aws",
    namespace: "argo"
  },
  parent_id: "f5c71026-fcab-4709-ae00-2edcc7e3086a",
  path: "33616137-3536-6531-6236-633631376130.f5c71026-fcab-4709-ae00-2edcc7e3086a.b59c1752-1be4-4a51-9f84-8225ebe7c136",

  created_at: "2023-10-19T13:44:28+00:00",
  updated_at: "2024-05-14T15:20:15.364451+00:00",

  status: "Running",
  delete_reason: "",

  is_pushed: true,
  last_scraped_time: "2024-05-15T07:55:27.229128+00:00",
  labels: {
    cluster: "aws",
    namespace: "argo",
    apiVersion: "apps/v1",
    "helm.sh/chart": "argo-cd-6.9.2",
    "app.kubernetes.io/name": "argocd-notifications-controller",
    "app.kubernetes.io/part-of": "argocd",
    "app.kubernetes.io/version": "v2.11.0",
    "app.kubernetes.io/instance": "argo",
    "app.kubernetes.io/component": "notifications-controller",
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
