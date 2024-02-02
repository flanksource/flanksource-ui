import { TimeRangePicker } from "@flanksource-ui/ui/TimeRangePicker";
import useTimeRangeParams from "@flanksource-ui/ui/TimeRangePicker/useTimeRangeParams";
import { useSearchParams } from "react-router-dom";
import { ReactSelectDropdown } from "../../ReactSelectDropdown";
import JobHistoryNamesDropdown from "./JobHistoryNames";

const statusOptions = {
  all: {
    id: "0",
    label: "All",
    value: ""
  },
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

export const jobHistoryResourceTypes = [
  {
    label: "All",
    value: ""
  },
  {
    label: "Canary",
    value: "canary"
  },
  {
    label: "Topology",
    value: "topology"
  },
  {
    label: "Catalog Scraper",
    value: "config_scraper"
  }
];

export default function JobHistoryFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const { setTimeRangeParams, getTimeRangeFromUrl } = useTimeRangeParams();

  const timeRangeValue = getTimeRangeFromUrl();

  const resourceType = searchParams.get("resource_type") ?? "";
  const status = searchParams.get("status") ?? "";

  return (
    <div className="flex flex-wrap py-4 gap-2">
      <JobHistoryNamesDropdown />

      <div className="flex flex-col">
        <ReactSelectDropdown
          name="resource_type"
          label=""
          value={resourceType}
          items={jobHistoryResourceTypes}
          className="inline-block p-3 w-auto max-w-[500px]"
          dropDownClassNames="w-auto max-w-[400px] left-0"
          onChange={(val) => {
            if (val && val !== "All") {
              searchParams.set("resource_type", val);
            }
            setSearchParams(searchParams);
          }}
          prefix="Resource Type:"
        />
      </div>
      <div className="flex flex-col">
        <ReactSelectDropdown
          name="status"
          label=""
          value={status}
          items={statusOptions}
          className="inline-block p-3 w-auto max-w-[500px]"
          dropDownClassNames="w-auto max-w-[400px] left-0"
          onChange={(val) => {
            if (val && val !== "All") {
              searchParams.set("status", val);
            }
            setSearchParams(searchParams);
          }}
          prefix="Status:"
        />
      </div>
      <div className="flex flex-col">
        <TimeRangePicker
          onChange={(timeRange) => {
            console.log("timeRange", timeRange);
            setTimeRangeParams(timeRange);
          }}
          className="w-[35rem]"
          value={timeRangeValue}
        />
      </div>
    </div>
  );
}
