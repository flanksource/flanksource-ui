import { ModalSize } from "@flanksource-ui/ui/Modal";
import { Agent, Avatar, CreatedAt } from "../traits";
import { ConfigItem } from "./configs";
import { HealthCheckSummary } from "./health";
import { Topology } from "./topology";
import { Team, User } from "./users";

export type PlaybookRunStatus =
  | "scheduled"
  | "running"
  | "cancelled"
  | "completed"
  | "failed"
  | "pending"
  | "waiting"
  | "pending_approval";

export type PlaybookRunActionStatus =
  | "completed"
  | "failed"
  | "running"
  | "scheduled"
  | "skipped"
  | "sleeping";

export type PlaybookRunAction = {
  id: string;
  name: string;
  agent?: {
    id: string;
    name: string;
  };
  status: PlaybookRunActionStatus;
  playbook_run_id: string;
  start_time: string;
  scheduled_time?: string;
  end_time?: string;
  result?: {
    stdout?: string;
    logs?: string;
    markdown?: string;
    recommendedPlaybooks?: string;
    slack?: string;
    stderr?: string;
    [key: string]: unknown;
  };
  error?: string;
};

export type PlaybookApproval = {
  id: string;
  run_id: string;
  person_id?: User;
  team_id?: Team;
  created_at: string;
};

export interface PlaybookRunWithActions extends PlaybookRun {
  actions: PlaybookRunAction[];
  playbook_approvals?: PlaybookApproval[];
}

export interface PlaybookRun extends CreatedAt, Avatar, Agent {
  id: string;
  playbook_id?: string;
  status: PlaybookRunStatus;
  error?: string;
  start_time: string;
  scheduled_time?: string;
  end_time?: string;
  check_id?: string;
  config_id?: string;
  component_id?: string;
  notification_send_id?: string;
  parameters?: Record<string, unknown>;
  /* relationships */
  playbooks?: PlaybookSpec;
  component?: Pick<Topology, "id" | "name" | "icon">;
  check?: HealthCheckSummary;
  config?: Pick<ConfigItem, "id" | "name" | "type" | "config_class">;
}

export type PlaybookResourceSelector = {
  agent?: string;
  cache?: string;
  includeDeleted?: boolean;
  id?: string;
  name?: string;
  namespace?: string;
  types?: string[];
  statuses?: string[];
  labelSelector?: string;
  fieldSelector?: string;
  search?: string;
};

export type PlaybookSpec = {
  id: string;
  name: string;
  title: string;
  description?: string;
  icon?: string;
  created_by?: User;
  category?: string;
  spec?: {
    actions?: Record<string, any>[];
    configs?: PlaybookResourceSelector[];
    components?: PlaybookResourceSelector[];
    checks?: PlaybookResourceSelector[];
    icons?: string;
    parameters?: PlaybookParam[];
    description?: string;
    [key: string]: any;
  };
  source: "KubernetesCRD" | "ConfigFile" | "UI";
  created_at: string;
  updated_at: string;
  deleted_at?: string;
};

export type PlaybookNames = {
  id: string;
  name: string;
  namespace?: string;
  title: string;
  icon?: string;
  category?: string;
  description?: string;
};

export type PlaybookParamCommonFields = {
  name: string;
  label: string;
  description?: string;
  default?: string;
  required?: boolean;
  icon?: string;
};

type PlaybookParamListOptions = PlaybookParamCommonFields & {
  type: "list";
  properties?: {
    className?: string;
    colSpan?: number;
    // this is a list of options, e.g. a dropdown
    options: {
      label: string;
      value: string;
    }[];
  };
};

type ParamProperties = {
  className?: string;
  colSpan?: number;
};

type PlaybookParamTextOptions = PlaybookParamCommonFields & {
  type:
    | "text"
    | "password"
    | "email"
    | "url"
    | "number"
    | "bytes"
    | "millicores"
    | "dns1123";
  properties?: ParamProperties & {
    // for multiline text, we can use this, to make it a textarea, otherwise
    // it's a single line input
    multiline?: boolean;
    format?:
      | "text"
      | "password"
      | "email"
      | "url"
      | "number"
      | "bytes"
      | "millicores"
      | "dns1123";
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    regex?: string;
  };
};

export type PlaybookParamCodeEditor = PlaybookParamCommonFields & {
  type: "code";
  properties?: ParamProperties & {
    // We can have a single code type, then we can use this to determine the language
    // e.g. yaml, json, toml, etc.
    language?: string;
    size?: ModalSize;
    jsonSchemaUrl?: string;
  };
};

export type PlaybookParamCheckbox = PlaybookParamCommonFields & {
  type: "checkbox";
  properties?: ParamProperties;
};

export type PlaybookParamComponentConfigCheck = PlaybookParamCommonFields & {
  type: "component" | "config" | "check";
  properties?: ParamProperties & {
    filter: PlaybookResourceSelector[];
  };
};

export type PlaybookParamPeople = PlaybookParamCommonFields & {
  type: "people";
  properties?: ParamProperties & {
    // filter by role
    role: string;
  };
};

export type PlaybookParamTeam = PlaybookParamCommonFields & {
  type: "team";
  properties?: ParamProperties;
};

export type PlaybookParam =
  | PlaybookParamListOptions
  | PlaybookParamTextOptions
  | PlaybookParamCodeEditor
  | PlaybookParamCheckbox
  | PlaybookParamComponentConfigCheck
  | PlaybookParamPeople
  | PlaybookParamTeam;

export type RunnablePlaybook = Omit<PlaybookSpec, "spec"> & {
  check_id?: string;
  config_id?: string;
  component_id?: string;
  parameters: PlaybookParam[];
};

export type NewPlaybookSpec = Omit<
  PlaybookSpec,
  "id" | "created_at" | "updated_at" | "deleted_at" | "created_by"
> & {
  created_by?: string;
};

export type UpdatePlaybookSpec = Omit<
  PlaybookSpec,
  "created_at" | "updated_at" | "deleted_at" | "created_by" | "name"
>;
