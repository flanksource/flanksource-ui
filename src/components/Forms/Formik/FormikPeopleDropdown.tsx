import { useMemo } from "react";
import { useGetAllPeople } from "../../../api/query-hooks/responders";
import FormikSelectDropdown from "./FormikSelectDropdown";

type FormikEventsDropdownProps = {
  name: string;
  label?: string;
  required?: boolean;
  hint?: string;
};

export default function FormikPeopleDropdown({
  name,
  label,
  required = false,
  hint
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
      className="h-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 rounded-md"
      options={options}
      label={label}
      isLoading={isLoading}
      required={required}
      hint={hint}
    />
  );
}
