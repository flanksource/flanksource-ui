export { IncidentPriority } from "./incident-priority";

export const NodePodPropToLabelMap = {
  node: "Node",
  created: "Created At",
  "instance-type": "Instance Type",
  zone: "Zone",
  os: "OS",
  containerRuntime: "Container Runtime",
  kernel: "Kernel",
  kubeProxy: "Kubernetes proxy",
  kubelet: "Kubelet "
};

export const isCanaryUI =
  process.env.NEXT_PUBLIC_APP_DEPLOYMENT === "CANARY_CHECKER";
