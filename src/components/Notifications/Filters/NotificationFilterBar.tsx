import ShowDeletedConfigs from "../../Configs/ConfigsListFilters/ShowDeletedConfigs";
import FormikFilterForm from "../../Forms/FormikFilterForm";
import FormikSearchInputClearable from "../../Forms/Formik/FormikSearchInputClearable";
import NotificationResourceTypeDropdown from "./NotificationResourceTypeDropdown";
import NotificationStatusDropdown from "./NotificationStatusDropdown";
import NotificationTagsDropdown from "./NotificationTagsDropdown";

export const DEFAULT_NOTIFICATION_STATUS_FILTER =
  "skipped:-1,silenced:-1,inhibited:-1,repeat-interval:-1";

export default function NotificationFilterBar() {
  return (
    <FormikFilterForm
      paramsToReset={["pageIndex", "pageSize"]}
      filterFields={["status", "resource_type", "search", "tags"]}
      defaultFieldValues={{
        status: DEFAULT_NOTIFICATION_STATUS_FILTER
      }}
    >
      <div className="flex flex-row gap-2 py-3">
        <NotificationStatusDropdown />
        <NotificationResourceTypeDropdown />
        <NotificationTagsDropdown />
        <ShowDeletedConfigs />
        <FormikSearchInputClearable
          name="search"
          placeholder="Search by resource name"
        />
      </div>
    </FormikFilterForm>
  );
}
