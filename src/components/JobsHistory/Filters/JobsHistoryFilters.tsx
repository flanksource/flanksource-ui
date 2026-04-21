import FormikFilterForm from "@flanksource-ui/components/Forms/FormikFilterForm";
import { TimeRangePicker } from "@flanksource-ui/ui/Dates/TimeRangePicker";
import useTimeRangeParams from "@flanksource-ui/ui/Dates/TimeRangePicker/useTimeRangeParams";
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
  showJobNameDropdown?: boolean;
  defaultStatusFilter?: string | null;
};

export default function JobHistoryFilters({
  paramsToReset = ["pageIndex", "pageSize"],
  showJobNameDropdown = true,
  defaultStatusFilter = ""
}: JobHistoryFiltersProps) {
  const { setTimeRangeParams, getTimeRangeFromUrl } = useTimeRangeParams(
    jobHistoryDefaultDateFilter
  );

  const timeRangeValue = getTimeRangeFromUrl();
  const defaultFieldValues = defaultStatusFilter
    ? { status: defaultStatusFilter }
    : undefined;

  return (
    <FormikFilterForm
      paramsToReset={paramsToReset}
      filterFields={[
        ...(showJobNameDropdown ? ["name"] : []),
        "resource_type",
        "status",
        "duration"
      ]}
      defaultFieldValues={defaultFieldValues}
    >
      <div className="flex flex-wrap gap-2 py-4">
        {showJobNameDropdown && <JobHistoryNamesDropdown />}

        <JobHistoryResourceTypeDropdown />

        <JobHistoryStatusDropdown />

        <JobHistoryDurationDropdown />

        <div className="flex flex-col">
          <TimeRangePicker
            onChange={(timeRange) =>
              setTimeRangeParams(timeRange, paramsToReset)
            }
            value={timeRangeValue}
          />
        </div>
      </div>
    </FormikFilterForm>
  );
}
