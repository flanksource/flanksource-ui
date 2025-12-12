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

  accessControl?: AccessControl;
  backups?: Backup[];
  changes?: Change[];
  cost?: Cost;
  findings?: Finding[];
  incidents?: Incident[];
  lifecycle?: string;
  locations?: Location[];
  monitoring?: MonitoringMetrics;
  sections?: ViewResult[];
  repositories?: Repository[];
  restores?: Restore[];
  version?: Version;
}

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

/**
 * Configuration for config item column behavior
 * @source github.com/flanksource/duty/view/columns.go
 */
export interface ConfigItemColumnType {
  /**
   * The field to use as the ID for config items.
   * Defaults to "id" if not specified.
   */
  idField?: string;
}

/**
 * URL configuration for columns
 * @source github.com/flanksource/duty/view/columns.go
 */
export interface ColumnURL {
  /**
   * CEL expression for config references
   */
  config?: string;
  /**
   * View URL reference details
   */
  view?: ViewURLRef;
}

/**
 * View URL reference details
 * @source github.com/flanksource/duty/view/columns.go
 */
export interface ViewURLRef {
  [key: string]: any;
}

/**
 * Filter configuration for view columns
 * @source github.com/flanksource/duty/view/columns.go
 */
interface ViewColumnDefFilter {
  /**
   * The type of filter to apply
   */
  type: "multiselect";
}

/**
 * Color source configuration for badges
 * @source github.com/flanksource/duty/view/columns.go
 */
export interface ColorSource {
  /**
   * Auto indicates UI uses heuristics to determine color based on value
   */
  auto?: boolean;

  /**
   * Map defines explicit color mappings for specific values
   */
  map?: Record<string, string>;
}

/**
 * Badge configuration for columns
 * @source github.com/flanksource/duty/view/columns.go
 */
export interface BadgeConfig {
  /**
   * Color configuration for the badge
   */
  color?: ColorSource;
}

/**
 * Card display configuration for columns
 * @source github.com/flanksource/duty/view/columns.go
 */
export interface CardConfig {
  /**
   * Defines where the field is displayed on the card.
   * Omit this to hide the field but still have it affect the card (e.g., for accent).
   */
  position?: "title" | "subtitle" | "deck" | "body" | "footer" | "headerRight";

  /**
   * Determines if this column's value should be used to color the card accent divider.
   * Only one column should have this set to true.
   * The column's value will be analyzed using heuristics to determine the appropriate color.
   */
  useForAccent?: boolean;
}

/**
 * Column definition for view tables
 * @source github.com/flanksource/duty/view/columns.go
 */
export interface ViewColumnDef {
  /**
   * The name of the column
   */
  name: string;

  /**
   * Marks this column as a primary key
   */
  primaryKey?: boolean;

  /**
   * Filter configuration for this column
   */
  filter?: ViewColumnDefFilter;

  /**
   * Width of the column (weight like "2" or fixed like "150px")
   */
  width?: string;

  /**
   * The data type of the column
   */
  type:
    | "string"
    | "number"
    | "boolean"
    | "datetime"
    | "duration"
    | "health"
    | "status"
    | "gauge"
    | "bytes"
    | "decimal"
    | "millicore"
    | "config_item"
    | "labels"
    | "row_attributes"
    | "grants";

  /**
   * Description of the column
   */
  description?: string;

  /**
   * Gauge visualization configuration
   */
  gauge?: GaugeConfig;

  /**
   * Configuration for config item columns
   */
  configItem?: ConfigItemColumnType;

  /**
   * Badge configuration for the column
   */
  badge?: BadgeConfig;

  /**
   * Whether the column is hidden from display
   */
  hidden?: boolean;

  /**
   * Unit of measurement for the column value
   */
  unit?: string;

  /**
   * Icon to display for this column
   */
  icon?: string;

  /**
   * URL configuration for the column
   */
  url?: ColumnURL;

  /**
   * @deprecated Use a different approach
   */
  for?: string;

  /**
   * Card display configuration
   */
  card?: CardConfig;

  /**
   * @deprecated Use card.position instead
   */
  cardPosition?:
    | "title"
    | "subtitle"
    | "body"
    | "footer"
    | "deck"
    | "headerRight";
}

export type ViewRow = any[];

export interface ViewVariable {
  key: string;
  value: string;
  type: string;
  options: string[];
  default?: string;
  label?: string;
}

export interface DisplayCard {
  // Columns defines the number of columns for the card body layout
  columns: number;

  // Default indicates if cards should be the default display mode
  default?: boolean;
}

export interface DisplayTable {
  sort?: string;
  size?: number;
}

/**
 * Filter options for a column.
 * For regular columns, list contains distinct values.
 * For labels columns, labels contains keys mapped to their possible values.
 */
export interface ColumnFilterOptions {
  list?: string[];
  labels?: Record<string, string[]>;
}

export interface ViewRef {
  namespace?: string;
  name: string;
}

export interface ViewSection {
  title: string;
  icon?: string;
  viewRef: ViewRef;
}

export interface ViewResult {
  title?: string;
  icon?: string;
  namespace?: string;
  name: string;

  lastRefreshedAt?: string;
  columns?: ViewColumnDef[];
  rows?: ViewRow[];
  panels?: PanelResult[];
  columnOptions?: Record<string, ColumnFilterOptions>;
  variables?: ViewVariable[];
  card?: DisplayCard;
  table?: DisplayTable;
  requestFingerprint: string;
  sections?: ViewSection[];
}

export interface GaugeThreshold {
  percent: number;
  color: string;
}

export type GaugeUnit =
  | "bytes"
  | "millicore"
  | "millicores"
  | "percent"
  | (string & {});

export interface GaugeConfig {
  min: number;
  max: number;
  unit?: GaugeUnit;
  thresholds?: GaugeThreshold[];
  precision?: number;
}

export interface BarGaugeConfig {
  min: number;
  max: number;
  unit?: GaugeUnit;
  thresholds?: GaugeThreshold[];
  precision?: number;
  format?: "percentage" | "multiplier";
  group?: string;
}

export type PanelResult = {
  name: string;
  type:
    | "piechart"
    | "number"
    | "text"
    | "table"
    | "gauge"
    | "duration"
    | "bargauge"
    | "properties"
    | "playbooks";
  description?: string;
  rows?: Record<string, any>[];
  gauge?: GaugeConfig;
  bargauge?: BarGaugeConfig;
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
