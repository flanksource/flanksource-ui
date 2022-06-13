import React, { useEffect, useState, useMemo } from "react";
import { debounce } from "lodash";
import {
  useNavigate,
  useSearchParams,
  useOutletContext
} from "react-router-dom";

import { getAllConfigs } from "../../api/services/configs";
import { Dropdown } from "../../components/Dropdown";

import { filterConfigsByText } from "../../components/ConfigViewer/utils";
import { BreadcrumbNav } from "../../components/BreadcrumbNav";
import { TextInputClearable } from "../../components/TextInputClearable";
import ConfigList from "../../components/ConfigList";
import { SearchSelectTag } from "../../components/SearchSelectTag";
import { QueryBuilder } from "../../components/QueryBuilder";
import { Switch } from "../../components/Switch";

const ConfigFilterViewTypes = {
  basic: "Basic",
  advanced: "Advanced"
};

export function ConfigListPage() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { setTitle, setTitleExtras } = useOutletContext();
  const [configFilterView, setConfigFilterView] = useState(
    ConfigFilterViewTypes.basic
  );
  const options = useMemo(() => {
    return [ConfigFilterViewTypes.basic, ConfigFilterViewTypes.advanced];
  }, []);

  const configTagItems = useMemo(
    () => data.flatMap((d) => Object.entries(d.tags)),
    [data]
  );

  const query = params.get("query");
  const tag = decodeURIComponent(params.get("tag") || "All");
  const configType = decodeURIComponent(params.get("type") || "All");

  useState(() => {
    getAllConfigs()
      .then((res) => {
        setData(res.data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleRowClick = (row) => {
    const id = row?.original?.id;
    if (id) {
      navigate(`/config/${id}`);
    }
  };

  const extra = (
    <div className="flex space-x-2 mr-4">
      <Switch onChange={setConfigFilterView} options={options} />

      {configFilterView === ConfigFilterViewTypes.advanced && <QueryBuilder />}

      {configFilterView === ConfigFilterViewTypes.basic && (
        <>
          <TypeDropdown
            value={configType}
            onChange={(ct) => {
              params.set("type", encodeURIComponent(ct || ""));
              setParams(params);
            }}
          />

          <span className="w-80">
            <SearchSelectTag
              tags={configTagItems}
              value={tag}
              onChange={(ct) => {
                params.set("tag", encodeURIComponent(ct.value || ""));
                setParams(params);
              }}
            />
          </span>

          <TextInputClearable
            onChange={debounce((e) => {
              const query = e.target.value || "";
              params.set("query", query);
              setParams(params);
            }, 200)}
            className="w-80"
            placeholder="Search for configs"
            defaultValue={params.get("query")}
          />
        </>
      )}
    </div>
  );

  useEffect(() => {
    setTitleExtras(extra);
    return () => setTitleExtras(null);
  }, [data, configType, tag, query, configTagItems, options, configFilterView]);

  useEffect(() => {
    let filteredData = data;
    setTitle(<BreadcrumbNav list={["Config"]} />);
    if (data?.length > 0) {
      // do filtering here
      filteredData = filterConfigsByText(filteredData, query);

      if (configType && configType !== "All") {
        filteredData = filteredData.filter((d) => configType === d.config_type);
      }

      if (tag && tag !== "All") {
        filteredData = filteredData.filter((d) => {
          if (Array.isArray(tag)) {
            const kvs = tag.map((x) => x.split("__:__"));
            return kvs.some(([key, val]) => d.tags[key] === val);
          } else {
            const [k, v] = tag.split("__:__");
            return d.tags[k] === v;
          }
        });
      }
    }
    setFilteredData(filteredData);
  }, [data, query, configType, tag]);

  return (
    <ConfigList
      data={filteredData}
      handleRowClick={handleRowClick}
      isLoading={isLoading}
    />
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

  const [selected, setSelected] = useState(Object.values(items)[0].value);

  return (
    <Dropdown
      items={items}
      onChange={(value) => setSelected(value)}
      value={selected}
      prefix={
        <div className="text-xs text-gray-500 mr-2 whitespace-nowrap">
          Type:
        </div>
      }
      {...rest}
    />
  );
};
