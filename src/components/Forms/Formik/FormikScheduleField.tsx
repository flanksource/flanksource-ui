import FormikAutocompleteDropdown, {
  FormikSelectDropdownProps
} from "./FormikAutocompleteDropdown";

const types = {
  short: [
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
      label: "@every 2h",
      value: "@every 2h"
    },
    {
      label: "@every 4h",
      value: "@every 4h"
    }
  ],

  scraper: [
    {
      label: "@every 15m",
      value: "@every 15m"
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
      label: "@every 2h",
      value: "@every 2h"
    },
    {
      label: "@every 4h",
      value: "@every 4h"
    },

    {
      label: "@daily",
      value: "@daily"
    }
  ],
  medium: [
    {
      label: "@every 5m",
      value: "@every 5m"
    },
    {
      label: "@every 15m",
      value: "@every 15m"
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
      label: "@every 2h",
      value: "@every 2h"
    },
    {
      label: "@every 4h",
      value: "@every 4h"
    },
    {
      label: "@every 6h",
      value: "@every 6h"
    },
    {
      label: "@every 8h",
      value: "@every 8h"
    }
  ],

  default: [
    {
      label: "@every 30s",
      value: "@every 30s"
    },
    {
      label: "@every 1m",
      value: "@every 1m"
    },
    {
      label: "@every 15m",
      value: "@every 15m"
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
      label: "@every 2h",
      value: "@every 2h"
    },
    {
      label: "@every 4h",
      value: "@every 4h"
    },
    {
      label: "@every 6h",
      value: "@every 6h"
    },
    {
      label: "@every 8h",
      value: "@every 8h"
    },
    {
      label: "@daily",
      value: "@daily"
    },
    {
      label: "@weekly",
      value: "@weekly"
    }
  ]
};

type Props = {
  type?: keyof typeof types;
} & Omit<FormikSelectDropdownProps, "options">;

export default function FormikScheduleField({
  label = "Schedule",
  type = "default",
  ...props
}: Props) {
  return (
    <FormikAutocompleteDropdown
      label={label}
      options={types[type]}
      {...props}
    />
  );
}
