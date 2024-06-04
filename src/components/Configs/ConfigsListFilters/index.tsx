import FormikFilterForm from "@flanksource-ui/components/Forms/FormikFilterForm";
import { debounce } from "lodash";
import { useSearchParams } from "react-router-dom";
import { TextInputClearable } from "../../../ui/FormControls/TextInputClearable";
import { ConfigListToggledDeletedItems } from "../ConfigListToggledDeletedItems/ConfigListToggledDeletedItems";
import ConfigGroupByDropdown from "./ConfigGroupByDropdown";
import { ConfigHealthyDropdown } from "./ConfigHealthyDropdown";
import { ConfigLabelsDropdown } from "./ConfigLabelsDropdown";
import { ConfigStatusDropdown } from "./ConfigStatusDropdown";
import { ConfigTypesDropdown } from "./ConfigTypesDropdown";

export default function ConfigsListFilters() {
  const [params, setParams] = useSearchParams();

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

        <TextInputClearable
          onChange={debounce((e) => {
            const query = e.target.value || "";
            params.set("search", query);
            setParams(params);
          }, 200)}
          className="w-80"
          placeholder="Search for configs"
          defaultValue={params.get("search") ?? undefined}
        />

        <ConfigListToggledDeletedItems />
      </div>
    </FormikFilterForm>
  );
}
