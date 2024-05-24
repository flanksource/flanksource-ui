import { debounce } from "lodash";
import React from "react";
import { useSearchParams } from "react-router-dom";
import { TextInputClearable } from "../../TextInputClearable";
import { ConfigListToggledDeletedItems } from "../ConfigListToggledDeletedItems/ConfigListToggledDeletedItems";
import ConfigGroupByDropdown from "./ConfigGroupByDropdown";
import { ConfigHealthyDropdown } from "./ConfigHealthyDropdown";
import { ConfigLabelsDropdown } from "./ConfigLabelsDropdown";
import { ConfigStatusDropdown } from "./ConfigStatusDropdown";
import { ConfigTypesDropdown } from "./ConfigTypesDropdown";

function ConfigsListFilterControls() {
  const [params, setParams] = useSearchParams({
    type: "All",
    tag: "All"
  });

  return (
    <div className="flex flex-row items-center gap-2 mr-4">
      <ConfigTypesDropdown />

      <ConfigGroupByDropdown paramsToReset={["tags"]} />

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
  );
}

const ConfigsListFilters = React.memo(ConfigsListFilterControls);
export default ConfigsListFilters;
