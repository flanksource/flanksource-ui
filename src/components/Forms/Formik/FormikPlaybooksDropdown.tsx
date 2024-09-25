import { useGetPlaybookNames } from "@flanksource-ui/api/query-hooks/playbooks";
import PlaybookSpecIcon from "@flanksource-ui/components/Playbooks/Settings/PlaybookSpecIcon";
import { useMemo } from "react";
import FormikSelectDropdown from "./FormikSelectDropdown";

type FormikPlaybooksDropdownProps = {
  name: string;
  label?: string;
  required?: boolean;
  hint?: string;
  className?: string;
};

export default function FormikPlaybooksDropdown({
  name,
  label,
  required = false,
  hint,
  className = "flex flex-col space-y-2 py-2"
}: FormikPlaybooksDropdownProps) {
  const { isLoading, data: checks } = useGetPlaybookNames();

  const options = useMemo(
    () =>
      checks?.map((playbook) => ({
        label: playbook.title || playbook.name,
        value: playbook.id,
        icon: <PlaybookSpecIcon playbook={playbook} />
      })),
    [checks]
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
