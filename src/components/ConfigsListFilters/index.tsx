import { debounce } from "lodash";
import React from "react";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useConfigPageContext } from "../../context/ConfigPageContext";
import { QueryBuilder } from "../QueryBuilder";
import { ReactSelectDropdown } from "../ReactSelectDropdown";
import { Switch } from "../Switch";
import { TextInputClearable } from "../TextInputClearable";
import { ConfigTagFilterDropdown } from "./ConfigTagsFilterDropdown";
import { ConfigTypeFilterDropdown } from "./ConfigTypeFilterDropdown";

const ConfigFilterViewTypes = {
  basic: "Basic",
  advanced: "Advanced"
};

function ConfigsListFilters() {
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

  const configType = params.get("type");
  const groupType = decodeURIComponent(params.get("groupBy") || "config_type");

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
          <ConfigTypeFilterDropdown
            // @ts-expect-error
            value={configType}
            onChange={(ct: any) => {
              params.set("type", encodeURIComponent(ct || ""));
              setParams(params);
            }}
          />

          <GroupDropdown
            value={groupType}
            onChange={(gt) => {
              params.set("groupBy", encodeURIComponent(gt || ""));
              setParams(params);
            }}
          />

          <ConfigTagFilterDropdown />

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

const GroupDropdown = ({ ...rest }) => {
  const items = {
    NoGrouping: {
      id: "No Grouping",
      name: "No Grouping",
      description: "No Grouping",
      value: "no_grouping"
    },
    Type: {
      id: "Type",
      name: "Type",
      description: "Type",
      value: "config_type"
    },
    Name: {
      id: "Name",
      name: "Name",
      description: "Name",
      value: "name"
    },
    Analysis: {
      id: "Analysis",
      name: "Analysis",
      description: "Analysis",
      value: "analysis"
    },
    Changed: {
      id: "Changed",
      name: "Changed",
      description: "Changed",
      value: "changed"
    }
  };

  const [selected, setSelected] = useState(Object.values(items)[0].value);

  return (
    <ReactSelectDropdown
      name="group"
      items={items}
      onChange={(value) => setSelected(value)}
      value={selected}
      className="w-auto max-w-[400px]"
      dropDownClassNames="w-auto max-w-[400px] left-0"
      hideControlBorder
      prefix={
        <div className="text-xs text-gray-500 mr-2 whitespace-nowrap">
          Group By:
        </div>
      }
      {...rest}
    />
  );
};

export default React.memo(ConfigsListFilters);
