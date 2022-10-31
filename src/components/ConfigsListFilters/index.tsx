import { debounce } from "lodash";
import React from "react";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useConfigPageContext } from "../../context/ConfigPageContext";
import { QueryBuilder } from "../QueryBuilder";
import { ReactSelectDropdown } from "../ReactSelectDropdown";
import { SearchSelectTag } from "../SearchSelectTag";
import { Switch } from "../Switch";
import { TextInputClearable } from "../TextInputClearable";

const ConfigFilterViewTypes = {
  basic: "Basic",
  advanced: "Advanced"
};

function ConfigsListFilters() {
  const [params, setParams] = useSearchParams({
    type: "All",
    tag: "All"
  });

  const {
    setConfigState,
    configState: { data }
  } = useConfigPageContext();

  const [configFilterView, setConfigFilterView] = useState(() =>
    params.get("query")
      ? ConfigFilterViewTypes.advanced
      : ConfigFilterViewTypes.basic
  );

  const configType = params.get("type");
  const tag = params.get("tag");

  const options = useMemo(() => {
    return [ConfigFilterViewTypes.basic, ConfigFilterViewTypes.advanced];
  }, []);

  const configTagItems: any = useMemo(() => {
    if (!data) return [];
    return data.flatMap((d) => {
      return Object.entries(d?.tags || {});
    });
  }, [data]);

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
          <TypeDropdown
            value={configType}
            onChange={(ct: any) => {
              params.set("type", encodeURIComponent(ct || ""));
              setParams(params);
            }}
          />

          <span className="w-80">
            <SearchSelectTag
              tags={configTagItems}
              value={tag ?? ""}
              onChange={(ct) => {
                params.set("tag", encodeURIComponent(ct.value || ""));
                setParams(params);
              }}
            />
          </span>

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

const TypeDropdown = ({ ...rest }) => {
  const items = {
    All: {
      id: "All",
      name: "All",
      description: "All",
      value: "All"
    },
    EC2Instance: {
      id: "EC2Instance",
      name: "EC2 Instance",
      description: "EC2 Instance",
      value: "EC2Instance"
    },
    Subnet: {
      id: "Subnet",
      name: "Subnet",
      description: "Subnet",
      value: "Subnet"
    }
  };

  const [selected, setSelected] = useState<any>(Object.values(items)[0].value);

  return (
    <ReactSelectDropdown
      items={items}
      name="type"
      onChange={(value) => setSelected(value)}
      value={selected}
      className="w-64"
      prefix={
        <div className="text-xs text-gray-500 mr-2 whitespace-nowrap">
          Type:
        </div>
      }
      {...rest}
    />
  );
};

export default React.memo(ConfigsListFilters);
