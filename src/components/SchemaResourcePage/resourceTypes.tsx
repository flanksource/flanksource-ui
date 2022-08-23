import { UserGroupIcon } from "@heroicons/react/solid";
import { HealthIcon } from "../Icons/HealthIcon";
import { AlarmIcon } from "../Icons/AlarmIcon";
import { SearchInListIcon } from "../Icons/SearchInListIcon";
import { TopologyIcon } from "../Icons/TopologyIcon";
import { $ArrayElemType, $ArrayPick } from "src/types/utility";

export type SchemaResourceTypes = typeof schemaResourceTypes;

export type SchemaResourceType = $ArrayElemType<SchemaResourceTypes>;

export type SchemaBackends = SchemaResourceType["api"];

export type SchemaApi = $ArrayPick<SchemaResourceTypes, ["table" | "api"]>;

export const schemaResourceTypes = [
  {
    name: "Teams",
    table: "teams",
    api: "incident-commander",
    icon: UserGroupIcon,
    supportsIcon: true
  },
  {
    name: "Rules",
    table: "incident_rules",
    api: "incident-commander",
    icon: AlarmIcon,
    supportsIcon: false
  },
  {
    name: "Config Scraper",
    table: "config_scrapers",
    api: "config-db",
    icon: SearchInListIcon,
    supportsIcon: false
  },
  {
    name: "Topology",
    table: "templates",
    api: "canary-checker",
    icon: TopologyIcon,
    supportsIcon: false
  },
  {
    name: "Health",
    table: "canaries",
    api: "canary-checker",
    icon: HealthIcon,
    supportsIcon: false
  }
] as const;
