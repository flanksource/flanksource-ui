import { debounce } from "lodash";
import React from "react";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useConfigPageContext } from "../../../context/ConfigPageContext";
import { QueryBuilder } from "../../QueryBuilder";
import { Switch } from "../../Switch";
import { TextInputClearable } from "../../TextInputClearable";
import GroupByDropdown from "../../GroupByDropdown";
import { ConfigTagsDropdown } from "./ConfigTagsDropdown";
import { ConfigListToggledDeletedItems } from "../ConfigListToggledDeletedItems/ConfigListToggledDeletedItems";
import { ConfigTypesDropdown } from "./ConfigTypesDropdown";

const ConfigFilterViewTypes = {
  basic: "Basic",
  advanced: "Advanced"
};

function ConfigsListFilterControls() {
  const [params, setParams] = useSearchParams({
    type: "All",
    tag: "All"
  });

  const { setConfigState } = useConfigPageContext();

  const [configFilterView, setConfigFilterView] = useState(() =>
    params.get("query")
      ? ConfigFilterViewTypes.advanced
      : ConfigFilterViewTypes.basic
  );

  const options = useMemo(() => {
    return [ConfigFilterViewTypes.basic, ConfigFilterViewTypes.advanced];
  }, []);

  return (
    <div className="flex space-x-2 mr-4">
      {configFilterView === ConfigFilterViewTypes.advanced ? (
        <QueryBuilder
          refreshConfigs={(e: any) => {
            setConfigState((state) => {
              return {
                ...state,
                data: e
              };
            });
          }}
        />
      ) : (
        <>
          <ConfigTypesDropdown />

          <GroupByDropdown />

          <ConfigTagsDropdown />

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
        </>
      )}

      <Switch
        onChange={(e) => {
          setConfigFilterView(e as string);
          setParams({});
        }}
        options={options}
        value={configFilterView}
      />
    </div>
  );
}

const ConfigsListFilters = React.memo(ConfigsListFilterControls);
export default ConfigsListFilters;
