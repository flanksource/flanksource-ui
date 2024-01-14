import { useMemo } from "react";
import { useGetAllTeams } from "../../../api/query-hooks/responders";
import FormikSelectDropdown from "./FormikSelectDropdown";

type FormikEventsDropdownProps = {
  name: string;
  label?: string;
  required?: boolean;
  hint?: string;
  className?: string;
};

export default function FormikTeamsDropdown({
  name,
  label,
  required = false,
  hint,
  className = "flex flex-col space-y-2 py-2"
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
      className={className}
      options={options}
      label={label}
      isLoading={isLoading}
      required={required}
      hint={hint}
    />
  );
}
