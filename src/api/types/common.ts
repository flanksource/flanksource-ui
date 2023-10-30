export type PaginationInfo = {
  pageSize: number;
  pageIndex: number;
};

export type VersionInfo = {
  frontend: string;
  backend: string;
  Version: string;
  Timestamp: string;
};

export type CostsData = {
  cost_per_minute?: number;
  cost_total_1d?: number;
  cost_total_7d?: number;
  cost_total_30d?: number;
};

export type Severity =
  | "info"
  | "warning"
  | "low"
  | "medium"
  | "high"
  | "blocker"
  | "critical";

export type ValueType = number | string | Date;

export type DateType = Date | string | undefined;

export function sortByCreatedAt<T extends { created_at?: DateType }>(
  a: T,
  b: T
) {
  if (!a.created_at || !b.created_at) {
    return 0;
  }
  return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
}

export type AgentItem = {
  id: string;
  name: string;
  description: string;
};
