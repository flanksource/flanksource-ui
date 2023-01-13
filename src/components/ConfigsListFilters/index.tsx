import { debounce } from "lodash";
import React from "react";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useConfigPageContext } from "../../context/ConfigPageContext";
import { QueryBuilder } from "../QueryBuilder";
import { Switch } from "../Switch";
import { TextInputClearable } from "../TextInputClearable";
import GroupByDropdown from "../GroupByDropdown";
import { ConfigTagsDropdown } from "../ConfigTagsDropdown";
import { ConfigTypesDropdown } from "../ConfigTypesDropdown";
import { ConfigListToggledDeletedItems } from "../ConfigListToggledDeletedItems/ConfigListToggledDeletedItems";

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
        <>
          {/* @ts-expect-error */}
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
        </>
      ) : (
        <>
          <ConfigTypesDropdown />

          <GroupByDropdown />

          <ConfigTagsDropdown />

          {/* @ts-expect-error */}
          <TextInputClearable
            onChange={debounce((e) => {
              const query = e.target.value || "";
              params.set("search", query);
              setParams(params);
            }, 200)}
            className="w-80"
            placeholder="Search for configs"
            defaultValue={params.get("search")}
          />

          <ConfigListToggledDeletedItems />
        </>
      )}

      <Switch
        onChange={(e: string) => {
          setConfigFilterView(e);
          setParams({});
        }}
        options={options}
        value={configFilterView}
      />
    </div>
  );
}

export default React.memo(ConfigsListFilterControls);
