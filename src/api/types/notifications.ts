import { JobHistoryStatus } from "@flanksource-ui/components/JobsHistory/JobsHistoryTable";
import { ConfigItem } from "./configs";
import { HealthCheck } from "./health";
import { Topology } from "./topology";
import { Team, User } from "./users";
import { PlaybookResourceSelector, PlaybookRunStatus } from "./playbooks";

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
  error_at?: string;
  wait_for?: number;
  inhibitions?: NotificationInhibition[];
};

// Source: github.com/flanksource/mission-control/notification/silence.go
export type SilenceSaveRequest = {
  id?: string;
  name: string;
  from?: string;
  until?: string | null;
  description?: string;
  recursive?: boolean;
  filter?: string;
  selectors?: PlaybookResourceSelector[];
  component_id?: string;
  config_id?: string;
  check_id?: string;
  canary_id?: string;
  namespace?: string;
  source?: "KubernetesCRD" | "UI";
};

// Form state type - selectors stored as YAML string in the form
export type SilenceSaveFormValues = Omit<SilenceSaveRequest, "selectors"> & {
  selectors?: string;
  error?: string;
};

export type NotificationSendHistory = {
  id: string;
  notification_id: string;
  body?: string | undefined;
  body_payload?: NotificationMessagePayload | string | null;
  status?:
    | "attempting_fallback"
    | "error"
    | "evaluating-waitfor"
    | "inhibited"
    | "pending_playbook_completion"
    | "pending_playbook_run"
    | "pending"
    | "repeat-interval"
    | "sent"
    | "silenced"
    | "skipped";
  count: number;
  first_observed: string;
  source_event: string;
  silenced_by?: string;
  resource_id: string;
  playbook_run_id?: string;
  person_id?: string | undefined;
  connection_id?: string | undefined;
  error?: string | undefined;
  duration_millis?: number | undefined;
  created_at: string;
  parent_id?: string;
  resource_health: "healthy" | "unhealthy" | "warning" | "unknown";
  resource_status: string;
  resource_health_description: string;
};

export type NotificationMessageField = {
  label: string;
  value: string;
};

export type NotificationMessageAction = {
  label: string;
  url: string;
  style?: string;
};

export type NotificationMessagePayload = {
  event_name?: string;
  title?: string;
  slack_title?: string;
  summary?: string;
  description?: string;
  fields?: NotificationMessageField[];
  labels?: Record<string, string>;
  label_fields?: NotificationMessageField[];
  recent_events?: string[];
  grouped_resources?: string[];
  grouped_resources_title?: string;
  actions?: NotificationMessageAction[];
  slack_actions_divider?: boolean;
};

export type NotificationSendHistoryResource =
  | (Pick<HealthCheck, "id" | "name" | "type" | "status" | "tags"> & {
      health: "healthy" | "unhealthy" | "warning" | "unknown";
    })
  | Pick<
      ConfigItem,
      "id" | "name" | "type" | "health" | "status" | "config_class" | "tags"
    >
  | Pick<
      Topology,
      "id" | "name" | "type" | "icon" | "health" | "status" | "tags"
    >;

export type NotificationSendHistorySummary = {
  resource?: NotificationSendHistoryResource; // resource can be null when the resource is deleted, but the notification history is still present
  resource_health: "healthy" | "unhealthy" | "warning" | "unknown";
  resource_tags: Record<string, string>;
  resource_status: string;
  resource_health_description: string;
  notification_id: string;
  created_at: string;
  resource_kind?: "component" | "config" | "check" | "canary";
  resource_type?: string | null;
  first_observed: string;
  last_seen: string;
  total: number;
  sent: number;
  error: number;
  suppressed: number;
};

export type NotificationSendHistoryApiResponse = NotificationSendHistory & {
  resource_kind?: "component" | "config" | "check" | "canary";
  resource_type?: string | null;
  resource_health: "healthy" | "unhealthy" | "warning" | "unknown";
  resource_status: string;
  playbook_run: {
    id: string;
    status: PlaybookRunStatus;
    playbook_name: string;
    playbook_id: string;
  };
  resource: NotificationSendHistoryResource;
  person: User;
};

export type NotificationSendHistoryDetailApiResponse =
  NotificationSendHistoryApiResponse & {
    body_markdown?: string | null;
  };

export type NotificationSilenceItem = {
  id: string;
  name: string;
  namespace: string;
  description?: string;
  filter?: string;
  selectors?: string;
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
