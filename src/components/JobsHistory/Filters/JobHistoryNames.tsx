import TristateReactSelect, {
  TriStateOptions
} from "@flanksource-ui/ui/TristateReactSelect/TristateReactSelect";
import { formatJobName } from "@flanksource-ui/utils/common";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getJobsHistoryNames } from "../../../api/services/jobsHistory";

type JobHistoryNamesDropdownProps = {
  paramsToReset?: string[];
};

export default function JobHistoryNamesDropdown({
  paramsToReset = ["pageIndex", "pageSize"]
}: JobHistoryNamesDropdownProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const name = searchParams.get("name") ?? "";

  const { data: jobNames = [], isLoading } = useQuery(
    ["jobHistoryNames"],
    () => getJobsHistoryNames(),
    {
      select: (data) => {
        return data.map(
          (job) =>
            ({
              label: formatJobName(job.name)!,
              value: job.name,
              id: job.name
            } satisfies TriStateOptions)
        );
      }
    }
  );

  return (
    <div className="flex flex-col">
      <TristateReactSelect
        value={name}
        isLoading={isLoading}
        options={jobNames}
        onChange={(val) => {
          if (val && val !== "All") {
            searchParams.set("name", val);
          } else {
            searchParams.delete("name");
          }
          paramsToReset.forEach((param) => searchParams.delete(param));
          setSearchParams(searchParams);
        }}
        label="Job Name"
      />
    </div>
  );
}
