import {
  rangeOptionsCategories,
  TimeRangeOption
} from "@flanksource-ui/ui/TimeRangePicker/rangeOptions";
import { TimeRangePicker } from "@flanksource-ui/ui/TimeRangePicker/TimeRangePicker";
import dayjs from "dayjs";
import { useFormikContext } from "formik";
import { useMemo } from "react";

type FormikDurationPickerProps = {
  fieldNames: {
    from: string;
    to: string;
  };
  label: string;
  className?: string;
  placeholder?: string;
};

export default function FormikDurationPicker({
  fieldNames: { from, to },
  label,
  placeholder = "Select duration",
  className = "flex flex-col py-2"
}: FormikDurationPickerProps) {
  const { values, setFieldValue } =
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

  return (
    <div className={className}>
      {label && <label className={`form-label`}>{label}</label>}
      <div className="flex w-full flex-col">
        <TimeRangePicker
          value={value}
          placeholder={placeholder}
          onChange={(value) => {
            console.log(value, "value");
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
        />
      </div>
    </div>
  );
}
