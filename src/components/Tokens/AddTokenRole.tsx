import { getRoles } from "@flanksource-ui/api/services/roles";
import { TokenRole } from "@flanksource-ui/api/services/tokens";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import CreatableSelect from "react-select/creatable";
import { Button } from "../../ui/Buttons/Button";

type Option = { label: string; value: string };

/** Picks a Role to bind a token to: one the caller may read, or any other typed as namespace/name. */
export function AddTokenRole({
  boundRoles,
  disabled = false,
  onAdd
}: {
  /** Roles the token is already bound to, as namespace/name, which aren't offered */
  boundRoles: string[];
  disabled?: boolean;
  onAdd: (role: TokenRole) => void;
}) {
  const [selected, setSelected] = useState<Option | null>(null);
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

  const valid = !!selected && /^[^\s/]+\/[^\s/]+$/.test(selected.value);

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <CreatableSelect<Option>
          className="flex-1 text-sm"
          inputId="add-token-role"
          aria-label="Role to add"
          placeholder="Add a role, or enter namespace/name"
          options={options}
          isLoading={isFetching}
          isClearable
          value={selected}
          onChange={setSelected}
          formatCreateLabel={(input) => `Add ${input}`}
          menuPortalTarget={document.body}
          styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
        />
        <Button
          text="Add"
          className="btn-primary"
          disabled={disabled || !valid}
          onClick={() => {
            const [namespace, name] = selected!.value.split("/");
            onAdd({ namespace, name });
            setSelected(null);
          }}
        />
      </div>
      {selected && !valid && (
        <p className="text-xs text-red-600">Enter the role as namespace/name</p>
      )}
    </div>
  );
}
