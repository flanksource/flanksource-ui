import { Agent, Namespaced, Timestamped } from "../traits";
import { CostsData, Severity, ValueType } from "./common";
import { HealthCheckSummary } from "./health";
import { IncidentType } from "./incident";
import { User } from "./users";

export type Property = {
  name: string;
  icon?: string;
  label?: string;
  type?: "url" | "badge" | "currency" | "text" | "age" | "hidden";
  text?: string;
  max?: number;
  min?: number;
  headline?: boolean;
  value?: ValueType;
  unit?: string;
  color?: string;
  namespace?: string;
  url?: string;
  links?: {
    label: string;
    url: string;
  }[];
};

export interface Component extends Timestamped, Namespaced {
  created_at?: string;
  external_id?: string;
  icon?: string;
  id: string;
  parent_id?: string;
  path?: string;
  type?: string;
  tags?: Record<string, any>;
  updated_at?: string;
}

export interface Topology extends Component, CostsData, Agent {
  title?: string;
  properties?: Property[];
  components?: Topology[];
  labels?: Record<string, string>;
  path?: string;
  text?: string;
  health?: "healthy" | "unhealthy" | "warning" | "unknown";
  status?: string;
  status_reason?: string;
  hidden?: boolean;
  external_id?: string;
  topology_id?: string;
  summary?: {
    incidents?: Record<IncidentType, Record<"High" | "Medium" | "Low", number>>;
    insights?: Record<IncidentType, Record<Severity, number | undefined>>;
    checks?: {
      healthy: number;
      warning: number;
      unhealthy: number;
    };
    healthy?: number;
    unknown?: number;
    unhealthy?: number;
    warning?: number;
  };
  logs?: {
    name: string;
  }[];
  parents?: string[];
  children?: string[];
  is_leaf?: boolean;
  description?: string;
}

export type ComponentTeamItem = {
  component_id: string;
  team_id: string;
  role: string;
  selector_id: string;
  team: {
    id: string;
    name: string;
    icon: string;
    spec: any;
    source: string;
    created_by: Pick<User, "avatar" | "id" | "name">;
    created_at: string;
    updated_at: string;
  };
};

export interface ComponentTemplateItem extends Timestamped, Namespaced {
  id: string;
  labels: Record<string, string>;
  spec: any;
  schedule: string;
}

export type ComponentHealthCheckView = HealthCheckSummary & {
  component_id: string;
};
