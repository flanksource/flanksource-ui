import { useSearchParams } from "react-router-dom";
import { ReactSelectDropdown } from "../../ReactSelectDropdown";
import { JobHistory } from "../JobsHistoryTable";
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

type JobHistoryFiltersProps = {
  jobs: JobHistory[];
  onFilterChange?: () => void;
};

export default function JobHistoryFilters({
  jobs,
  onFilterChange
}: JobHistoryFiltersProps) {
  const [searchParams, setSearchParams] = useSearchParams();

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
          onChange={(val: any) => {
            setSearchParams({
              ...Object.fromEntries(searchParams),
              resource_type: val
            });
            onFilterChange?.();
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
          onChange={(val: any) => {
            setSearchParams({
              ...Object.fromEntries(searchParams),
              status: val
            });
            onFilterChange?.();
          }}
          prefix="Status:"
        />
      </div>
    </div>
  );
}
