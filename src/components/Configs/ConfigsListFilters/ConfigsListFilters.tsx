import FormikSearchInputClearable from "@flanksource-ui/components/Forms/Formik/FormikSearchInputClearable";
import FormikFilterForm from "@flanksource-ui/components/Forms/FormikFilterForm";
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
      <div className="mr-4 flex flex-wrap items-center gap-2">
        <ConfigTypesDropdown />

        <ConfigGroupByDropdown />

        <ConfigLabelsDropdown />

        <ConfigStatusDropdown />

        <ConfigHealthyDropdown />

        <FormikSearchInputClearable
          name="search"
          placeholder="Search for configs"
          className="w-[400px]"
        />
      </div>
    </FormikFilterForm>
  );
}
