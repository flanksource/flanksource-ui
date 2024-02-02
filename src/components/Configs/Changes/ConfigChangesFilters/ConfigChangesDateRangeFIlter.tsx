import { TimeRangePicker } from "@flanksource-ui/ui/TimeRangePicker";
import useTimeRangeParams from "@flanksource-ui/ui/TimeRangePicker/useTimeRangeParams";

export default function ConfigChangesDateRangeFilter() {
  const { setTimeRangeParams, getTimeRangeFromUrl } = useTimeRangeParams();

  const timeRangeValue = getTimeRangeFromUrl();

  return (
    <TimeRangePicker
      onChange={(timeRange) => {
        console.log("timeRange", timeRange);
        setTimeRangeParams(timeRange);
      }}
      className="w-[35rem]"
      value={timeRangeValue}
    />
  );
}
