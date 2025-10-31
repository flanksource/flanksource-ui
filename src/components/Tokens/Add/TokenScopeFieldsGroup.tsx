import { useFormikContext } from "formik";
import { useCallback, useState, useEffect } from "react";
import { QuestionMarkCircleIcon } from "@heroicons/react/solid";
import { Switch } from "../../../ui/FormControls/Switch";
import { OBJECTS, getActionsForObject } from "../tokenUtils";
import { TokenFormValues } from "./CreateTokenForm";

const ScopeOptions = ["Read", "Write", "Full", "Custom"] as const;
type ScopeType = (typeof ScopeOptions)[number];

// Scope level descriptions
const SCOPE_DESCRIPTIONS: Record<Exclude<ScopeType, "Custom">, string> = {
  Read: `Grant read-only access to all resources (${OBJECTS.join(", ")})`,
  Write: `Grant read and create permissions for all resources (${OBJECTS.join(", ")})`,
  Full: `Grant full access (read, create, update, delete) to all resources (${OBJECTS.join(", ")})`
};

// Permission level descriptions for each object type
const PERMISSION_DESCRIPTIONS: Record<string, Record<string, string>> = {
  configs: {
    None: "No access to configuration items",
    Read: "View configuration items and their details",
    Write: "View and create configuration items",
    Full: "Full control: view, create, update, and delete configs"
  },
  canaries: {
    None: "No access to health checks",
    Read: "View health checks and their status",
    Write: "View and create health checks",
    Full: "Full control: view, create, update, and delete health checks"
  },
  components: {
    None: "No access to topology components",
    Read: "View topology components and relationships",
    Write: "View and create topology components",
    Full: "Full control: view, create, update, and delete components"
  },
  incidents: {
    None: "No access to incidents",
    Read: "View incidents and their details",
    Write: "View and create incidents",
    Full: "Full control: view, create, update, and delete incidents"
  },
  playbooks: {
    None: "No access to playbooks",
    Read: "View playbook definitions",
    Run: "View and execute playbooks",
    Approve: "View, run, and approve playbook executions",
    Write: "Full control: view, run, approve, create, and delete playbooks"
  },
  people: {
    None: "No access to people/team members",
    Read: "View people and team member details",
    Write: "View and add people",
    Full: "Full control: view, add, update, and remove people"
  },
  teams: {
    None: "No access to teams",
    Read: "View teams and their members",
    Write: "View and create teams",
    Full: "Full control: view, create, update, and delete teams"
  },
  connections: {
    None: "No access to connections",
    Read: "View connection configurations",
    Write: "View and create connections",
    Full: "Full control: view, create, update, and delete connections"
  },
  notifications: {
    None: "No access to notifications",
    Read: "View notification settings",
    Write: "View and create notifications",
    Full: "Full control: view, create, update, and delete notifications"
  },
  config_items: {
    None: "No access to catalog items",
    Read: "View catalog items",
    Write: "View and create catalog items",
    Full: "Full control: view, create, update, and delete catalog items"
  },
  logs: {
    None: "No access to logs",
    Read: "View and search logs",
    Write: "View and export logs",
    Full: "Full control: view, export, and manage logs"
  },
  mcp: {
    None: "No access to MCP (Model Context Protocol)",
    Full: "Full access to MCP servers and tools"
  }
};

const ObjectPermissionOptions = ["None", "Read", "Write", "Full"] as const;
const McpPermissionOptions = ["None", "Full"] as const;
const PlaybookPermissionOptions = [
  "None",
  "Read",
  "Run",
  "Approve",
  "Write"
] as const;
type ObjectPermissionType = (typeof ObjectPermissionOptions)[number];
type McpPermissionType = (typeof McpPermissionOptions)[number];
type PlaybookPermissionType = (typeof PlaybookPermissionOptions)[number];

// Component for individual object permission selection
type ObjectPermissionSwitchProps = {
  object: string;
  isMcpSetup?: boolean;
};

function ObjectPermissionSwitch({
  object,
  isMcpSetup
}: ObjectPermissionSwitchProps) {
  const { setFieldValue, values } = useFormikContext<TokenFormValues>();

  // Determine current permission level for this object
  const getCurrentPermission = ():
    | ObjectPermissionType
    | McpPermissionType
    | PlaybookPermissionType => {
    const objectActions = values.objectActions;

    // Special handling for MCP setup mode
    if (isMcpSetup && object === "mcp") {
      return "Full"; // Pre-select Full (which maps to mcp:*) for MCP setup
    }

    if (object === "mcp") {
      return objectActions["mcp:*"] ? "Full" : "None";
    }

    if (object === "playbooks") {
      // Write: read + create + delete + playbook:run + playbook:approve
      const hasWrite =
        objectActions[`${object}:read`] &&
        objectActions[`${object}:create`] &&
        objectActions[`${object}:delete`] &&
        objectActions[`${object}:playbook:run`] &&
        objectActions[`${object}:playbook:approve`];

      // Approve: read + playbook:run +  playbook:approve
      const hasApprove =
        objectActions[`${object}:read`] &&
        objectActions[`${object}:playbook:run`] &&
        objectActions[`${object}:playbook:approve`];

      // Run: read + playbook:run + playbook:cancel
      const hasRun =
        objectActions[`${object}:read`] &&
        objectActions[`${object}:playbook:run`];

      // Read: just read
      const hasRead = objectActions[`${object}:read`];

      if (hasWrite) return "Write";
      if (hasApprove) return "Approve";
      if (hasRun) return "Run";
      if (hasRead) return "Read";
      return "None";
    }

    // For other objects (non-mcp, non-playbooks)
    const hasCrud = ["read", "create", "update", "delete"].every(
      (action) => objectActions[`${object}:${action}`]
    );
    if (hasCrud) return "Full";
    if (objectActions[`${object}:read`] && objectActions[`${object}:create`])
      return "Write";
    if (objectActions[`${object}:read`]) return "Read";
    return "None";
  };

  const [selectedPermission, setSelectedPermission] = useState(() =>
    getCurrentPermission()
  );

  const handlePermissionChange = useCallback(
    (permission: string) => {
      const newPermission = permission as
        | ObjectPermissionType
        | McpPermissionType
        | PlaybookPermissionType;
      setSelectedPermission(newPermission);

      // Get current objectActions and create a new copy
      const newObjectActions = { ...values.objectActions };
      const actions = getActionsForObject(object);

      // Reset all actions for this object first
      actions.forEach((action) => {
        newObjectActions[`${object}:${action}`] = false;
      });

      // Apply the selected permission level
      if (newPermission !== "None") {
        if (object === "mcp") {
          // MCP only has Full option (maps to *)
          if (newPermission === "Full") {
            newObjectActions["mcp:*"] = true;
          }
        } else if (object === "playbooks") {
          // Each level includes all previous levels
          if (newPermission === "Read") {
            newObjectActions[`${object}:read`] = true;
          } else if (newPermission === "Run") {
            // Run = Read + playbook:run
            newObjectActions[`${object}:read`] = true;
            newObjectActions[`${object}:playbook:run`] = true;
          } else if (newPermission === "Approve") {
            // Approve = Run + playbook:approve
            newObjectActions[`${object}:read`] = true;
            newObjectActions[`${object}:playbook:run`] = true;
            newObjectActions[`${object}:playbook:approve`] = true;
          } else if (newPermission === "Write") {
            // Write = Approve + create + delete
            newObjectActions[`${object}:read`] = true;
            newObjectActions[`${object}:playbook:run`] = true;
            newObjectActions[`${object}:playbook:approve`] = true;
            newObjectActions[`${object}:create`] = true;
            newObjectActions[`${object}:delete`] = true;
          }
        } else {
          // For other objects
          if (newPermission === "Read") {
            newObjectActions[`${object}:read`] = true;
          } else if (newPermission === "Write") {
            newObjectActions[`${object}:read`] = true;
            newObjectActions[`${object}:create`] = true;
          } else if (newPermission === "Full") {
            ["read", "create", "update", "delete"].forEach((action) => {
              newObjectActions[`${object}:${action}`] = true;
            });
          }
        }
      }

      // Update form state with the new object
      setFieldValue("objectActions", newObjectActions);
    },
    [object, setFieldValue, values.objectActions]
  );

  // Get the appropriate options based on object type
  const getOptionsForObject = () => {
    if (object === "mcp") {
      return McpPermissionOptions as unknown as string[];
    }
    if (object === "playbooks") {
      return PlaybookPermissionOptions as unknown as string[];
    }
    return ObjectPermissionOptions as unknown as string[];
  };

  return (
    <div className="flex flex-row items-center space-x-4">
      <label className="w-20 flex-shrink-0 text-sm font-medium text-gray-800">
        {object}
      </label>
      <div className="flex flex-row items-center space-x-2">
        <Switch
          options={getOptionsForObject()}
          defaultValue="None"
          value={selectedPermission as string}
          onChange={handlePermissionChange}
        />
        <div className="group relative">
          <QuestionMarkCircleIcon
            className="h-4 w-4 cursor-help text-gray-400"
            aria-label="Permission info"
          />
          <div className="invisible absolute left-6 top-0 z-50 w-80 rounded-md bg-gray-900 px-3 py-2 text-xs text-white opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100">
            <div className="space-y-1">
              {getOptionsForObject().map((option) => (
                <div key={option}>
                  <span className="font-semibold">{option}:</span>{" "}
                  {PERMISSION_DESCRIPTIONS[object]?.[option] ||
                    "Permission level"}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Pre-calculate scope mappings outside component to avoid recalculation
const SCOPE_MAPPINGS = {
  Read: (() => {
    const scopes: Record<string, boolean> = {};
    OBJECTS.forEach((object) => {
      const actions = getActionsForObject(object);
      if (actions.includes("read")) {
        scopes[`${object}:read`] = true;
      } else if (object === "mcp" && actions.includes("*")) {
        scopes[`${object}:*`] = true;
      }
    });
    return scopes;
  })(),
  Write: (() => {
    const scopes: Record<string, boolean> = {};
    OBJECTS.forEach((object) => {
      const actions = getActionsForObject(object);
      actions.forEach((action) => {
        if (
          ["read", "create"].includes(action) ||
          (object === "mcp" && action === "*")
        ) {
          scopes[`${object}:${action}`] = true;
        }
      });
    });
    return scopes;
  })(),
  Full: (() => {
    const scopes: Record<string, boolean> = {};
    OBJECTS.forEach((object) => {
      const actions = getActionsForObject(object);
      actions.forEach((action) => {
        if (object === "playbooks") {
          scopes[`${object}:${action}`] = true;
        } else if (object === "mcp" && action === "*") {
          scopes[`${object}:${action}`] = true;
        } else if (!action.startsWith("playbook:")) {
          scopes[`${object}:${action}`] = true;
        }
      });
    });
    return scopes;
  })()
};

type TokenScopeFieldsGroupProps = {
  isMcpSetup?: boolean;
};

export default function TokenScopeFieldsGroup({
  isMcpSetup = false
}: TokenScopeFieldsGroupProps) {
  const { setFieldValue, values } = useFormikContext<TokenFormValues>();

  const [selectedScope, setSelectedScope] = useState<ScopeType>(() => {
    if (isMcpSetup) {
      return "Custom";
    }
    return "Read";
  });

  const handleScopeChange = useCallback(
    (scope: string) => {
      const newScope = scope as ScopeType;
      setSelectedScope(newScope);

      // Start with all current keys from form values
      const newObjectActions: Record<string, boolean> = {
        ...values.objectActions
      };

      // Reset all scopes to false
      Object.keys(newObjectActions).forEach((key) => {
        newObjectActions[key] = false;
      });

      if (newScope !== "Custom") {
        // Apply the selected preset (set specific keys to true)
        Object.keys(SCOPE_MAPPINGS[newScope]).forEach((key) => {
          newObjectActions[key] = SCOPE_MAPPINGS[newScope][key];
        });
      }
      // For Custom mode, all values are set to false (None)
      // Exception: MCP setup pre-selects mcp:* which is handled by ObjectPermissionSwitch

      setFieldValue("objectActions", newObjectActions);
    },
    [setFieldValue, values.objectActions]
  );

  return (
    <div className="space-y-3">
      <div className="text-sm font-medium text-gray-700">
        Scopes
        <p className="mt-1 text-xs text-gray-500">
          Select the permissions to grant to this token
        </p>
      </div>

      <div className="flex flex-col space-y-2">
        <div className="flex w-full flex-row">
          <Switch
            options={ScopeOptions as unknown as string[]}
            defaultValue={isMcpSetup ? "Custom" : "Read"}
            value={selectedScope}
            onChange={handleScopeChange}
          />
        </div>
        {selectedScope !== "Custom" && (
          <div className="rounded-md bg-blue-50 px-3 py-2 text-xs text-blue-700">
            {SCOPE_DESCRIPTIONS[selectedScope]}
          </div>
        )}
      </div>

      {selectedScope === "Custom" && (
        <div className="max-h-64 space-y-4 overflow-y-auto rounded-md border bg-gray-50 p-4">
          {OBJECTS.map((object) => (
            <ObjectPermissionSwitch
              key={object}
              object={object}
              isMcpSetup={isMcpSetup}
            />
          ))}
        </div>
      )}
    </div>
  );
}
