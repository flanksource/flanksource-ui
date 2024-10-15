import { TextInput } from "@flanksource-ui/ui/FormControls/TextInput";
import { useField } from "formik";
import { useState } from "react";

type DurationUnit = "nanoseconds" | "milliseconds" | "seconds" | "minutes";

const units = ["nanoseconds", "milliseconds", "seconds", "minutes"] as const;

const unitsMap = {
  nanoseconds: 1,
  milliseconds: 1000000,
  seconds: 1000000000,
  minutes: 60000000000
} as const;

type FormikDurationNanosecondsFieldProps = {
  fieldName: string;
  className?: string;
  label?: string;
};

export default function FormikDurationNanosecondsField({
  fieldName,
  label,
  className = "flex flex-col py-2"
}: FormikDurationNanosecondsFieldProps) {
  const [field] = useField<number>({
    name: fieldName
  });

  const value = field.value;

  console.log("value", value);

  const [unit, setUnit] = useState<DurationUnit>("nanoseconds");

  return (
    <div className={className}>
      {label && <label className={`form-label`}>{label}</label>}
      <div className="flex flex-row">
        <TextInput
          type="number"
          name={fieldName}
          className="flex-1 rounded-l-md rounded-r-none border-b border-l border-t"
          onChange={(e) => {
            const value = parseInt(e.target.value);
            const multiplier = unitsMap[unit];
            const nanoseconds = value * multiplier;
            field.onChange({
              target: {
                name: fieldName,
                value: nanoseconds
              }
            });
          }}
          id={fieldName}
        />
        <select
          onChange={(e) => {
            const previousMultiplier = unitsMap[unit];
            setUnit(e.target.value as DurationUnit);

            // Convert the value to the new unit
            const multiplier = unitsMap[e.target.value as DurationUnit];
            const updatedValue = value / previousMultiplier;
            const nanoseconds = updatedValue * multiplier;
            field.onChange({
              target: {
                name: fieldName,
                value: nanoseconds
              }
            });
          }}
          className="w-1/5 rounded-r-md border-b border-r border-t border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          {units.map((unit) => (
            <option key={unit} value={unit}>
              {unit}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
