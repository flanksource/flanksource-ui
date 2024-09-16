import { getCanaryNames } from "@flanksource-ui/api/services/topology";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import FormikSelectDropdown from "./FormikSelectDropdown";

type FormikCanaryDropdownProps = {
  name: string;
  label?: string;
  required?: boolean;
  hint?: string;

  className?: string;
};

export default function FormikCanaryDropdown({
  name,
  label,
  required = false,
  hint,
  className = "flex flex-col space-y-2 py-2"
}: FormikCanaryDropdownProps) {
  const { isLoading, data: canary } = useQuery({
    queryKey: ["canaries", "canary_names"],
    queryFn: () => getCanaryNames()
  });

  const options = useMemo(
    () =>
      canary?.map((canary) => ({
        label: canary.name,
        value: canary.id
      })),
    [canary]
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
