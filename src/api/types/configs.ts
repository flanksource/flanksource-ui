import { Agent, Avatar, CreatedAt, Timestamped } from "../traits";
import { HealthCheckSummary } from "./health";

export interface ConfigChange extends CreatedAt {
  id: string;
  config_id: string;
  external_change_id: string;
  deleted_at?: string; // deleted at timestamp of the config (not the change)
  change_type: string;
  severity?: string;
  source: string;
  summary: string;
  patches?: string;
  diff?: string;
  details: string;
  external_created_by: string;
  config?: ConfigItem;
  config_class?: string;
  type?: string;
  name?: string;
  created_by?: string;
  tags?: Record<string, any>;
  first_observed?: string;
  count?: number;
}

export interface Change {
  change_type: string;
  total: number;
  severity?: string;
}

export interface Costs {
  cost_per_minute?: number;
  cost_total_1d?: number;
  cost_total_7d?: number;
  cost_total_30d?: number;
}

export function isCostsEmpty(costs: Costs) {
  return (
    !costs.cost_per_minute &&
    !costs.cost_total_1d &&
    !costs.cost_total_7d &&
    !costs.cost_total_30d
  );
}

export interface ConfigItem extends Timestamped, Avatar, Agent, Costs {
  id: string;
  name: string;
  deleted_at?: string;
  status?: string;
  external_id?: string;
  config_class?: string;
  type: string;
  path?: string;
  changes?: number;
  analysis?: Record<string, any>;
  tags?: Record<string, any>;
  labels?: Record<string, any>;
  allTags?: Record<string, any>;
  config?: Record<string, any>;
  description?: string | null;
  health?: "healthy" | "unhealthy" | "warning" | "unknown";
  related_ids?: string[];
  agent?: {
    id: string;
    name: string;
  };
  scraper?: {
    id: string;
    name: string;
  };
  summary?: {
    relationships?: number;
    analysis?: number;
    changes?: number;
    playbook_runs?: number;
    checks?: number;
  };
  properties?: {
    icon: string;
    name: string;
    links: {
      label: string;
      url: string;
    }[];
  }[];
  last_scraped_time?: string;
}

export interface ConfigItemGraphData extends ConfigItem {
  expanded?: boolean;
  expandable?: boolean;
  items?: Pick<ConfigItem, "type">[];
  isIntermediaryNode?: boolean;
}

export interface ConfigTypeRelationships extends Timestamped {
  config_id: string;
  related_id: string;
  property: string;
  selector_id: string;
  configs: ConfigItem;
  related: ConfigItem;
}

export interface Analysis {
  category: string;
  severity: string;
  description: string;
  analysis_type: string;
  analyzer: string;
}

export interface ConfigAnalysis extends Analysis, CreatedAt, Avatar {
  id: string;
  config_id: string;
  summary: string;
  status: string;
  message: string;
  sanitizedMessageHTML?: string;
  sanitizedMessageTxt?: string;
  first_observed: string;
  last_observed: string;
  source: any;
  config?: ConfigItem;
}

export type ConfigSummary = {
  type: string;
  analysis?: Record<string, any>;
  changes?: string;
  count: number;
  health: {
    healthy: number;
    unknown: number;
    [key: string]: number;
  };
  cost_per_minute?: number;
  cost_total_1d?: number;
  cost_total_7d?: number;
  cost_total_30d?: number;
  agent?: {
    id: string;
    name: string;
  };
};

export type ConfigHealthCheckView = HealthCheckSummary & {
  config_id: string;
};
