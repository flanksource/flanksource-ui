import TristateReactSelect, {
  TriStateOptions
} from "@flanksource-ui/ui/Dropdowns/TristateReactSelect";
import { formatJobName } from "@flanksource-ui/utils/common";
import { useQuery } from "@tanstack/react-query";
import { useField } from "formik";
import { getJobsHistoryNames } from "../../../api/services/jobsHistory";

export default function JobHistoryNamesDropdown() {
  const [field] = useField({
    name: "name"
  });

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
            }) satisfies TriStateOptions
        );
      }
    }
  );

  return (
    <div className="flex flex-col">
      <TristateReactSelect
        value={field.value}
        isLoading={isLoading}
        options={jobNames}
        onChange={(val) => {
          if (val && val !== "All") {
            field.onChange({ target: { value: val, name: field.name } });
          } else {
            field.onChange({ target: { value: undefined, name: field.name } });
          }
        }}
        label="Job Name"
      />
    </div>
  );
}
