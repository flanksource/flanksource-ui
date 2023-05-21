import { UserGroupIcon } from "@heroicons/react/solid";
import { HealthIcon } from "../Icons/HealthIcon";
import { AlarmIcon } from "../Icons/AlarmIcon";
import { SearchInListIcon } from "../Icons/SearchInListIcon";
import { TopologyIcon } from "../Icons/TopologyIcon";
import { resources } from "../../services/permissions/resources";
import { IconType } from "react-icons";
import React from "react";

export type SchemaResourceType = {
  name:
    | "Teams"
    | "Rules"
    | "Config Scraper"
    | "Health Check"
    | "Search"
    | "Topology"
    | "Connections"
    | "Log Backends";
  table:
    | "teams"
    | "incident_rules"
    | "config_scrapers"
    | "canaries"
    | "topologies"
    | "connections"
    | "logging_backends";
  api: "incident-commander" | "canary-checker" | "config-db";
  resourceName: string;
  icon: React.ComponentType<any> | IconType;
  subNav: {
    label: string;
    value: string;
  }[];
  fields: {
    name: "name" | "spec" | "icon" | "labels" | "namespace" | "schedule";
    default?: any;
    hidden?: boolean;
  }[];
};

export type SchemaResourceTypes = SchemaResourceType[];

export type SchemaBackends = SchemaResourceType["api"];

export type SchemaApi = Pick<SchemaResourceType, "api" | "table">;

export const schemaResourceTypes: SchemaResourceType[] = [
  {
    name: "Teams",
    table: "teams",
    api: "incident-commander",
    icon: UserGroupIcon,
    resourceName: resources["settings.teams"],
    subNav: [
      {
        label: "Spec",
        value: "spec"
      },
      {
        label: "Members",
        value: "manageTeam"
      },
      {
        label: "Job History",
        value: "jobHistory"
      }
    ],
    fields: [
      {
        name: "name",
        default: undefined,
        hidden: false
      },
      {
        name: "spec",
        default: {}
      },
      {
        name: "icon",
        default: "group"
      }
    ]
  },
  {
    name: "Rules",
    table: "incident_rules",
    api: "incident-commander",
    icon: AlarmIcon,
    resourceName: resources["settings.rules"],
    subNav: [
      {
        label: "Spec",
        value: "spec"
      },
      {
        label: "Job History",
        value: "jobHistory"
      }
    ],
    fields: [
      {
        name: "name",
        default: undefined,
        hidden: false
      },
      {
        name: "spec",
        default: {}
      }
    ]
  },
  {
    name: "Config Scraper",
    table: "config_scrapers",
    api: "config-db",
    icon: SearchInListIcon,
    resourceName: resources["settings.config_scraper"],
    subNav: [
      {
        label: "Spec",
        value: "spec"
      },
      {
        label: "Job History",
        value: "jobHistory"
      }
    ],
    fields: [
      {
        name: "name",
        default: undefined,
        hidden: false
      },
      {
        name: "spec",
        default: {}
      }
    ]
  },
  {
    name: "Topology",
    table: "topologies",
    api: "canary-checker",
    icon: TopologyIcon,
    resourceName: resources["settings.topology"],
    subNav: [
      {
        label: "Spec",
        value: "spec"
      },
      {
        label: "Job History",
        value: "jobHistory"
      }
    ],
    fields: [
      {
        name: "name",
        default: undefined,
        hidden: false
      },
      {
        name: "namespace",
        default: "default"
      },
      {
        name: "labels",
        default: {}
      },
      {
        name: "spec",
        default: {}
      }
    ]
  },
  {
    name: "Health Check",
    table: "canaries",
    api: "canary-checker",
    icon: HealthIcon,
    resourceName: resources["settings.health"],
    subNav: [
      {
        label: "Spec",
        value: "spec"
      },
      {
        label: "Job History",
        value: "jobHistory"
      }
    ],
    fields: [
      {
        name: "name",
        default: undefined,
        hidden: true
      },
      {
        name: "namespace",
        default: "default"
      },
      // {
      //   name: "schedule",
      //   default: undefined
      // },
      {
        name: "labels",
        default: {}
      },
      {
        name: "spec",
        default: {}
      }
    ]
  }
];
