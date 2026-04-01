// ABOUTME: Modal for selecting scopes to impersonate or defining custom targets.
// ABOUTME: Persists selections in sessionStorage, attaching them as a header on all API requests.

import { useScopesQuery } from "@flanksource-ui/api/query-hooks/useScopesQuery";
import {
  ScopeDisplay,
  ScopeTargetForm
} from "@flanksource-ui/api/types/scopes";
import { Switch } from "@flanksource-ui/ui/FormControls/Switch";
import { Modal } from "@flanksource-ui/ui/Modal";
import { Form, Formik } from "formik";
import { useMemo, useState } from "react";
import Select from "react-select";
import ScopeTargetsForm from "../Forms/ScopeTargetsForm";
import { ImpersonationMode } from "./scopeImpersonationStore";
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

const DEFAULT_TARGET: ScopeTargetForm = {
  config: {
    name: "",
    agent: "",
    tagSelector: "",
    tags: {},
    wildcard: false
  }
};

const MODE_OPTIONS = ["Existing Scopes", "Custom Targets"] as const;

function modeToOption(mode: ImpersonationMode): (typeof MODE_OPTIONS)[number] {
  return mode === "scopes" ? "Existing Scopes" : "Custom Targets";
}

function optionToMode(option: string): ImpersonationMode {
  return option === "Existing Scopes" ? "scopes" : "targets";
}

export default function ScopeImpersonationModal({ isOpen, onClose }: Props) {
  const { data: scopes, isLoading } = useScopesQuery();
  const {
    scopeIds: impersonatedIds,
    targets: impersonatedTargets,
    mode: storedMode,
    active,
    setScopes,
    setTargets,
    clear
  } = useImpersonatedScopes();

  const [mode, setMode] = useState<ImpersonationMode>("scopes");
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
    setMode(storedMode);
    const initial = options.filter((o) => impersonatedIds.includes(o.value));
    setSelected(initial);
    setInitialized(true);
  }
  if (!isOpen && initialized) {
    setInitialized(false);
  }

  function handleApplyScopes() {
    setScopes(selected.map((o) => o.scope));
    onClose();
  }

  function handleReset() {
    clear();
    setSelected([]);
    onClose();
  }

  const initialTargets =
    storedMode === "targets" && impersonatedTargets.length > 0
      ? impersonatedTargets
      : [DEFAULT_TARGET];

  return (
    <Modal
      title="Impersonate Scope"
      open={isOpen}
      onClose={onClose}
      size="medium"
      bodyClass="flex flex-col flex-1 overflow-y-auto p-4"
    >
      <div className="flex flex-col gap-4">
        <Switch
          options={[...MODE_OPTIONS]}
          value={modeToOption(mode)}
          onChange={(val) => setMode(optionToMode(val))}
        />

        {active && (
          <p className="text-xs text-green-600">
            Scope impersonation is active (
            {storedMode === "scopes"
              ? `${impersonatedIds.length} scope${impersonatedIds.length !== 1 ? "s" : ""}`
              : "custom targets"}
            )
          </p>
        )}

        {mode === "scopes" ? (
          <>
            <p className="text-sm text-gray-600">
              Select existing scopes to impersonate.
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
          </>
        ) : (
          <Formik<{ targets: ScopeTargetForm[] }>
            initialValues={{ targets: initialTargets }}
            onSubmit={(values) => {
              setTargets(values.targets);
              onClose();
            }}
          >
            {({ submitForm }) => (
              <Form className="flex flex-col gap-4">
                <p className="text-sm text-gray-600">
                  Define custom targets to impersonate.
                </p>
                <ScopeTargetsForm />
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
                    onClick={submitForm}
                  >
                    Apply
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        )}
      </div>
    </Modal>
  );
}
