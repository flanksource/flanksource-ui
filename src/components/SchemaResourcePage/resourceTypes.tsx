import { UserGroupIcon } from "@heroicons/react/solid";
import { HealthIcon } from "../Icons/HealthIcon";
import { AlarmIcon } from "../Icons/AlarmIcon";
import { SearchInListIcon } from "../Icons/SearchInListIcon";
import { TopologyIcon } from "../Icons/TopologyIcon";
import { $ArrayElemType, $ArrayPick } from "../../types/utility";
import { resources } from "../../services/permissions/resources";

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
    resouceName: resources["settings.teams"],
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
    resouceName: resources["settings.rules"],
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
    resouceName: resources["settings.config_scraper"],
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
    table: "templates",
    api: "canary-checker",
    icon: TopologyIcon,
    resouceName: resources["settings.topology"],
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
    resouceName: resources["settings.health"],
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
] as const;
