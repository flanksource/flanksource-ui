export const applicationSetController = [
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
    related_ids: ["9580a93f-7b74-437b-836f-9a419252f3dd"]
  },
  {
    id: "c58dba11-b0ef-4b59-a6ea-0b9853db0b3d",
    name: "argo-argocd-applicationset-controller-8576646f48",
    type: "Kubernetes::ReplicaSet",
    related_ids: ["35633fe4-85e8-4c68-9893-9a4b22a80dcf"]
  },
  {
    id: "f5c71026-fcab-4709-ae00-2edcc7e3086a",
    name: "argo",
    type: "Kubernetes::Namespace",
    related_ids: [
      "60023763-40ea-498d-ad95-6cf4c8c31e31",
      "9580a93f-7b74-437b-836f-9a419252f3dd"
    ]
  },
  {
    id: "e678b215-6421-4038-9e4c-c20ebb843a59",
    name: "argo-argocd-applicationset-controller-77b7b4f55b-ljd86",
    type: "Kubernetes::Pod",
    related_ids: null
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
    id: "c72404ed-7d4c-49c1-9981-0c506c23c086",
    name: "argo-argocd-applicationset-controller-765b69c7c",
    type: "Kubernetes::ReplicaSet",
    related_ids: ["94f25b55-3a91-40a0-abd3-df91a705dfaa"]
  },
  {
    id: "94f25b55-3a91-40a0-abd3-df91a705dfaa",
    name: "argo-argocd-applicationset-controller-765b69c7c-vg222",
    type: "Kubernetes::Pod",
    related_ids: null
  },
  {
    id: "4fb8d28b-df0e-4321-9ba9-1e3a86ecee78",
    name: "argo-argocd-applicationset-controller-7df54f78cc",
    type: "Kubernetes::ReplicaSet",
    related_ids: null
  },
  {
    id: "32fbaf98-9257-4668-92b6-b389fff1d42d",
    name: "argo-argocd-applicationset-controller-6896bc667f",
    type: "Kubernetes::ReplicaSet",
    related_ids: null
  },
  {
    id: "9580a93f-7b74-437b-836f-9a419252f3dd",
    name: "argo-argocd-applicationset-controller",
    type: "Kubernetes::Deployment",
    related_ids: [
      "120f8da8-4e2a-42cc-ab76-2451b8fee3f8",
      "32fbaf98-9257-4668-92b6-b389fff1d42d",
      "4fb8d28b-df0e-4321-9ba9-1e3a86ecee78",
      "c58dba11-b0ef-4b59-a6ea-0b9853db0b3d",
      "c72404ed-7d4c-49c1-9981-0c506c23c086",
      "f9762c76-52d7-475c-9e0c-5d72466b734e"
    ]
  },
  {
    id: "35633fe4-85e8-4c68-9893-9a4b22a80dcf",
    name: "argo-argocd-applicationset-controller-8576646f48-s7jpf",
    type: "Kubernetes::Pod",
    related_ids: null
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
    id: "120f8da8-4e2a-42cc-ab76-2451b8fee3f8",
    name: "argo-argocd-applicationset-controller-77b7b4f55b",
    type: "Kubernetes::ReplicaSet",
    related_ids: ["e678b215-6421-4038-9e4c-c20ebb843a59"]
  },
  {
    id: "f9762c76-52d7-475c-9e0c-5d72466b734e",
    name: "argo-argocd-applicationset-controller-c49d78678",
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
    id: "9a87e262-0b5a-4bea-8908-606fc1a1bb5d",
    name: "aws-demo-infra",
    type: "Kubernetes::Kustomization",
    related_ids: [
      "60023763-40ea-498d-ad95-6cf4c8c31e31",
      "f5c71026-fcab-4709-ae00-2edcc7e3086a"
    ]
  }
];
