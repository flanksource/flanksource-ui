import FormikFilterForm from "../../Forms/FormikFilterForm";
import FormikSearchInputClearable from "../../Forms/Formik/FormikSearchInputClearable";
import NotificationResourceTypeDropdown from "./NotificationResourceTypeDropdown";
import NotificationStatusDropdown from "./NotificationStatusDropdown";
import NotificationTagsDropdown from "./NotificationTagsDropdown";

export default function NotificationFilterBar() {
  return (
    <FormikFilterForm
      paramsToReset={["pageIndex", "pageSize"]}
      filterFields={["status", "resource_type", "search", "tags"]}
      defaultFieldValues={{
        status: "skipped:-1,silenced:-1"
      }}
    >
      <div className="flex flex-row gap-2 py-3">
        <NotificationStatusDropdown />
        <NotificationResourceTypeDropdown />
        <NotificationTagsDropdown />
        <FormikSearchInputClearable
          name="search"
          placeholder="Search by resource name"
        />
      </div>
    </FormikFilterForm>
  );
}
