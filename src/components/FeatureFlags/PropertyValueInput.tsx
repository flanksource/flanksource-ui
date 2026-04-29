import {
  humanToNanoseconds,
  nanosecondsToHuman
} from "@flanksource-ui/utils/date";
import { Toggle } from "@flanksource-ui/ui/FormControls/Toggle";
import { TextInput } from "@flanksource-ui/ui/FormControls/TextInput";
import { useField } from "formik";
import { useMemo } from "react";
import CreatableSelect from "react-select/creatable";

type PropertyValueInputProps = {
  name: string;
  propertyType?: "bool" | "int" | "duration" | "string";
  label?: string;
  disabled?: boolean;
};

const DURATION_OPTIONS = [
  "5s",
  "30s",
  "1m",
  "5m",
  "10m",
  "15m",
  "30m",
  "1h",
  "2h",
  "4h",
  "8h",
  "1d",
  "3d",
  "7d",
  "30d"
];

function DurationInput({
  name,
  disabled
}: {
  name: string;
  disabled?: boolean;
}) {
  const [field, , helpers] = useField<string>(name);

  const displayValue = useMemo(() => {
    if (field.value === "" || field.value == null) return null;
    const human = nanosecondsToHuman(field.value);
    if (!human) return null;
    return { label: human, value: human };
  }, [field.value]);

  return (
    <CreatableSelect<{ label: string; value: string }>
      className="rounded-md border-gray-300 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
      isDisabled={disabled}
      value={displayValue}
      placeholder="e.g. 5m, 1h, 1d"
      options={DURATION_OPTIONS.map((v) => ({ label: v, value: v }))}
      onChange={(selected) => {
        if (!selected) {
          helpers.setValue("");
          return;
        }
        const ns = humanToNanoseconds(selected.value);
        helpers.setValue(ns !== null ? String(ns) : selected.value);
      }}
      isClearable={Boolean(field.value)}
      menuPortalTarget={
        typeof document !== "undefined" ? document.body : undefined
      }
      styles={{
        menuPortal: (base) => ({ ...base, zIndex: 9999 })
      }}
      menuPosition="fixed"
      menuShouldBlockScroll
    />
  );
}

export default function PropertyValueInput({
  name,
  propertyType,
  label,
  disabled
}: PropertyValueInputProps) {
  const [field, , helpers] = useField<string>(name);

  const labelEl = label ? (
    <label htmlFor={name} className="mb-1 text-sm font-medium text-gray-700">
      {label}
    </label>
  ) : null;

  if (propertyType === "bool") {
    const boolValue = field.value === "true";
    return (
      <div className="flex flex-col gap-1">
        {labelEl}
        <Toggle
          value={boolValue}
          disabled={disabled}
          onChange={(val) => helpers.setValue(String(val))}
        />
      </div>
    );
  }

  if (propertyType === "duration") {
    return (
      <div className="flex flex-col gap-1">
        {labelEl}
        <DurationInput name={name} disabled={disabled} />
      </div>
    );
  }

  if (propertyType === "int") {
    return (
      <div className="flex flex-col gap-1">
        {labelEl}
        <TextInput
          id={name}
          type="number"
          disabled={disabled}
          value={field.value ?? ""}
          onChange={(e) => helpers.setValue(e.target.value)}
        />
      </div>
    );
  }

  // string or unknown
  return (
    <div className="flex flex-col gap-1">
      {labelEl}
      <TextInput
        id={name}
        type="text"
        disabled={disabled}
        value={field.value ?? ""}
        onChange={(e) => helpers.setValue(e.target.value)}
      />
    </div>
  );
}
