import { UserGroupIcon } from "@heroicons/react/solid";

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

export type SchemaResource = ArrayElem<SchemaResourceTypes>;

export type SchemaBackends = SchemaResource["api"];

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
    table: "rules",
    api: "incident-commander",
    icon: UserGroupIcon
  },
  {
    name: "Config Scraper",
    table: "config_scrapers",
    api: "config-db",
    icon: UserGroupIcon
  },
  {
    name: "System Templates",
    table: "system_templates",
    api: "canary-checker",
    icon: UserGroupIcon
  },
  {
    name: "Components",
    table: "components",
    api: "canary-checker",
    icon: UserGroupIcon
  },
  {
    name: "Health Checks",
    table: "health_checks",
    api: "canary-checker",
    icon: UserGroupIcon
  }
] as const;
