export const argoArgocdNotificationsController = [
  {
    id: "a9e6a345-9d6e-4ef5-83bc-bcaa71eb382c",
    name: "argo-argocd-notifications-controller-5b67c7675b-4gqpm",
    type: "Kubernetes::Pod",
    related_ids: null
  },
  {
    id: "3e3a9f54-ffdd-4151-baec-8a6cd7e44867",
    name: "aws-demo-bootstrap",
    type: "Kubernetes::Kustomization",
    related_ids: [
      "3e3a9f54-ffdd-4151-baec-8a6cd7e44867",
      "8aa17279-ead2-4923-9205-e365c0372cf5",
      "962f999c-a9bd-40a4-80bf-47c84b1ad750",
      "9a87e262-0b5a-4bea-8908-606fc1a1bb5d"
    ]
  },
  {
    id: "60023763-40ea-498d-ad95-6cf4c8c31e31",
    name: "argo",
    type: "Kubernetes::HelmRelease",
    related_ids: ["b59c1752-1be4-4a51-9f84-8225ebe7c136"]
  },
  {
    id: "fe2430b0-bc23-477b-ac02-c252f8ca05e8",
    name: "argo-argocd-notifications-controller-6fcf69f85d",
    type: "Kubernetes::ReplicaSet",
    related_ids: ["71b9eab6-6e67-4791-ba78-fe1a8bc19854"]
  },
  {
    id: "f5c71026-fcab-4709-ae00-2edcc7e3086a",
    name: "argo",
    type: "Kubernetes::Namespace",
    related_ids: [
      "60023763-40ea-498d-ad95-6cf4c8c31e31",
      "b59c1752-1be4-4a51-9f84-8225ebe7c136"
    ]
  },
  {
    id: "33616137-3536-6531-6236-633631376130",
    name: "aws",
    type: "Kubernetes::Cluster",
    related_ids: [
      "8aa17279-ead2-4923-9205-e365c0372cf5",
      "f5c71026-fcab-4709-ae00-2edcc7e3086a"
    ]
  },
  {
    id: "d679a51f-2f7b-4e81-b95d-2e60402ef3eb",
    name: "argo-argocd-notifications-controller-b9d985cdc",
    type: "Kubernetes::ReplicaSet",
    related_ids: null
  },
  {
    id: "dd6637c8-7484-4619-a587-4549bed3352f",
    name: "argo-argocd-notifications-controller-5b67c7675b",
    type: "Kubernetes::ReplicaSet",
    related_ids: ["a9e6a345-9d6e-4ef5-83bc-bcaa71eb382c"]
  },
  {
    id: "6c25a469-5230-402d-8902-f678175aa610",
    name: "argo-argocd-notifications-controller-7946d59c87-wd7g5",
    type: "Kubernetes::Pod",
    related_ids: null
  },
  {
    id: "b59c1752-1be4-4a51-9f84-8225ebe7c136",
    name: "argo-argocd-notifications-controller",
    type: "Kubernetes::Deployment",
    related_ids: [
      "0d274172-fd9a-42b6-88df-9497219dbd32",
      "3ffded9e-7d31-4597-9d54-ad91347a741c",
      "d679a51f-2f7b-4e81-b95d-2e60402ef3eb",
      "dd6637c8-7484-4619-a587-4549bed3352f",
      "edb7eec9-2478-442b-b0ee-cd19ec9e6f9a",
      "fe2430b0-bc23-477b-ac02-c252f8ca05e8"
    ]
  },
  {
    id: "3ffded9e-7d31-4597-9d54-ad91347a741c",
    name: "argo-argocd-notifications-controller-7946d59c87",
    type: "Kubernetes::ReplicaSet",
    related_ids: ["6c25a469-5230-402d-8902-f678175aa610"]
  },
  {
    id: "962f999c-a9bd-40a4-80bf-47c84b1ad750",
    name: "aws-sandbox",
    type: "Kubernetes::GitRepository",
    related_ids: [
      "3e3a9f54-ffdd-4151-baec-8a6cd7e44867",
      "9a87e262-0b5a-4bea-8908-606fc1a1bb5d"
    ]
  },
  {
    id: "71b9eab6-6e67-4791-ba78-fe1a8bc19854",
    name: "argo-argocd-notifications-controller-6fcf69f85d-fncrg",
    type: "Kubernetes::Pod",
    related_ids: null
  },
  {
    id: "edb7eec9-2478-442b-b0ee-cd19ec9e6f9a",
    name: "argo-argocd-notifications-controller-7d6c5f86b9",
    type: "Kubernetes::ReplicaSet",
    related_ids: null
  },
  {
    id: "8aa17279-ead2-4923-9205-e365c0372cf5",
    name: "flux-system",
    type: "Kubernetes::Namespace",
    related_ids: [
      "3e3a9f54-ffdd-4151-baec-8a6cd7e44867",
      "962f999c-a9bd-40a4-80bf-47c84b1ad750",
      "9a87e262-0b5a-4bea-8908-606fc1a1bb5d"
    ]
  },
  {
    id: "0d274172-fd9a-42b6-88df-9497219dbd32",
    name: "argo-argocd-notifications-controller-56f854cd6d",
    type: "Kubernetes::ReplicaSet",
    related_ids: null
  },
  {
    id: "9a87e262-0b5a-4bea-8908-606fc1a1bb5d",
    name: "aws-demo-infra",
    type: "Kubernetes::Kustomization",
    related_ids: [
      "60023763-40ea-498d-ad95-6cf4c8c31e31",
      "f5c71026-fcab-4709-ae00-2edcc7e3086a"
    ]
  }
];
