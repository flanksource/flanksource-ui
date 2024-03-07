import { TimeRangePicker } from "@flanksource-ui/ui/TimeRangePicker";
import useTimeRangeParams from "@flanksource-ui/ui/TimeRangePicker/useTimeRangeParams";
import { useSearchParams } from "react-router-dom";

type Props = {
  paramsToReset?: string[];
};

export default function ConfigChangesDateRangeFilter({
  paramsToReset = []
}: Props) {
  const [params, setParams] = useSearchParams();
  const { setTimeRangeParams, getTimeRangeFromUrl } = useTimeRangeParams();

  const timeRangeValue = getTimeRangeFromUrl();

  return (
    <TimeRangePicker
      onChange={(timeRange) => {
        console.log("timeRange", timeRange);
        setTimeRangeParams(timeRange);
        paramsToReset.forEach((param) => params.delete(param));
        setParams(params);
      }}
      className="w-[35rem]"
      value={timeRangeValue}
    />
  );
}
