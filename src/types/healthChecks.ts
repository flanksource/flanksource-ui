export interface HealthChecksResponse {
  duration: number;
  runnerName: string;
  checks: HealthCheck[];
  checks_summary: HealthCheck[];
}

export interface HealthCheck {
  id: string;
  canary_id: string;
  type: string;
  name: string;
  canary_name: string;
  namespace: string;
  labels: HealthCheckLabels;
  Status: string;
  uptime: HealthCheckUptime;
  latency: HealthCheckLatency;
  checkStatuses: HealthCheckStatus[];
  lastRuntime: string;
  updatedAt: string;
  createdAt: string;
  description?: string;
  deletedAt?: string;
  source?: string;
  spec?: any;
  icon?: string;
  endpoint?: string;
  interval?: any;
  location?: any;
  status?: string;
  schedule?: any;
  owner?: any;
  loading?: boolean;
  severity?: string;
}

export interface HealthCheckStatus {
  status: boolean;
  time: string;
  duration: number;
  error?: string;
}

export interface HealthCheckLatency {
  p99?: number;
  p97?: number;
  p95?: number;
  rolling1h: number;
}

export interface HealthCheckUptime {
  passed: number;
  failed: number;
}

export type HealthCheckLabels = Record<string, any>;
