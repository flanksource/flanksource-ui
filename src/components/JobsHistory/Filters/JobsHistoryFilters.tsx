import FormikFilterForm from "@flanksource-ui/components/Forms/FormikFilterForm";
import { TimeRangePicker } from "@flanksource-ui/ui/TimeRangePicker";
import useTimeRangeParams from "@flanksource-ui/ui/TimeRangePicker/useTimeRangeParams";
import { URLSearchParamsInit } from "react-router-dom";
import JobHistoryDurationDropdown from "./JobHistoryDurationDropdown";
import JobHistoryNamesDropdown from "./JobHistoryNames";
import JobHistoryResourceTypeDropdown from "./JobHistoryResourceTypeDropdown";
import JobHistoryStatusDropdown from "./JobHistoryStatusDropdown";

export const jobHistoryDefaultDateFilter: URLSearchParamsInit = {
  rangeType: "relative",
  display: "2 days",
  range: "now-2d"
};

type JobHistoryFiltersProps = {
  paramsToReset?: string[];
};

export default function JobHistoryFilters({
  paramsToReset = ["pageIndex", "pageSize"]
}: JobHistoryFiltersProps) {
  const { setTimeRangeParams, getTimeRangeFromUrl } = useTimeRangeParams(
    jobHistoryDefaultDateFilter
  );

  const timeRangeValue = getTimeRangeFromUrl();

  return (
    <FormikFilterForm
      paramsToReset={paramsToReset}
      filterFields={["name", "resource_type", "status", "duration"]}
      defaultFieldValues={{
        status: "FINISHED:-1,SUCCESS:-1"
      }}
    >
      <div className="flex flex-wrap gap-2 py-4">
        <JobHistoryNamesDropdown />

        <JobHistoryResourceTypeDropdown />

        <JobHistoryStatusDropdown />

        <JobHistoryDurationDropdown />

        <div className="flex flex-col">
          <TimeRangePicker
            onChange={(timeRange) =>
              setTimeRangeParams(timeRange, paramsToReset)
            }
            className="w-[35rem]"
            value={timeRangeValue}
          />
        </div>
      </div>
    </FormikFilterForm>
  );
}
