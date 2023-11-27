import { Agent, Namespaced, Timestamped } from "../traits";
import { ValueType } from "./common";
import { CostsData, Severity } from "./common";
import { HealthCheckSummary } from "./health";
import { IncidentType } from "./incident";
import { User } from "./users";

export type TopologyProperty = {
  name: string;
  icon?: string;
  label?: string;
  type?: string;
  text?: string;
  max?: number;
  min?: number;
  headline?: boolean;
  value?: ValueType;
  unit?: string;
  color?: string;
  namespace?: string;
};

export interface Topology extends Timestamped, CostsData, Agent, Namespaced {
  id: string;
  parent_id?: string;
  type?: string;
  title?: string;
  properties?: TopologyProperty[];
  components?: Topology[];
  labels?: Record<string, string>;
  path?: string;
  icon?: string;
  text?: string;
  status?: string;
  status_reason?: string;
  hidden?: boolean;
  external_id?: string;
  topology_id?: string;
  summary?: {
    incidents?: Record<IncidentType, Record<"High" | "Medium" | "Low", number>>;
    insights?: Record<IncidentType, Record<Severity, number | undefined>>;
    [key: string]: any;
  };
  logs?: {
    name: string;
  }[];
  parents?: string[];
  children?: string[];
  is_leaf?: boolean;
  description?: string;
  checks?: {
    health: number;
    warning: number;
    unhealthy: number;
  };
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
