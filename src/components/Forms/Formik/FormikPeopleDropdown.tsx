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
        label: person.name,
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
