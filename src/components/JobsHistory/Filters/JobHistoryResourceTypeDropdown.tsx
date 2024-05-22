import TristateReactSelect, {
  TriStateOptions
} from "@flanksource-ui/ui/Dropdowns/TristateReactSelect";
import { useField } from "formik";

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

export default function JobHistoryResourceTypeDropdown() {
  const [field] = useField({
    name: "resource_type"
  });

  return (
    <div className="flex flex-col">
      <TristateReactSelect
        value={field.value}
        options={jobHistoryResourceTypes}
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
