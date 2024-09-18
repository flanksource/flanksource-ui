import { TimeRangePicker } from "@flanksource-ui/ui/Dates/TimeRangePicker";
import useTimeRangeParams from "@flanksource-ui/ui/Dates/TimeRangePicker/useTimeRangeParams";
import { URLSearchParamsInit } from "react-router-dom";

type Props = {
  paramsToReset?: string[];
};

export const configChangesDefaultDateFilter: URLSearchParamsInit = {
  rangeType: "relative",
  display: "2 days",
  range: "now-2d"
};

export default function ConfigChangesDateRangeFilter({
  paramsToReset = []
}: Props) {
  const { setTimeRangeParams, getTimeRangeFromUrl } = useTimeRangeParams(
    configChangesDefaultDateFilter
  );

  const timeRangeValue = getTimeRangeFromUrl();

  return (
    <TimeRangePicker
      onChange={(timeRange) => setTimeRangeParams(timeRange, paramsToReset)}
      value={timeRangeValue}
    />
  );
}
