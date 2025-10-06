import { useMemo } from "react";
import { useGetAllPeople } from "../../../api/query-hooks/responders";
import FormikSelectDropdown from "./FormikSelectDropdown";

type FormikEventsDropdownProps = {
  name: string;
  label?: string;
  required?: boolean;
  hint?: string;
  className?: string;
};

export default function FormikPeopleDropdown({
  name,
  label,
  required = false,
  hint,
  className = "flex flex-col space-y-2 py-2"
}: FormikEventsDropdownProps) {
  const { data: people, isLoading } = useGetAllPeople();

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
