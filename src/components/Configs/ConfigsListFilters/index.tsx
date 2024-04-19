import { useConfigPageContext } from "@flanksource-ui/context/ConfigPageContext";
import { debounce } from "lodash";
import React, { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { QueryBuilder } from "../../QueryBuilder";
import { Switch } from "../../Switch";
import { TextInputClearable } from "../../TextInputClearable";
import { ConfigListToggledDeletedItems } from "../ConfigListToggledDeletedItems/ConfigListToggledDeletedItems";
import ConfigGroupByDropdown from "./ConfigGroupByDropdown";
import { ConfigLabelsDropdown } from "./ConfigLabelsDropdown";
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
    <div className="flex flex-row items-center gap-2 mr-4">
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

          <ConfigGroupByDropdown paramsToReset={["tags"]} />

          <ConfigLabelsDropdown />

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
