import FormikFilterForm from "../../Forms/FormikFilterForm";
import NotificationResourceTypeDropdown from "./NotificationResourceTypeDropdown";
import NotificationStatusDropdown from "./NotificationStatusDropdown";

export default function NotificationFilterBar() {
  return (
    <FormikFilterForm
      paramsToReset={["pageIndex", "pageSize"]}
      filterFields={["status", "resource_type"]}
    >
      <div className="flex flex-row gap-2 py-3">
        <NotificationStatusDropdown />
        <NotificationResourceTypeDropdown />
      </div>
    </FormikFilterForm>
  );
}
