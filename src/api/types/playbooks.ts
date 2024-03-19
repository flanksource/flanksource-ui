import { ModalSize } from "@flanksource-ui/ui/Modal";
import { Agent, Avatar, CreatedAt } from "../traits";
import { ConfigItem } from "./configs";
import { HealthCheckSummary } from "./health";
import { Topology } from "./topology";
import { User } from "./users";

export type PlaybookRunStatus =
  | "scheduled"
  | "running"
  | "cancelled"
  | "completed"
  | "failed"
  | "pending";

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
  status: PlaybookRunActionStatus;
  playbook_run_id: string;
  start_time: string;
  scheduled_time?: string;
  end_time?: string;
  result?: {
    stdout?: string;
    logs?: string;
    stderr?: string;
    [key: string]: unknown;
  };
  error?: string;
};

export interface PlaybookRunWithActions extends PlaybookRun {
  actions: PlaybookRunAction[];
}

export interface PlaybookRun extends CreatedAt, Avatar, Agent {
  id: string;
  playbook_id?: string;
  status: PlaybookRunStatus;
  start_time: string;
  scheduled_time?: string;
  end_time?: string;
  check_id?: string;
  config_id?: string;
  component_id?: string;
  parameters?: Record<string, unknown>;
  /* relationships */
  playbooks?: PlaybookSpec;
  component?: Pick<Topology, "id" | "name" | "icon">;
  check?: HealthCheckSummary;
  config?: Pick<ConfigItem, "id" | "name" | "type" | "config_class">;
}

type PlaybookSpecFilterType = {
  type?: string;
  tags?: string[];
  labelSelector?: string[];
};

export type PlaybookSpec = {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  created_by?: User;
  category?: string;
  spec: {
    actions?: Record<string, any>[];
    configs?: PlaybookSpecFilterType[];
    components?: PlaybookSpecFilterType[];
    checks: PlaybookSpecFilterType[];
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
  icon?: string;
  category?: string;
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
    // this is a list of options, e.g. a dropdown
    options: {
      label: string;
      value: string;
    }[];
  };
};

type PlaybookParamTextOptions = PlaybookParamCommonFields & {
  type: "text";
  properties?: {
    // for multiline text, we can use this, to make it a textarea, otherwise
    // it's a single line input
    multiline?: boolean;
  };
};

export type PlaybookParamCodeEditor = PlaybookParamCommonFields & {
  type: "code";
  properties?: {
    // We can have a single code type, then we can use this to determine the language
    // e.g. yaml, json, toml, etc.
    language?: string;
    size: ModalSize;
    jsonSchemaUrl?: string;
  };
};

export type PlaybookParamCheckbox = PlaybookParamCommonFields & {
  type: "checkbox";
  // no properties, just a checkbox
};

export type PlaybookParamComponentConfig = PlaybookParamCommonFields & {
  type: "component" | "config";
  properties?: {
    // filter by component type
    filter: {
      type: string;
    };
  };
};

export type PlaybookParamPeople = PlaybookParamCommonFields & {
  type: "people";
  properties?: {
    // filter by role
    role: string;
  };
};

export type PlaybookParamTeam = PlaybookParamCommonFields & {
  type: "team";
  properties?: {
    // think about this one
  };
};

export type PlaybookParam =
  | PlaybookParamListOptions
  | PlaybookParamTextOptions
  | PlaybookParamCodeEditor
  | PlaybookParamCheckbox
  | PlaybookParamComponentConfig
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
  "created_at" | "updated_at" | "deleted_at" | "created_by"
>;
