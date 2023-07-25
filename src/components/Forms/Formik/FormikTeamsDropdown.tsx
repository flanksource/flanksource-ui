import { useMemo } from "react";
import { useGetAllTeams } from "../../../api/query-hooks/responders";
import FormikSelectDropdown from "./FormikSelectDropdown";

type FormikEventsDropdownProps = {
  name: string;
  label?: string;
  required?: boolean;
  hint?: string;
};

export default function FormikTeamsDropdown({
  name,
  label,
  required = false,
  hint
}: FormikEventsDropdownProps) {
  const { data: teams, isLoading } = useGetAllTeams();

  const options = useMemo(
    () =>
      teams?.map((team) => ({
        label: team.name,
        value: team.id
      })),
    [teams]
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
