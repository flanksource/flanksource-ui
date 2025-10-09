import { useFormikContext, FieldArray } from "formik";
import FormikKeyValueMapField from "@flanksource-ui/components/Forms/Formik/FormikKeyValueMapField";
import FormikSelectDropdown from "@flanksource-ui/components/Forms/Formik/FormikSelectDropdown";
import FormikTextArea from "@flanksource-ui/components/Forms/Formik/FormikTextArea";
import { Button } from "@flanksource-ui/ui/Buttons/Button";
import { Badge } from "@flanksource-ui/ui/Badge/Badge";
import { useAllAgentNamesQuery } from "@flanksource-ui/api/query-hooks";
import { useMemo } from "react";
import { FaPlus, FaTrash, FaInfoCircle } from "react-icons/fa";
import { ResourceType } from "./AccessScopeResourcesSelect";

type AccessScopeCriteriaFormProps = {
  disabled?: boolean;
};

type FieldVisibility = {
  tagsDisabled: boolean;
  namesDisabled: boolean;
  agentsDisabled: boolean;
  tagsHint?: string;
  namesHint?: string;
  agentsHint?: string;
};

// Define which fields each resource type supports
const RESOURCE_FIELD_SUPPORT: Record<
  Exclude<ResourceType, "*">,
  { tags: boolean; names: boolean; agents: boolean }
> = {
  config: { tags: true, names: true, agents: true },
  playbook: { tags: false, names: true, agents: false },
  canary: { tags: false, names: true, agents: true },
  component: { tags: false, names: true, agents: true }
};

function getFieldVisibility(resources: ResourceType[]): FieldVisibility {
  // If no resources selected, disable all fields
  if (!resources || resources.length === 0) {
    return {
      tagsDisabled: true,
      namesDisabled: true,
      agentsDisabled: true
    };
  }

  // If "All Resources" is selected, show hints for fields that don't apply to all
  if (resources.includes("*")) {
    const getUnsupportedResources = (field: "tags" | "names" | "agents") => {
      return Object.entries(RESOURCE_FIELD_SUPPORT)
        .filter(([_, support]) => !support[field])
        .map(([resource]) => resource)
        .join(", ");
    };

    return {
      tagsDisabled: false,
      namesDisabled: false,
      agentsDisabled: false,
      tagsHint: `Ignored by ${getUnsupportedResources("tags")} when checking scope`,
      agentsHint: `Ignored by ${getUnsupportedResources("agents")} when checking scope`
    };
  }

  // For specific resources, check support
  const specificResources = resources.filter(
    (r): r is Exclude<ResourceType, "*"> => r !== "*"
  );

  // Check if ANY resource supports each field (for enabling)
  // and if ALL resources support it (for showing warning)
  let anySupportTags = false;
  let anySupportNames = false;
  let anySupportAgents = false;
  let allSupportTags = true;
  let allSupportNames = true;
  let allSupportAgents = true;

  for (const resource of specificResources) {
    const support = RESOURCE_FIELD_SUPPORT[resource];
    anySupportTags = anySupportTags || support.tags;
    anySupportNames = anySupportNames || support.names;
    anySupportAgents = anySupportAgents || support.agents;
    allSupportTags = allSupportTags && support.tags;
    allSupportNames = allSupportNames && support.names;
    allSupportAgents = allSupportAgents && support.agents;
  }

  // Get list of SELECTED resources that DON'T support each field for hints
  const getNotApplicableResources = (field: "tags" | "names" | "agents") => {
    const notApplicable = specificResources.filter(
      (resource) => !RESOURCE_FIELD_SUPPORT[resource][field]
    );
    return notApplicable.join(", ");
  };

  return {
    tagsDisabled: !anySupportTags,
    namesDisabled: !anySupportNames,
    agentsDisabled: !anySupportAgents,
    tagsHint: !allSupportTags
      ? `Ignored by ${getNotApplicableResources("tags")} when checking scope`
      : undefined,
    namesHint: !allSupportNames
      ? `Ignored by ${getNotApplicableResources("names")} when checking scope`
      : undefined,
    agentsHint: !allSupportAgents
      ? `Ignored by ${getNotApplicableResources("agents")} when checking scope`
      : undefined
  };
}

export default function AccessScopeCriteriaForm({
  disabled = false
}: AccessScopeCriteriaFormProps) {
  const { values, errors, touched, submitCount } = useFormikContext<any>();
  const scopes = values.scopes || [];
  const scopesError = errors.scopes;
  const scopesTouched = touched.scopes;
  const showError = (scopesTouched || submitCount > 0) && scopesError;

  const { data: agents } = useAllAgentNamesQuery({});
  const agentOptions = useMemo(
    () =>
      (agents || []).map((agent: any) => ({
        label: agent.name || agent.id,
        value: agent.id
      })),
    [agents]
  );

  const fieldVisibility = useMemo(
    () => getFieldVisibility(values.resources || []),
    [values.resources]
  );

  return (
    <FieldArray name="scopes">
      {({ push, remove }) => (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="form-label">Scopes</label>
            {!disabled && (
              <Button
                text="Add Scope"
                icon={<FaPlus />}
                className="btn-secondary btn-sm"
                onClick={() => push({ tags: {}, agents: [], names: "" })}
              />
            )}
          </div>

          {/* Info banner explaining AND/OR logic */}
          <div className="rounded-md border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900">
            <p className="mb-1 font-medium">How scopes work:</p>
            <ul className="list-inside list-disc space-y-1">
              <li>
                <strong>Within a scope:</strong> Tags AND Agents AND Names (all
                must match)
              </li>
              <li>
                <strong>Between scopes:</strong> Scope 1 OR Scope 2 OR Scope 3
                (any can match)
              </li>
              <li>
                At least one scope is required, and each scope must have at
                least one field filled.
              </li>
            </ul>
          </div>

          {/* Display scopes validation error */}
          {showError && typeof scopesError === "string" && (
            <p className="w-full py-1 text-sm text-red-500">{scopesError}</p>
          )}

          {scopes.length === 0 && (
            <div className="rounded border-2 border-dashed py-6 text-center text-sm text-gray-500">
              No scopes defined. Click &quot;Add Scope&quot; to create one.
            </div>
          )}

          {scopes.map((scope: any, index: number) => (
            <div
              key={index}
              className="rounded border border-gray-300 bg-gray-50 p-3"
            >
              <div className="mb-2 flex items-center justify-end gap-2">
                {/* Display per-scope validation error */}
                {(() => {
                  const error =
                    showError &&
                    Array.isArray(scopesError) &&
                    scopesError[index];
                  return (
                    error &&
                    typeof error === "string" && (
                      <p className="text-sm text-red-500">{error}</p>
                    )
                  );
                })()}
                {scopes.length > 1 && !disabled && (
                  <Button
                    icon={<FaTrash />}
                    className="btn-danger-base btn-sm"
                    onClick={() => remove(index)}
                    aria-label={`Remove scope ${index + 1}`}
                  />
                )}
              </div>

              <div className="space-y-2">
                <div
                  className={
                    disabled || fieldVisibility.tagsDisabled
                      ? "pointer-events-none opacity-60"
                      : ""
                  }
                >
                  <div className="mb-2 flex items-center gap-2">
                    <label className="form-label mb-0">Tags</label>
                    {fieldVisibility.tagsHint && (
                      <div className="flex items-center gap-1.5 text-xs text-orange-600">
                        <FaInfoCircle className="flex-shrink-0" />
                        <span>{fieldVisibility.tagsHint}</span>
                      </div>
                    )}
                  </div>
                  <FormikKeyValueMapField
                    name={`scopes.${index}.tags`}
                    label=""
                    hint="Resources must match ALL these tags"
                  />
                </div>

                <div
                  className={
                    fieldVisibility.agentsDisabled
                      ? "pointer-events-none opacity-60"
                      : ""
                  }
                >
                  <div className="mb-2 flex items-center gap-2">
                    <label className="form-label mb-0">Agents</label>
                    {fieldVisibility.agentsHint && (
                      <div className="flex items-center gap-1.5 text-xs text-orange-600">
                        <FaInfoCircle className="flex-shrink-0" />
                        <span>{fieldVisibility.agentsHint}</span>
                      </div>
                    )}
                  </div>
                  <FormikSelectDropdown
                    name={`scopes.${index}.agents`}
                    label=""
                    options={agentOptions}
                    isMulti
                    hint="Resources must be from ANY of these agents"
                    isDisabled={disabled || fieldVisibility.agentsDisabled}
                  />
                </div>

                <div
                  className={
                    disabled || fieldVisibility.namesDisabled
                      ? "pointer-events-none opacity-60"
                      : ""
                  }
                >
                  <div className="mb-2 flex items-center gap-2">
                    <label className="form-label mb-0">Names</label>
                    {fieldVisibility.namesHint && (
                      <div className="flex items-center gap-1.5 text-xs text-orange-600">
                        <FaInfoCircle className="flex-shrink-0" />
                        <span>{fieldVisibility.namesHint}</span>
                      </div>
                    )}
                  </div>
                  {scope.names &&
                    scope.names.trim().length > 0 &&
                    (() => {
                      const names = scope.names
                        .split("\n")
                        .map((n: string) => n.trim())
                        .filter(Boolean);

                      return (
                        <div className="mb-2 rounded border border-gray-200 bg-gray-50 p-2">
                          <div className="flex flex-wrap gap-1">
                            {names.map((name: string, nameIndex: number) => (
                              <Badge
                                key={nameIndex}
                                text={name}
                                color="blue"
                                size="sm"
                              />
                            ))}
                          </div>
                        </div>
                      );
                    })()}
                  <FormikTextArea
                    name={`scopes.${index}.names`}
                    placeholder="Enter resource names, one per line, or * for all"
                    hint="Enter one resource name per line for exact matches. Use * alone to match all resources."
                    rows={4}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </FieldArray>
  );
}
