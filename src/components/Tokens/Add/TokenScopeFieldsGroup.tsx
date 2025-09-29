import { useFormikContext } from "formik";
import { useCallback, useEffect, useState, useMemo } from "react";
import { Switch } from "../../../ui/FormControls/Switch";
import FormikCheckbox from "../../Forms/Formik/FormikCheckbox";
import { OBJECTS, getActionsForObject } from "../tokenUtils";
import { TokenFormValues } from "./CreateTokenForm";

const ScopeOptions = ["Read", "Write", "Admin", "Custom"] as const;
type ScopeType = (typeof ScopeOptions)[number];

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

// Pre-calculate object actions to avoid function calls in render
const OBJECT_ACTIONS = OBJECTS.reduce(
  (acc, object) => {
    acc[object] = getActionsForObject(object);
    return acc;
  },
  {} as Record<string, string[]>
);

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

  // Memoize the keys from objectActions to avoid dependency on the whole object
  const objectActionKeys = useMemo(() => {
    return Object.keys(values.objectActions);
  }, [values.objectActions]);

  const applyScopePreset = useCallback(
    (scope: ScopeType) => {
      let newObjectActions: Record<string, boolean> = {};

      // Reset all scopes first
      objectActionKeys.forEach((key) => {
        newObjectActions[key] = false;
      });

      if (scope !== "Custom") {
        // Use pre-calculated scope mappings
        newObjectActions = { ...newObjectActions, ...SCOPE_MAPPINGS[scope] };
      } else if (isMcpSetup) {
        // Pre-select MCP * action for MCP setup
        newObjectActions["mcp:*"] = true;
      }

      setFieldValue("objectActions", newObjectActions);
    },
    [objectActionKeys, setFieldValue, isMcpSetup]
  );

  useEffect(() => {
    applyScopePreset(selectedScope);
  }, [selectedScope, applyScopePreset]);

  const handleScopeChange = useCallback((scope: string) => {
    setSelectedScope(scope as ScopeType);
  }, []);

  return (
    <div className="space-y-3">
      <div className="text-sm font-medium text-gray-700">
        Scopes
        <p className="mt-1 text-xs text-gray-500">
          Select the permissions to grant to this token
        </p>
      </div>

      <div className="flex flex-col space-y-2">
        <label className="text-sm font-semibold">Permission Level</label>
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
            <div key={object} className="space-y-2">
              <div className="text-sm font-medium text-gray-800">{object}</div>
              <div className="grid grid-cols-4 gap-2 pl-4">
                {OBJECT_ACTIONS[object].map((action) => {
                  const scopeKey = `${object}:${action}`;
                  return (
                    <FormikCheckbox
                      key={scopeKey}
                      name={`objectActions.${scopeKey}`}
                      label={action}
                      labelClassName="text-sm font-normal text-gray-600"
                      inline={true}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedScope !== "Custom" && (
        <div className="rounded-md border bg-blue-50 p-3">
          <div className="text-sm text-blue-800">
            <strong>{selectedScope}</strong> permissions selected:
            <ul className="mt-1 list-inside list-disc text-xs">
              {selectedScope === "Read" && <li>Read access to all objects</li>}
              {selectedScope === "Write" && (
                <>
                  <li>Read access to all objects</li>
                  <li>Create access to all objects</li>
                </>
              )}
              {selectedScope === "Admin" && (
                <>
                  <li>Full CRUD access to all objects</li>
                  <li>Playbook execution permissions</li>
                </>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
