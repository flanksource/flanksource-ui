import { UserGroupIcon } from "@heroicons/react/solid";
import { HealthIcon } from "../Icons/HealthIcon";
import { AlarmIcon } from "../Icons/AlarmIcon";
import { SearchInListIcon } from "../Icons/SearchInListIcon";
import { TopologyIcon } from "../Icons/TopologyIcon";

type ArrayElem<T> = T extends readonly (infer E)[] ? E : never;

type ArrayPick<
  T extends readonly any[],
  idx extends [any],
  Acc = never
> = T extends readonly [infer head, ...infer tail]
  ? idx[0] extends keyof head
    ? ArrayPick<tail, idx, Acc | Pick<head, idx[0]>>
    : `Err: Is not key of head?: ${idx & string}`
  : Acc;

export type SchemaResourceTypes = typeof schemaResourceTypes;

export type SchemaResourceType = ArrayElem<SchemaResourceTypes>;

export type SchemaBackends = SchemaResourceType["api"];

export type SchemaApi = ArrayPick<SchemaResourceTypes, ["table" | "api"]>;

export const schemaResourceTypes = [
  {
    name: "Teams",
    table: "teams",
    api: "incident-commander",
    icon: UserGroupIcon
  },
  {
    name: "Rules",
    table: "incident_rules",
    api: "incident-commander",
    icon: AlarmIcon
  },
  {
    name: "Config Scraper",
    table: "config_scraper",
    api: "config-db",
    icon: SearchInListIcon
  },
  {
    name: "Topology",
    table: "templates",
    api: "canary-checker",
    icon: TopologyIcon
  },
  {
    name: "Health",
    table: "canaries",
    api: "canary-checker",
    icon: HealthIcon
  }
] as const;
