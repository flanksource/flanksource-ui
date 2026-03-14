// ABOUTME: Modal for selecting scopes to impersonate.
// ABOUTME: Persists selections in sessionStorage, attaching them as a header on all API requests.

import { useScopesQuery } from "@flanksource-ui/api/query-hooks/useScopesQuery";
import { Modal } from "@flanksource-ui/ui/Modal";
import { useMemo, useState } from "react";
import Select from "react-select";
import { useImpersonatedScopes } from "./useImpersonatedScopes";
import { ScopeDisplay } from "@flanksource-ui/api/types/scopes";

type ScopeOption = {
  value: string; // scope UUID
  label: string;
  scope: ScopeDisplay;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ScopeImpersonationModal({ isOpen, onClose }: Props) {
  const { data: scopes, isLoading } = useScopesQuery();
  const { scopeIds: impersonatedIds, set, clear } = useImpersonatedScopes();

  const [selected, setSelected] = useState<ScopeOption[]>([]);
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
    const initial = options.filter((o) => impersonatedIds.includes(o.value));
    setSelected(initial);
    setInitialized(true);
  }
  if (!isOpen && initialized) {
    setInitialized(false);
  }

  function handleApply() {
    set(selected.map((o) => o.scope));
    onClose();
  }

  function handleReset() {
    clear();
    setSelected([]);
    onClose();
  }

  return (
    <Modal
      title="Impersonate Scope"
      open={isOpen}
      onClose={onClose}
      size="small"
      bodyClass="flex flex-col flex-1 overflow-y-auto p-4"
      actions={[
        <button
          key="reset"
          type="button"
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          onClick={handleReset}
        >
          Reset
        </button>,
        <button
          key="apply"
          type="button"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          onClick={handleApply}
        >
          Apply
        </button>
      ]}
    >
      <div className="flex flex-col gap-3">
        <p className="text-sm text-gray-600">
          Select scopes to impersonate. All API requests will be scoped to the
          selected scopes until you reset.
        </p>
        <Select
          isMulti
          isLoading={isLoading}
          className="text-sm"
          placeholder="Select scopes..."
          options={options}
          value={selected}
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
          onChange={(opts) => setSelected([...opts])}
        />
        {impersonatedIds.length > 0 && (
          <p className="text-xs text-orange-600">
            Currently impersonating {impersonatedIds.length} scope
            {impersonatedIds.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>
    </Modal>
  );
}
