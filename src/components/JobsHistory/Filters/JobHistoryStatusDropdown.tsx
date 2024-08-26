import TristateReactSelect, {
  TriStateOptions
} from "@flanksource-ui/ui/Dropdowns/TristateReactSelect";
import { useField } from "formik";

const statusOptions: Record<string, TriStateOptions> = {
  running: {
    id: "1",
    label: "Running",
    value: "RUNNING"
  },
  success: {
    id: "2",
    label: "Success",
    value: "SUCCESS"
  },
  warning: {
    id: "3",
    label: "Warning",
    value: "WARNING"
  },
  failed: {
    id: "4",
    label: "Failed",
    value: "FAILED"
  }
};

export default function JobHistoryStatusDropdown() {
  const [field] = useField({
    name: "status",
    id: "status"
  });

  return (
    <div className="flex flex-col">
      <TristateReactSelect
        value={field.value}
        options={Object.values(statusOptions)}
        onChange={(val) => {
          if (val && val !== "All") {
            field.onChange({ target: { value: val, name: field.name } });
          } else {
            field.onChange({ target: { value: undefined, name: field.name } });
          }
        }}
        label="Status"
      />
    </div>
  );
}
