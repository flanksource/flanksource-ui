import { TimeRangePicker } from "@flanksource-ui/ui/TimeRangePicker";
import useTimeRangeParams from "@flanksource-ui/ui/TimeRangePicker/useTimeRangeParams";
import TristateReactSelect, {
  TriStateOptions
} from "@flanksource-ui/ui/TristateReactSelect/TristateReactSelect";
import dayjs from "dayjs";
import { URLSearchParamsInit, useSearchParams } from "react-router-dom";
import { ReactSelectDropdown, StateOption } from "../../ReactSelectDropdown";
import JobHistoryNamesDropdown from "./JobHistoryNames";

export const durationOptions: Record<
  string,
  StateOption & {
    valueInMillis?: number;
  }
> = {
  None: {
    label: "None",
    value: ""
  },
  "15s": {
    label: "15 seconds",
    value: "15s",
    valueInMillis: dayjs.duration(15, "seconds").asMilliseconds()
  },
  "30s": {
    label: "30 seconds",
    value: "30s",
    valueInMillis: dayjs.duration(30, "seconds").asMilliseconds()
  },
  "60s": {
    label: "1 minute",
    value: "60s",
    valueInMillis: dayjs.duration(1, "minutes").asMilliseconds()
  },
  "2m": {
    label: "2 minutes",
    value: "2m",
    valueInMillis: dayjs.duration(2, "minutes").asMilliseconds()
  },
  "3m": {
    label: "3 minutes",
    value: "3m",
    valueInMillis: dayjs.duration(3, "minutes").asMilliseconds()
  },
  "5m": {
    label: "5 minutes",
    value: "5m",
    valueInMillis: dayjs.duration(5, "minutes").asMilliseconds()
  },
  "10m": {
    label: "10 minutes",
    value: "10m",
    valueInMillis: dayjs.duration(10, "minutes").asMilliseconds()
  },
  "15m": {
    label: "15 minutes",
    value: "15m",
    valueInMillis: dayjs.duration(15, "minutes").asMilliseconds()
  }
};

const statusOptions: Record<string, TriStateOptions> = {
  finished: {
    id: "1",
    label: "Finished",
    value: "FINISHED"
  },
  running: {
    id: "2",
    label: "Running",
    value: "RUNNING"
  },
  success: {
    id: "3",
    label: "Success",
    value: "SUCCESS"
  },
  warning: {
    id: "4",
    label: "Warning",
    value: "WARNING"
  },
  failed: {
    id: "5",
    label: "Failed",
    value: "FAILED"
  }
};

export const jobHistoryResourceTypes: TriStateOptions[] = [
  {
    label: "Canary",
    value: "canary",
    id: "canary"
  },
  {
    label: "Topology",
    value: "topology",
    id: "topology"
  },
  {
    label: "Catalog Scraper",
    value: "config_scraper",
    id: "config_scrapper"
  }
];

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
  const [searchParams, setSearchParams] = useSearchParams({
    status: "FINISHED:-1,SUCCESS:-1"
  });

  const { setTimeRangeParams, getTimeRangeFromUrl } = useTimeRangeParams(
    jobHistoryDefaultDateFilter
  );

  const timeRangeValue = getTimeRangeFromUrl();

  const resourceType = searchParams.get("resource_type") ?? "";
  const status = searchParams.get("status") ?? "";
  const duration = searchParams.get("runDuration") ?? "";

  return (
    <div className="flex flex-wrap py-4 gap-2">
      <JobHistoryNamesDropdown paramsToReset={paramsToReset} />

      <div className="flex flex-col">
        <TristateReactSelect
          value={resourceType}
          options={jobHistoryResourceTypes}
          onChange={(val) => {
            if (val && val !== "All") {
              searchParams.set("resource_type", val);
            } else {
              searchParams.delete("resource_type");
            }
            paramsToReset.forEach((param) => searchParams.delete(param));
            setSearchParams(searchParams);
          }}
          label="Resource Type"
        />
      </div>
      <div className="flex flex-col">
        <TristateReactSelect
          value={status}
          options={Object.values(statusOptions)}
          onChange={(val) => {
            if (val && val !== "All") {
              searchParams.set("status", val);
            } else {
              searchParams.delete("status");
            }
            paramsToReset.forEach((param) => searchParams.delete(param));
            setSearchParams(searchParams);
          }}
          label="Status"
        />
      </div>
      <div className="flex flex-col">
        <ReactSelectDropdown
          name="duration"
          label=""
          value={duration}
          items={durationOptions}
          className="inline-block p-3 w-auto max-w-[500px]"
          dropDownClassNames="w-auto max-w-[400px] left-0"
          onChange={(val) => {
            if (val && val !== "None") {
              searchParams.set("runDuration", val);
            } else {
              searchParams.delete("runDuration");
            }
            paramsToReset.forEach((param) => searchParams.delete(param));
            setSearchParams(searchParams);
          }}
          prefix={<span className="text-xs">Duration:</span>}
        />
      </div>
      <div className="flex flex-col">
        <TimeRangePicker
          onChange={(timeRange) => setTimeRangeParams(timeRange, paramsToReset)}
          className="w-[35rem]"
          value={timeRangeValue}
        />
      </div>
    </div>
  );
}
