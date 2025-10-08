import { SchemaResourceI } from "../schemaResources";
import { Agent, Avatar, Timestamped } from "../traits";
import { AgentItem } from "./common";
import { ConfigItem } from "./configs";
import { Topology } from "./topology";

export interface HealthChecksResponse {
  duration: number;
  runnerName: string;
  checks: HealthCheck[];
  checks_summary: HealthCheck[];
}

export interface HealthCheck extends Timestamped, Avatar, Agent {
  id: string;
  canary_id: string;
  type: string;
  tags?: Record<string, any>;
  name: string;
  canary_name: string;
  canary_namesspace?: string;
  namespace: string;
  labels: HealthCheckLabels;
  Status: string;
  uptime: HealthCheckUptime;
  latency: HealthCheckLatency;
  checkStatuses: HealthCheckStatus[];
  last_runtime: string;
  description?: string;
  spec?: any;
  icon?: string;
  endpoint?: string;
  interval?: any;
  location?: any;
  status?: "healthy" | "unhealthy";
  schedule?: any;
  owner?: any;
  loading?: boolean;
  severity?: string;
  next_runtime?: string;
  last_transition_time?: string;
  agents?: AgentItem;
  canaries?: SchemaResourceI;
  configs: {
    configs: Pick<ConfigItem, "id" | "name" | "type">;
  }[];
  components: {
    components: Pick<Topology, "id" | "name" | "icon">;
  }[];
}

export type HealthCheckSummary = Pick<
  HealthCheck,
  | "id"
  | "name"
  | "icon"
  | "type"
  | "status"
  | "severity"
  | "next_runtime"
  | "created_at"
  | "last_runtime"
  | "last_transition_time"
>;

export type HealthCheckNames = Pick<
  HealthCheck,
  "id" | "name" | "canary_id" | "status" | "type"
>;

export interface HealthCheckStatus {
  status: boolean;
  time: string;
  duration: number;
  error?: string;
  message?: string;
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
