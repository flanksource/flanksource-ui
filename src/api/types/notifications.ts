import { JobHistoryStatus } from "@flanksource-ui/components/JobsHistory/JobsHistoryTable";
import { ConfigItem } from "./configs";
import { HealthCheck } from "./health";
import { Topology } from "./topology";
import { Team, User } from "./users";
import { PlaybookRunStatus } from "./playbooks";

export type NotificationInhibition = {
  // Direction specifies the traversal direction in relation to the "From" resource.
  // - "outgoing": Looks for child resources originating from the "From" resource.
  //   Example: If "From" is "Kubernetes::Deployment", "To" could be ["Kubernetes::Pod", "Kubernetes::ReplicaSet"].
  // - "incoming": Looks for parent resources related to the "From" resource.
  //   Example: If "From" is "Kubernetes::Deployment", "To" could be ["Kubernetes::HelmRelease", "Kubernetes::Namespace"].
  // - "all": Considers both incoming and outgoing relationships.
  direction: "outgoing" | "incoming" | "all";

  // Soft, when true, relates using soft relationships.
  // Example: Deployment to Pod is hard relationship, But Node to Pod is soft relationship.
  soft?: boolean;

  // Depth defines how many levels of child or parent resources to traverse.
  depth?: number;

  // From specifies the starting resource type (for example, "Kubernetes::Deployment").
  from: string;

  // To specifies the target resource types, which are determined based on the Direction.
  // Example:
  //   - If Direction is "outgoing", these are child resources.
  //   - If Direction is "incoming", these are parent resources.
  to: string[];
};

export type NotificationRules = {
  id: string;
  namespace?: string;
  name: string;
  title?: string;
  events: string[];
  source?: "KubernetesCRD" | "ConfigFile" | "UI" | "Topology";
  template: string;
  filter?: string;
  properties?: Record<string, any>;
  person_id?: string;
  team_id?: string;
  playbook_id?: string;
  custom_services?: {
    name: string;
    filters?: string;
    url?: string;
    connection?: string;
    properties?: Record<string, any>;
  }[];
  created_by?: User;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  person?: User;
  team?: Team;
  job_status?: JobHistoryStatus;
  job_name?: string;
  job_details?: {
    errors?: string[];
  };
  pending?: number;
  avg_duration_ms?: number;
  failed?: number;
  sent?: number;
  most_common_error?: string;
  repeat_interval?: string;
  error?: string;
  wait_for?: number;
  inhibitions?: NotificationInhibition[];
};

export type SilenceNotificationResponse = {
  id: string;
  name: string;
  filter?: string;
  selectors?: string;
  component_id?: string;
  config_id?: string;
  check_id?: string;
  canary_id?: string;
  from: string;
  until: string | null;
  description?: string;
  recursive?: boolean;
  namespace?: string;
  error?: string;
  source?: "KubernetesCRD" | "UI";
};

export type NotificationSendHistory = {
  id: string;
  notification_id: string;
  body?: string | undefined;
  status?: string | null;
  count: number;
  first_observed: string;
  source_event: string;
  resource_id: string;
  playbook_run_id?: string;
  person_id?: string | undefined;
  connection_id?: string | undefined;
  error?: string | undefined;
  duration_millis?: number | undefined;
  created_at: string;
  parent_id?: string;
};

export type NotificationSendHistoryApiResponse = NotificationSendHistory & {
  resource_type: "component" | "config" | "check" | "canary";
  playbook_run: {
    id: string;
    status: PlaybookRunStatus;
    playbook_name: string;
    playbook_id: string;
  };
  resource:
    | Pick<HealthCheck, "id" | "name" | "type" | "status">
    | Pick<ConfigItem, "id" | "name" | "type" | "config_class">
    | Pick<Topology, "id" | "name" | "icon">;
  person: User;
};

export type NotificationSilenceItem = {
  id: string;
  name: string;
  namespace: string;
  description?: string;
  filter?: string;
  error?: string;
  from: string;
  until: string | null;
  recursive?: boolean;
  config_id?: string;
  check_id?: string;
  canary_id?: string;
  component_id?: string;
  source?: "KubernetesCRD" | "UI";
  created_by?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
};

export type NotificationSilenceItemApiResponse = NotificationSilenceItem & {
  checks: Pick<HealthCheck, "id" | "name" | "type" | "status">;
  catalog: Pick<ConfigItem, "id" | "name" | "type" | "config_class">;
  component: Pick<Topology, "id" | "name" | "icon">;
  createdBy: User;
};
