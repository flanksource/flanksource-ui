import {
  rangeOptionsCategories,
  TimeRangeOption
} from "@flanksource-ui/ui/Dates/TimeRangePicker/rangeOptions";
import { TimeRangePicker } from "@flanksource-ui/ui/Dates/TimeRangePicker/TimeRangePicker";
import dayjs from "dayjs";
import { useFormikContext } from "formik";
import { useMemo } from "react";
import { FormikTextInputProps } from "./FormikTextInput";
import clsx from "clsx";
import { Label } from "@flanksource-ui/ui/FormControls/Label";

type FormikDurationPickerProps = {
  fieldNames: {
    from: string;
    to: string;
  };
  placeholder?: string;
} & Omit<FormikTextInputProps, "name">;

export default function FormikDurationPicker({
  fieldNames: { from, to },
  label,
  placeholder = "Select duration",
  className = "flex flex-col py-2",
  required,
  hint,
  hintPosition = "bottom"
}: FormikDurationPickerProps) {
  const { values, setFieldValue, errors } =
    useFormikContext<Record<string, string | undefined>>();

  const value = useMemo(() => {
    // if until is a valid date, then, set time range value to and from
    if (dayjs(values[to]).isValid()) {
      return {
        display: "Custom",
        from: values[from] ?? "",
        to: values[to] ?? "",
        type: "absolute"
      } satisfies TimeRangeOption;
    }

    const relativeValues = rangeOptionsCategories.find(
      (category) =>
        category.name === "Relative time ranges" && category.type === "future"
    )?.options;

    return {
      type: "relative",
      display: values[to]
        ? relativeValues?.find(
            (v) => v.type === "relative" && v.range === values[to]
          )?.display!
        : "",
      range: values[to] ?? ""
    } satisfies TimeRangeOption;
  }, [from, to, values]);

  const hasError = errors[from] || errors[to];

  return (
    <div className={className}>
      <Label label={label} required={required} />
      <div className="flex w-full flex-col">
        <TimeRangePicker
          required={required}
          value={value}
          placeholder={placeholder}
          onChange={(value) => {
            if (value.type === "absolute") {
              setFieldValue(from, value.from);
              setFieldValue(to, value.to);
            } else if (value.type === "relative") {
              setFieldValue(to, value.range);
              setFieldValue(from, "now");
            }
          }}
          showFutureTimeRanges
          className="w-full"
          buttonClassName={clsx(
            hasError && "border-red-500  hover:bg-gray-50 "
          )}
        />

        {errors[from] ? (
          <p className="w-full py-1 text-sm text-red-500">{errors[from]}</p>
        ) : null}

        {errors[to] ? (
          <p className="w-full py-1 text-sm text-red-500">{errors[to]}</p>
        ) : null}
        {hint && hintPosition === "bottom" && (
          <p className="py-1 text-sm text-gray-500">{hint}</p>
        )}
      </div>
    </div>
  );
}
