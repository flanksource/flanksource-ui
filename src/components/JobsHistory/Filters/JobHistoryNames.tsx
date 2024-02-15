import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getJobsHistoryNames } from "../../../api/services/jobsHistory";
import { ReactSelectDropdown, StateOption } from "../../ReactSelectDropdown";

export default function JobHistoryNamesDropdown() {
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
              label: job.name,
              value: job.name,
              id: job.name
            } as StateOption)
        );
      }
    }
  );

  return (
    <div className="flex flex-col">
      <ReactSelectDropdown
        name="name"
        label=""
        value={name}
        isLoading={isLoading}
        items={[{ label: "All", value: "" }, ...jobNames]}
        className="inline-block p-3 w-auto max-w-[500px]"
        dropDownClassNames="w-auto max-w-[400px] left-0"
        onChange={(val) => {
          if (val && val !== "All") {
            searchParams.set("name", val);
          } else {
            searchParams.delete("name");
          }
          setSearchParams(searchParams);
        }}
        prefix="Job Type:"
      />
    </div>
  );
}
