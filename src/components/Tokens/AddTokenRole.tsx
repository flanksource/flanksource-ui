import { getRoles } from "@flanksource-ui/api/services/roles";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import CreatableSelect from "react-select/creatable";

type Option = { label: string; value: string };

/** Picks a Role to add to a token: one the caller may read, or any other typed as namespace/name. */
export function AddTokenRole({
  boundRoles,
  disabled = false,
  onAdd
}: {
  /** Roles already in the token's list, as namespace/name, which aren't offered */
  boundRoles: string[];
  disabled?: boolean;
  /** Called with the Role as namespace/name */
  onAdd: (role: string) => void;
}) {
  const [invalid, setInvalid] = useState<string>();
  const { data: roles = [], isFetching } = useQuery({
    queryKey: ["roles"],
    queryFn: getRoles
  });

  const options = Array.from(
    new Set(
      roles
        .filter((role) => role.namespace)
        .map((role) => `${role.namespace}/${role.name}`)
    )
  )
    .filter((reference) => !boundRoles.includes(reference))
    .map((reference) => ({ label: reference, value: reference }));

  return (
    <div className="flex flex-col gap-1">
      <CreatableSelect<Option>
        className="text-sm"
        inputId="add-token-role"
        aria-label="Role to add"
        placeholder="Add a role, or enter namespace/name"
        options={options}
        isLoading={isFetching}
        isDisabled={disabled}
        value={null}
        onChange={(option) => {
          if (!option) return;
          if (!/^[^\s/]+\/[^\s/]+$/.test(option.value)) {
            setInvalid(option.value);
            return;
          }
          setInvalid(undefined);
          if (!boundRoles.includes(option.value)) onAdd(option.value);
        }}
        formatCreateLabel={(input) => `Add ${input}`}
        menuPortalTarget={document.body}
        styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
      />
      {invalid && (
        <p className="text-xs text-red-600">
          Enter the role as namespace/name, not {invalid}
        </p>
      )}
    </div>
  );
}
