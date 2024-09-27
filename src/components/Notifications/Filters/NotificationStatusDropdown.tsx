import TristateReactSelect, {
  TriStateOptions
} from "@flanksource-ui/ui/Dropdowns/TristateReactSelect";
import { useField } from "formik";
import { notificationSendHistoryStatus } from "../NotificationsStatusCell";

const statusOptions: Record<string, TriStateOptions> =
  notificationSendHistoryStatus;

export default function NotificationStatusDropdown() {
  const [field] = useField({
    name: "status",
    id: "status"
  });

  return (
    <div className="flex flex-col">
      <TristateReactSelect
        value={field.value}
        options={Object.values(statusOptions).sort((a, b) =>
          a?.value?.localeCompare(b.value)
        )}
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
