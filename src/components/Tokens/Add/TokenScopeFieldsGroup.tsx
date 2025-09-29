import { useFormikContext } from "formik";
import { useCallback, useState, useEffect } from "react";
import { Switch } from "../../../ui/FormControls/Switch";
import { OBJECTS, getActionsForObject } from "../tokenUtils";
import { TokenFormValues } from "./CreateTokenForm";

const ScopeOptions = ["Read", "Write", "Admin", "Custom"] as const;
type ScopeType = (typeof ScopeOptions)[number];

const ObjectPermissionOptions = ["None", "Read", "Write", "Admin"] as const;
const McpPermissionOptions = ["None", "Admin"] as const;
type ObjectPermissionType = (typeof ObjectPermissionOptions)[number];
type McpPermissionType = (typeof McpPermissionOptions)[number];

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
  const getCurrentPermission = (): ObjectPermissionType | McpPermissionType => {
    const objectActions = values.objectActions;

    // Special handling for MCP setup mode
    if (isMcpSetup && object === "mcp") {
      return "Admin"; // Pre-select Admin (which maps to mcp:*) for MCP setup
    }

    if (object === "mcp") {
      return objectActions["mcp:*"] ? "Admin" : "None";
    }

    if (object === "playbooks") {
      const playbookActions = [
        "playbook:run",
        "playbook:approve",
        "playbook:cancel"
      ];
      const hasAllPlaybookActions = playbookActions.every(
        (action) => objectActions[`${object}:${action}`]
      );
      const hasCrud = ["read", "create", "update", "delete"].every(
        (action) => objectActions[`${object}:${action}`]
      );

      if (hasCrud && hasAllPlaybookActions) return "Admin";
      if (objectActions[`${object}:read`] && objectActions[`${object}:create`])
        return "Write";
      if (objectActions[`${object}:read`]) return "Read";
      return "None";
    }

    // For other objects (non-mcp, non-playbooks)
    const hasCrud = ["read", "create", "update", "delete"].every(
      (action) => objectActions[`${object}:${action}`]
    );
    if (hasCrud) return "Admin";
    if (objectActions[`${object}:read`] && objectActions[`${object}:create`])
      return "Write";
    if (objectActions[`${object}:read`]) return "Read";
    return "None";
  };

  const [selectedPermission, setSelectedPermission] = useState(() =>
    getCurrentPermission()
  );

  // Handle initial MCP setup - apply the mcp:* permission when component mounts
  useEffect(() => {
    if (isMcpSetup && object === "mcp" && selectedPermission === "Admin") {
      setFieldValue(
        "objectActions",
        (currentObjectActions: Record<string, boolean>) => {
          const newObjectActions = { ...currentObjectActions };
          newObjectActions["mcp:*"] = true;
          return newObjectActions;
        }
      );
    }
  }, [isMcpSetup, object, selectedPermission, setFieldValue]);

  const handlePermissionChange = useCallback(
    (permission: string) => {
      const newPermission = permission as
        | ObjectPermissionType
        | McpPermissionType;
      setSelectedPermission(newPermission);

      // Update the objectActions in form state
      setFieldValue(
        "objectActions",
        (currentObjectActions: Record<string, boolean>) => {
          const newObjectActions = { ...currentObjectActions };
          const actions = getActionsForObject(object);

          // Reset all actions for this object first
          actions.forEach((action) => {
            newObjectActions[`${object}:${action}`] = false;
          });

          // Apply the selected permission level
          if (newPermission !== "None") {
            if (object === "mcp") {
              // MCP only has Admin option (maps to *)
              if (newPermission === "Admin") {
                newObjectActions["mcp:*"] = true;
              }
            } else if (object === "playbooks") {
              if (newPermission === "Read") {
                newObjectActions[`${object}:read`] = true;
              } else if (newPermission === "Write") {
                newObjectActions[`${object}:read`] = true;
                newObjectActions[`${object}:create`] = true;
              } else if (newPermission === "Admin") {
                // For playbooks Admin: CRUD + all 3 specific playbook actions
                ["read", "create", "update", "delete"].forEach((action) => {
                  newObjectActions[`${object}:${action}`] = true;
                });
                ["playbook:run", "playbook:approve", "playbook:cancel"].forEach(
                  (action) => {
                    newObjectActions[`${object}:${action}`] = true;
                  }
                );
              }
            } else {
              // For other objects
              if (newPermission === "Read") {
                newObjectActions[`${object}:read`] = true;
              } else if (newPermission === "Write") {
                newObjectActions[`${object}:read`] = true;
                newObjectActions[`${object}:create`] = true;
              } else if (newPermission === "Admin") {
                ["read", "create", "update", "delete"].forEach((action) => {
                  newObjectActions[`${object}:${action}`] = true;
                });
              }
            }
          }

          return newObjectActions;
        }
      );
    },
    [object, setFieldValue]
  );

  // Get the appropriate options based on object type
  const getOptionsForObject = () => {
    if (object === "mcp") {
      return McpPermissionOptions as unknown as string[];
    }
    return ObjectPermissionOptions as unknown as string[];
  };

  return (
    <div className="flex flex-row items-center space-x-4">
      <label className="w-20 flex-shrink-0 text-sm font-medium text-gray-800">
        {object}
      </label>
      <div className="flex flex-row">
        <Switch
          options={getOptionsForObject()}
          defaultValue="None"
          value={selectedPermission as string}
          onChange={handlePermissionChange}
        />
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
  Admin: (() => {
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
  const { setFieldValue } = useFormikContext<TokenFormValues>();

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

      if (newScope !== "Custom") {
        // Use setFieldValue with a function to get current values
        setFieldValue(
          "objectActions",
          (currentObjectActions: Record<string, boolean>) => {
            const newObjectActions: Record<string, boolean> = {};

            // Reset all scopes first
            Object.keys(currentObjectActions).forEach((key) => {
              newObjectActions[key] = false;
            });

            // Apply the selected preset
            Object.assign(newObjectActions, SCOPE_MAPPINGS[newScope]);

            return newObjectActions;
          }
        );
      }
      // Note: For Custom mode, individual ObjectPermissionSwitch components handle their own state
      // For MCP setup, the individual ObjectPermissionSwitch for mcp will handle the pre-selection
    },
    [setFieldValue]
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
