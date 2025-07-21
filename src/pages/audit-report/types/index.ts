import { IconName } from "lucide-react/dynamic";

// Location Types
export interface Location {
  type: "cloud" | "on-premise" | "hybrid" | "multi-cloud";
  purpose: string;
  region: string;
  account?: string;
  name: string;
  provider: string;
  resourceCount: number;
}

export interface MonitoringTool {
  name: string;
  type: string;
  url: string;
  purpose: string;
}

export interface MonitoringMetrics {
  alertsConfigured: number;
  alertsFired: number;
  uptime: number;
  apdex: number;
  tools: MonitoringTool[];
}

export interface Finding {
  id: string;
  type: "security" | "compliance" | "performance" | "reliability";
  severity: "critical" | "high" | "medium" | "low";
  title: string;
  description: string;
  date: string;
  lastObserved: string;
  status: "open" | "resolved" | "in-progress" | "accepted";
  remediation?: string;
}

export interface Assessment {
  name: string;
  type: string;
  assesor: {
    type: string;
    name: string;
  };
  date: string;
  expiry: string;
  findings: {
    high: number;
    low: number;
    medium: number;
  };
  unresolved: {
    high: number;
    low: number;
  };
}

export interface Repository {
  type: "GitHub" | "Azure DevOps" | "GitLab";
  url: string;
  name: string;
}

export interface Version {
  number: string;
  released: string;
  deployed: string;
  gitTag: string;
  repoName: string;
  createdBy: string;
  authorizedBy: string;
}

export interface Cost {
  daily: number;
  monthly: number;
  annual: number;
}

export interface MFA {
  type: string;
  enforced: string;
}

export interface PasswordPolicy {
  expiry: string;
  strength: string;
}

export interface Authentication {
  type: string;
  name: string;
  domain: string;
  mfa: MFA;
  passwordPolicy?: PasswordPolicy;
  provider?: string;
}

export interface AccessControl {
  authentication?: Authentication[];
  users?: User[];
  roles?: string[];
}

export interface Link {
  // Placeholder for types.Link
  [key: string]: any;
}

export interface Property {
  label: string;
  tooltip?: string;
  icon?: IconName;
  text?: string;
  order?: number;
  type?: string;
  color?: string;
  value?: number;
  links?: Link[];
  unit?: string;
}

export type Properties = Property[];

export interface Application {
  id?: string;
  name: string;
  type: string;
  description: string;
  properties?: Properties;

  accessControl: AccessControl;
  assessments?: Assessment[];
  backups?: Backup[];
  changes?: Change[];
  cost?: Cost;
  findings?: Finding[];
  incidents?: Incident[];
  lifecycle?: string;
  locations?: Location[];
  monitoring?: MonitoringMetrics;
  sections?: ViewSection[];
  repositories?: Repository[];
  restores?: Restore[];
  version?: Version;
}

type ViewSection = {
  title: string;
  icon: IconName;
  result: ViewResult;
};

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  created: string;
  lastLogin: string;
  lastAccessReview: string;
}

export interface Change {
  id: string;
  date: string;
  user: string;
  description: string;
  status: "completed" | "pending" | "failed";
}

export interface Incident {
  id: string;
  date: string;
  severity: "critical" | "high" | "medium" | "low";
  description: string;
  status: "resolved" | "investigating" | "mitigated";
  resolvedDate?: string;
}

export interface Pipeline {
  name: string;
  lastRun: string;
  lastRunBy: string;
  gitTag: string;
  status: "success" | "failed" | "running" | "cancelled";
  repository: string;
  duration: string;
  environment: string;
}

export interface Backup {
  id: string;
  database: string;
  date: string;
  size: string;
  status: "Successful" | "Completed" | "Failed";
  error?: string;
}

export interface Restore {
  id: string;
  database: string;
  date: string;
  source: string;
  status: "completed" | "in-progress" | "failed";
  completedDate?: string;
}

export interface ViewColumnDef {
  name: string;
  type:
    | "string"
    | "number"
    | "boolean"
    | "datetime"
    | "duration"
    | "health"
    | "status"
    | "gauge";
  description?: string;
  gauge?: GaugeConfig;
}

type ViewRow = any[];

export interface ViewResult {
  columns?: ViewColumnDef[];
  rows?: ViewRow[];
  panels?: PanelResult[];
}

export interface GaugeConfig {
  min: number;
  max: number;
  unit?: string;
  thresholds?: {
    value: number;
    color: string;
  }[];
}

export type PanelResult = {
  name: string;
  type: "piechart" | "number" | "text" | "table" | "gauge";
  description?: string;
  rows?: Record<string, any>[];
  gauge?: GaugeConfig;
  number?: NumberConfig;
  piechart?: PiechartConfig;
};

type NumberConfig = {
  unit: string;
  precision: number;
};

type PiechartConfig = {
  showLabels?: boolean;
  colors?: Record<string, string>;
};
