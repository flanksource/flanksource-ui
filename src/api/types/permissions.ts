import { Connection } from "@flanksource-ui/components/Connections/ConnectionFormModal";
import { ConfigItem } from "./configs";
import { PlaybookSpec } from "./playbooks";
import { Topology } from "./topology";
import { Team, User } from "./users";
import { NotificationRules } from "./notifications";

export type PermissionGlobalObject =
  | "catalog"
  | "component"
  | "canaries"
  | "connection"
  | "playbook"
  | "topology";

type PermissionObjectSelector = {
  playbooks?: Selectors[];
  connections?: Selectors[];
  configs?: Selectors[];
  components?: Selectors[];
  scopes?: ScopeSelector[];
};

interface Selectors {}

interface ScopeSelector {
  namespace?: string;
  name: string;
}

export type PermissionTable = {
  id: string;
  description: string;
  action: string;
  deny?: boolean;
  subject?: string;
  subject_type?:
    | "group"
    | "playbook"
    | "team"
    | "person"
    | "notification"
    | "component";
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
  until?: string;
  source?: string;
  error?: string;

  // Resources
  object?: PermissionGlobalObject;
  object_selector?: PermissionObjectSelector;
  component_id?: string;
  canary_id?: string;
  config_id?: string;
  connection_id?: string;
  playbook_id?: string;

  // Deprecated fields
  // These are subject fields that we do not use anymore.
  // Instead we use the "subject" and "subject_type" field.
  // Instead of setting person_id, we set subject = <person_id> and subject_type = "person"
  person_id?: string;
  notification_id?: string;
  team_id?: string;
};

export type PermissionsSummary = PermissionTable & {
  created_by?: User;

  // Subjects with minimal fields
  person?: User;
  team?: Pick<Team, "id" | "name" | "icon">;
  canary?: {
    id: string;
    name: string;
  };
  playbook?: Pick<PlaybookSpec, "id" | "name" | "namespace" | "icon" | "title">;
  notification?: Pick<NotificationRules, "id" | "name" | "namespace">;
  group?: { id: string; namespace: string; name: string };
  scraper?: { id: string; namespace: string; name: string };
  topology?: { id: string; namespace: string; name: string };

  // These represent global objects
  object: PermissionGlobalObject;

  // These represent object selectors per type
  object_selector?: PermissionObjectSelector;

  // These are objects that are specifically chosen (from the dropdown).
  // We store their ID.
  config_object: Pick<ConfigItem, "id" | "name" | "type" | "config_class">;
  playbook_object: Pick<PlaybookSpec, "id" | "name" | "icon">;
  connection_object: Pick<Connection, "id" | "name" | "type">;
  component_object: Pick<Topology, "id" | "name" | "icon">;
  canary_object: {
    id: string;
    name: string;
    icon?: string;
  };
};
