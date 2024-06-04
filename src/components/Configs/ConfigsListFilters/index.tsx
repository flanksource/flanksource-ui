import FormikSearchInputClearable from "@flanksource-ui/components/Forms/Formik/FormikSearchInputClearable";
import FormikFilterForm from "@flanksource-ui/components/Forms/FormikFilterForm";
import { ConfigListToggledDeletedItems } from "../ConfigListToggledDeletedItems/ConfigListToggledDeletedItems";
import ConfigGroupByDropdown from "./ConfigGroupByDropdown";
import { ConfigHealthyDropdown } from "./ConfigHealthyDropdown";
import { ConfigLabelsDropdown } from "./ConfigLabelsDropdown";
import { ConfigStatusDropdown } from "./ConfigStatusDropdown";
import { ConfigTypesDropdown } from "./ConfigTypesDropdown";

export default function ConfigsListFilters() {
  return (
    <FormikFilterForm
      paramsToReset={["tags", "group_by"]}
      filterFields={[
        "search",
        "configType",
        "labels",
        "status",
        "health",
        "groupBy"
      ]}
    >
      <div className="flex flex-row items-center gap-2 mr-4">
        <ConfigTypesDropdown />

        <ConfigGroupByDropdown />

        <ConfigLabelsDropdown />

        <ConfigStatusDropdown />

        <ConfigHealthyDropdown />

        <FormikSearchInputClearable
          name="search"
          placeholder="Search for configs"
        />

        <ConfigListToggledDeletedItems />
      </div>
    </FormikFilterForm>
  );
}
