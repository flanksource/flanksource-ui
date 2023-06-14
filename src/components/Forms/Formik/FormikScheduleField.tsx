import FormikAutocompleteDropdown from "./FormikAutocompleteDropdown";

type Props = {
  name: string;
};

export default function FormikScheduleField({ name }: Props) {
  return (
    <FormikAutocompleteDropdown
      name={name}
      label="Schedule"
      required
      options={[
        {
          label: "@every 30s",
          value: "@every 30s"
        },
        {
          label: "@every 1m",
          value: "@every 1m"
        },
        {
          label: "@every 5m",
          value: "@every 5m"
        },
        {
          label: "@every 30m",
          value: "@every 30m"
        },
        {
          label: "@hourly",
          value: "@hourly"
        },
        {
          label: "@every 6h",
          value: "@every 6h"
        },
        {
          label: "@daily",
          value: "@daily"
        },
        {
          label: "@weekly",
          value: "@weekly"
        }
      ]}
    />
  );
}
