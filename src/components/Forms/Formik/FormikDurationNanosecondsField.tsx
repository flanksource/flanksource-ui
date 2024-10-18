import dayjs from "dayjs";
import { useField } from "formik";
import { useCallback, useMemo, useState } from "react";
import CreatableSelect from "react-select/creatable";

type FormikDurationNanosecondsFieldProps = {
  name: string;
  required?: boolean;
  label?: string;
  hint?: string;
  hintPosition?: "top" | "bottom";
  isClearable?: boolean;
};
export default function FormikDurationNanosecondsField({
  name,
  required = false,
  label,
  hint,
  hintPosition = "bottom",
  isClearable = true
}: FormikDurationNanosecondsFieldProps) {
  const [isTouched, setIsTouched] = useState(false);

  const [field, meta] = useField<string>({
    name,
    type: "text",
    required,
    validate: useCallback(
      (value: string) => {
        if (required && !value) {
          return "This field is required";
        }

        // if value is less than 1 minute, show error
        if (parseInt(value, 10) < 60 * 1e9) {
          return "Duration must be greater than 1 minute";
        }
      },
      [required]
    )
  });

  const value = useMemo(() => {
    // we want to take nanoseconds and convert them to 1h, 1m, 1s
    if (!field.value) {
      return undefined;
    }

    const duration = dayjs.duration(
      parseInt(field.value, 10) / 1000000,
      "milliseconds"
    );
    return `${duration.humanize()}`;
  }, [field.value]);

  const handleOnChange = (value?: string) => {
    if (!value) {
      field.onChange({
        target: {
          name: field.name,
          value: ""
        }
      });
      return;
    }

    // we want to take 1h, 1m, 1s and convert them to nanoseconds
    let nanoseconds = 0;
    if (value.includes("h")) {
      nanoseconds = parseInt(value.replace("h", ""), 10) * 60 * 60 * 1e9;
    } else if (value.includes("m")) {
      // 1m = 60s
      nanoseconds = parseInt(value.replace("m", ""), 10) * 60 * 1e9;
    } else if (value.includes("s")) {
      nanoseconds = parseInt(value.replace("s", ""), 10) * 1e9;
    } else if (value.includes("d")) {
      nanoseconds = parseInt(value.replace("d", ""), 10) * 24 * 60 * 60 * 1e9;
    } else if (value.includes("w")) {
      nanoseconds =
        parseInt(value.replace("w", ""), 10) * 7 * 24 * 60 * 60 * 1e9;
    }

    field.onChange({
      target: {
        name: field.name,
        value: nanoseconds
      }
    });
  };

  return (
    <div className="flex flex-col">
      {label && <label className="form-label mb-0">{label}</label>}
      {hint && hintPosition === "top" && (
        <p className="text-sm text-gray-500">{hint}</p>
      )}
      <CreatableSelect<{ label: string; value: string }>
        className="h-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        onChange={(value) => {
          handleOnChange(value?.value ?? undefined);
          setIsTouched(true);
        }}
        value={[{ label: value!, value: value! }]}
        options={[
          "3m",
          "5m",
          "10m",
          "15m",
          "30m",
          "1h",
          "4h",
          "8h",
          "1d",
          "3d",
          "7d"
        ].map((value) => ({
          label: value,
          value
        }))}
        onBlur={(event) => {
          field.onBlur(event);
          setIsTouched(true);
        }}
        onFocus={(event) => {
          field.onBlur(event);
          setIsTouched(true);
        }}
        name={field.name}
        isClearable={isClearable}
        isMulti={false}
        menuPortalTarget={document.body}
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999 })
        }}
        menuPosition={"fixed"}
        menuShouldBlockScroll={true}
      />
      {hint && hintPosition === "bottom" && (
        <p className="text-sm text-gray-500">{hint}</p>
      )}
      {isTouched && meta.error ? (
        <p className="w-full py-1 text-sm text-red-500">{meta.error}</p>
      ) : null}
    </div>
  );
}
