import {
  ReactSelectDropdown,
  StateOption
} from "@flanksource-ui/components/ReactSelectDropdown";
import { useField } from "formik";

export const durationOptions: Record<
  string,
  StateOption & {
    valueInMillis?: number;
  }
> = {
  None: {
    label: "None",
    value: "none"
  },
  "15s": {
    label: "15 seconds",
    value: "15s",
    valueInMillis: 15 * 1000
  },
  "30s": {
    label: "30 seconds",
    value: "30s",
    valueInMillis: 30 * 1000
  },
  "60s": {
    label: "1 minute",
    value: "60s",
    valueInMillis: 60 * 1000
  },
  "2m": {
    label: "2 minutes",
    value: "2m",
    valueInMillis: 2 * 60 * 1000
  },
  "3m": {
    label: "3 minutes",
    value: "3m",
    valueInMillis: 3 * 60 * 1000
  },
  "5m": {
    label: "5 minutes",
    value: "5m",
    valueInMillis: 5 * 60 * 1000
  },
  "10m": {
    label: "10 minutes",
    value: "10m",
    valueInMillis: 10 * 60 * 1000
  },
  "15m": {
    label: "15 minutes",
    value: "15m",
    valueInMillis: 15 * 60 * 1000
  }
};

export default function JobHistoryDurationDropdown() {
  const [field] = useField({
    name: "duration"
  });

  return (
    <div className="flex flex-col">
      <ReactSelectDropdown
        name="duration"
        label=""
        value={field.value ?? "none"}
        items={durationOptions}
        className="inline-block p-3 w-auto max-w-[500px]"
        dropDownClassNames="w-auto max-w-[400px] left-0"
        onChange={(val) => {
          if (val && val !== "none") {
            field.onChange({ target: { value: val, name: field.name } });
          } else {
            field.onChange({ target: { value: undefined, name: field.name } });
          }
        }}
        prefix={<span className="text-xs">Duration:</span>}
      />
    </div>
  );
}
