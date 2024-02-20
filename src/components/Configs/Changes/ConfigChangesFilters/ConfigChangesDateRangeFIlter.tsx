import { TimeRangePicker } from "@flanksource-ui/ui/TimeRangePicker";
import useTimeRangeParams from "@flanksource-ui/ui/TimeRangePicker/useTimeRangeParams";
import { URLSearchParamsInit, useSearchParams } from "react-router-dom";

type Props = {
  paramsToReset?: string[];
};

export const configChangesDefaultDateFilter: URLSearchParamsInit = {
  rangeType: "relative",
  display: "7 days",
  duration: "604800"
};

export default function ConfigChangesDateRangeFilter({
  paramsToReset = []
}: Props) {
  const [params, setParams] = useSearchParams();

  const { setTimeRangeParams, getTimeRangeFromUrl } = useTimeRangeParams(
    configChangesDefaultDateFilter
  );

  const timeRangeValue = getTimeRangeFromUrl();

  return (
    <TimeRangePicker
      onChange={(timeRange) => {
        console.log("timeRange", timeRange);
        setTimeRangeParams(timeRange);
        paramsToReset.forEach((param) => params.delete(param));
        setParams(params);
      }}
      value={timeRangeValue}
    />
  );
}
