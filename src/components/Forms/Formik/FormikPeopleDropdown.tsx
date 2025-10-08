import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchPeopleWithRoles } from "../../../api/services/users";
import { PeopleRoles } from "../../../api/types/users";
import FormikSelectDropdown from "./FormikSelectDropdown";

type FormikEventsDropdownProps = {
  name: string;
  label?: string;
  required?: boolean;
  hint?: string;
  className?: string;
  roles?: string[];
};

export default function FormikPeopleDropdown({
  name,
  label,
  required = false,
  hint,
  className = "flex flex-col space-y-2 py-2",
  roles
}: FormikEventsDropdownProps) {
  const { data, isLoading } = useQuery<PeopleRoles[], Error>(
    ["people-roles", roles],
    async () => {
      const result = await fetchPeopleWithRoles(roles);
      return result.data ?? [];
    }
  );

  const people = data;

  const options = useMemo(
    () =>
      people?.map((person) => ({
        label: (
          <div className="flex items-center justify-between gap-2">
            <span>{person.name}</span>
            {person.email && (
              <span className="text-xs text-gray-500">{person.email}</span>
            )}
          </div>
        ),
        value: person.id
      })),
    [people]
  );

  return (
    <FormikSelectDropdown
      name={name}
      className={className}
      options={options}
      label={label}
      isLoading={isLoading}
      required={required}
      hint={hint}
    />
  );
}
