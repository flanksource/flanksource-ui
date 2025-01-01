export const NodePodPropToLabelMap = {
  node: "Node",
  created: "Created At",
  "instance-type": "Instance Type",
  zone: "Zone",
  os: "OS",
  containerRuntime: "Container Runtime",
  kernel: "Kernel",
  kubeProxy: "Kubernetes proxy",
  kubelet: "Kubelet ",
  version: "Version",
  memory: "Memory",
  cpu: "CPU",
  ip: "IP"
} as const;

export const AVATAR_INFO = `id,name,avatar,email`;

export const SortOrders = {
  asc: "asc",
  desc: "desc"
};

const MINUTES_IN_AN_HOUR = 60;

const MINUTES_IN_A_DAY = MINUTES_IN_AN_HOUR * 24;

const MINUTES_IN_A_WEEK = MINUTES_IN_A_DAY * 7;

const MINUTES_IN_A_MONTH = MINUTES_IN_A_DAY * 30;

const MINUTES_IN_A_YEAR = MINUTES_IN_A_MONTH * 12;

export const TimeRangeToMinutes: Record<string, number> = {
  "15m": 15,
  "1h": MINUTES_IN_AN_HOUR,
  "2h": 2 * MINUTES_IN_AN_HOUR,
  "3h": 3 * MINUTES_IN_AN_HOUR,
  "6h": 6 * MINUTES_IN_AN_HOUR,
  "12h": 12 * MINUTES_IN_AN_HOUR,
  "1d": MINUTES_IN_A_DAY,
  "2d": 2 * MINUTES_IN_A_DAY,
  "3d": 3 * MINUTES_IN_A_DAY,
  "1w": MINUTES_IN_A_WEEK,
  "2w": 2 * MINUTES_IN_A_WEEK,
  "3w": 3 * MINUTES_IN_A_WEEK,
  "1mo": MINUTES_IN_A_MONTH,
  "2mo": 2 * MINUTES_IN_A_MONTH,
  "3mo": 3 * MINUTES_IN_A_MONTH,
  "6mo": 6 * MINUTES_IN_A_MONTH,
  "1y": MINUTES_IN_A_YEAR,
  "2y": 2 * MINUTES_IN_A_YEAR,
  "3y": 3 * MINUTES_IN_A_YEAR,
  "5y": 5 * MINUTES_IN_A_YEAR
};

export const HEALTH_SETTINGS = "healthSettings";
