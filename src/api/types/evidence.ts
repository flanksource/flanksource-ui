import { CreatedAt, Avatar, UpdatedAt } from "../traits";
import { ConfigItem, ConfigChange, ConfigAnalysis } from "./configs";
import { HealthCheck } from "./health";
import { Topology } from "./topology";
import { User } from "./users";

export enum EvidenceType {
  Log = "log",
  Config = "config",
  Topology = "topology",
  Check = "check",
  ConfigAnalysis = "config_analysis",
  ConfigChange = "config_change",
  // inline comment
  Comment = "comment"
}

export interface Evidence extends CreatedAt, UpdatedAt, Avatar {
  user?: User;
  id: string;
  hypothesisId: string;
  component_id?: string;
  config_id?: string;
  config_analysis_id?: string;
  config_change_id?: string;
  check_id?: string;
  evidence?: Record<string, any>;
  description?: string;
  definition_of_done?: boolean;
  script?: string;
  properties?: string;
  type: EvidenceType;
  done?: boolean;
  hypothesis_id: string;
}

export interface EvidenceWithEvidenceItems extends Evidence {
  components?: Topology;
  configs?: ConfigItem;
  config_changes?: ConfigChange;
  config_analysis?: ConfigAnalysis;
  checks?: HealthCheck;
}
