// This picker only names stored Scopes; request limits never accept client-authored selectors.

import { useScopesQuery } from "@flanksource-ui/api/query-hooks/useScopesQuery";
import { ScopeDisplay } from "@flanksource-ui/api/types/scopes";
import { Modal } from "@flanksource-ui/ui/Modal";
import { useMemo, useState } from "react";
import Select from "react-select";
import { useImpersonatedScopes } from "./useImpersonatedScopes";

type ScopeOption = {
  value: string;
  label: string;
  scope: ScopeDisplay;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

/** Selects existing Scopes to narrow this session's requests without changing its grants. */
export default function ScopeImpersonationModal({ isOpen, onClose }: Props) {
  const { data: scopes, isLoading } = useScopesQuery();
  const {
    scopeIds: impersonatedIds,
    active,
    setScopes,
    clear
  } = useImpersonatedScopes();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [initialized, setInitialized] = useState(false);

  const options: ScopeOption[] = useMemo(() => {
    if (!scopes) return [];
    return scopes.map((s) => ({
      value: s.id,
      label: s.namespace ? `${s.namespace}/${s.name}` : s.name,
      scope: s
    }));
  }, [scopes]);

  // Sync local state from stored impersonation when modal opens
  if (isOpen && !initialized) {
    setSelectedIds(impersonatedIds);
    setInitialized(true);
  }
  if (!isOpen && initialized) {
    setInitialized(false);
  }

  function handleApplyScopes() {
    setScopes(selectedIds);
    onClose();
  }

  function handleReset() {
    clear();
    setSelectedIds([]);
    onClose();
  }

  return (
    <Modal
      title="Impersonate Scope"
      open={isOpen}
      onClose={onClose}
      size="medium"
      bodyClass="flex flex-col flex-1 overflow-y-auto p-4"
    >
      <div className="flex flex-col gap-4">
        {active && (
          <p className="text-xs text-green-600">
            Scope impersonation is active ({impersonatedIds.length} scope
            {impersonatedIds.length !== 1 ? "s" : ""})
          </p>
        )}

        <p className="text-sm text-gray-600">
          Limit requests to resources in any of the selected scopes. Your
          existing permissions still apply. Reset to remove the limit.
        </p>
        <Select
          aria-label="Scopes"
          isMulti
          isLoading={isLoading}
          className="text-sm"
          menuPortalTarget={
            typeof document !== "undefined" ? document.body : undefined
          }
          menuPosition="fixed"
          menuShouldBlockScroll
          styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
          placeholder="Select scopes..."
          options={options}
          value={options.filter((option) => selectedIds.includes(option.value))}
          formatOptionLabel={(option: ScopeOption) => (
            <div className="flex items-center justify-between gap-2">
              <span>{option.scope.name}</span>
              {option.scope.namespace && (
                <span className="text-xs text-gray-500">
                  {option.scope.namespace}
                </span>
              )}
            </div>
          )}
          onChange={(opts) =>
            setSelectedIds(opts.map((option) => option.value))
          }
        />
        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            onClick={handleReset}
          >
            Reset
          </button>
          <button
            type="button"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            onClick={handleApplyScopes}
          >
            Apply
          </button>
        </div>
      </div>
    </Modal>
  );
}
