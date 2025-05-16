import TristateReactSelect, {
  TriStateOptions
} from "@flanksource-ui/ui/Dropdowns/TristateReactSelect";
import { useField } from "formik";

export const jobHistoryResourceTypes: TriStateOptions[] = [
  {
    label: "Check",
    value: "check",
    id: "check"
  },
  {
    label: "Component",
    value: "component",
    id: "component"
  },
  {
    label: "Catalog",
    value: "config",
    id: "catalog"
  }
].sort((a, b) => a.label.localeCompare(b.label));

export default function NotificationResourceTypeDropdown() {
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
        label="Resource Type"
      />
    </div>
  );
}
