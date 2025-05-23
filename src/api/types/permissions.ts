import { Connection } from "@flanksource-ui/components/Connections/ConnectionFormModal";
import { ConfigItem } from "./configs";
import { PlaybookSpec } from "./playbooks";
import { Topology } from "./topology";
import { Team, User } from "./users";
import { NotificationRules } from "./notifications";

export type PermissionTable = {
  id: string;
  description: string;
  action: string;
  deny?: boolean;
  object?: string;
  subject?: string;
  subject_type?: "playbook" | "team" | "person" | "notification" | "component";
  object_selector?: Record<string, any>[];
  component_id?: string;
  config_id?: string;
  canary_id?: string;
  playbook_id?: string;
  created_by: string;
  connection_id?: string;
  person_id?: string;
  notification_id?: string;
  team_id?: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
  until?: string;
  source?: string;
};

export type PermissionAPIResponse = PermissionTable & {
  // checks: Pick<HealthCheck, "id" | "name" | "type" | "status">;
  catalog: Pick<ConfigItem, "id" | "name" | "type" | "config_class">;
  component: Pick<Topology, "id" | "name" | "icon">;
  canary: {
    id: string;
    name: string;
  };
  playbook: Pick<PlaybookSpec, "id" | "name" | "namespace" | "icon" | "title">;
  team: Pick<Team, "id" | "name" | "icon">;
  connection: Pick<Connection, "id" | "name" | "type">;
  notification: Pick<NotificationRules, "id" | "name" | "namespace">;
  group: any;
  subject: string;
  person: User;
  createdBy: User;
  tags: Record<string, string> | null;
  agents: string[] | null;
};
