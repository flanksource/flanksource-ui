import FormikFilterForm from "../../Forms/FormikFilterForm";
import FormikSearchInputClearable from "../../Forms/Formik/FormikSearchInputClearable";
import NotificationResourceTypeDropdown from "./NotificationResourceTypeDropdown";
import NotificationStatusDropdown from "./NotificationStatusDropdown";

export default function NotificationFilterBar() {
  return (
    <FormikFilterForm
      paramsToReset={["pageIndex", "pageSize"]}
      filterFields={["status", "resource_type", "search"]}
    >
      <div className="flex flex-row gap-2 py-3">
        <NotificationStatusDropdown />
        <NotificationResourceTypeDropdown />
        <FormikSearchInputClearable
          name="search"
          placeholder="Search by resources"
        />
      </div>
    </FormikFilterForm>
  );
}
