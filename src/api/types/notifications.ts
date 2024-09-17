import { ConfigItem } from "./configs";
import { HealthCheck } from "./health";
import { Topology } from "./topology";
import { User } from "./users";

export type SilenceNotificationResponse = {
  id: string;
  component_id: string;
  config_id: string;
  check_id: string;
  canary_id: string;
  from: string;
  until: string;
  description: string;
  recursive: boolean;
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
  person_id?: string | undefined;
  error?: string | undefined;
  duration_millis?: number | undefined;
  created_at: string;
};

export type NotificationSendHistoryApiResponse = NotificationSendHistory & {
  person: User;
};

export type NotificationSilenceItem = {
  id: string;
  namespace: string;
  description?: string;
  from: string;
  until: string;
  recursive?: boolean;
  config_id?: string;
  check_id?: string;
  canary_id?: string;
  component_id?: string;
  source?: "source1" | "source2" | "source3";
  created_by?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
};

export type NotificationSilenceItemApiResponse = NotificationSilenceItem & {
  checks: Pick<HealthCheck, "id" | "name" | "type" | "status">[];
  catalog: Pick<ConfigItem, "id" | "name" | "type" | "config_class">[];
  component: Pick<Topology, "id" | "name" | "icon">[];
  createdBy: User;
};
