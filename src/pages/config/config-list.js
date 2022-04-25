import React, { useEffect, useState } from "react";
import history from "history/browser";
import { debounce } from "lodash";
import { useNavigate } from "react-router-dom";
import { getAllConfigs } from "../../api/services/configs";
import { Dropdown } from "../../components/Dropdown";

import { SearchLayout } from "../../components/Layout";
import { TextInputClearable } from "../../components/TextInputClearable";
import { defaultTableColumns } from "../../components/ConfigViewer/columns";
import {
  decodeUrlSearchParams,
  updateParams
} from "../../components/Canary/url";
import { ConfigListTable } from "../../components/ConfigViewer/table";
import {
  filterConfigsByText,
  filterConfigsByType
} from "../../components/ConfigViewer/utils";

const getTypes = (configs) =>
  configs.reduce((acc, current) => {
    if (!Object.prototype.hasOwnProperty.call(acc, current.config_type)) {
      acc[current.config_type] = {
        id: `dropdown-config-type-${current.config_type}`,
        name: current.config_type,
        description: current.config_type,
        value: current.config_type
      };
    }
    return acc;
  }, {});

const getTags = (configs) =>
  configs.reduce((acc, current) => {
    const { tags } = current;
    if (tags && tags.length > 0) {
      tags.forEach((tag) => {
        if (!Object.prototype.hasOwnProperty.call(acc, tag)) {
          acc[tag] = {
            id: `dropdown-tag-${tag}`,
            name: tag,
            description: tag,
            value: tag
          };
        }
      });
    }
    return acc;
  }, {});

export function ConfigListPage() {
  const [searchParams, setSearchParams] = useState(
    decodeUrlSearchParams(window.location.search)
  );
  useEffect(() => {
    history.listen(({ location }) => {
      setSearchParams(decodeUrlSearchParams(location.search));
    });
  }, []);
  const { query, type } = searchParams;

  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const columns = React.useMemo(() => defaultTableColumns, []);

  const fetch = () => {
    getAllConfigs()
      .then((res) => {
        setData(res.data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useState(() => {
    fetch();
  }, []);

  const handleRowClick = (row) => {
    const id = row?.original?.id;
    if (id) {
      navigate(`/config/${id}`);
    }
  };

  useEffect(() => {
    let filteredData = data;
    if (data?.length > 0) {
      // do filtering here
      filteredData = filterConfigsByText(filteredData, query);
      filteredData = filterConfigsByType(filteredData, type);
      // filteredData = filterConfigsByTag(filteredData, tag);
    }
    setFilteredData(filteredData);
  }, [data, query, type]);

  return (
    <SearchLayout
      extra={
        <>
          <TextInputClearable
            onChange={debounce((e) => {
              const query = e?.target?.value || "";
              updateParams({ query });
            }, 800)}
            className="w-80"
            placeholder="Search for configs"
            defaultValue={query}
          />
        </>
      }
      title="Config List"
    >
      <div className="flex mb-4">
        <TypeDropdown options={getTypes(data)} className="mr-2 w-56" />
        <TagsDropdown options={getTags(data)} className="mr-2 w-56" />
      </div>

      <ConfigListTable
        columns={columns}
        data={filteredData}
        handleRowClick={handleRowClick}
        tableStyle={{ borderSpacing: "0" }}
        isLoading={isLoading}
      />
    </SearchLayout>
  );
}

const TypeDropdown = ({ options = {}, ...rest }) => {
  const { type: initialType } = decodeUrlSearchParams(window.location.search);
  const [selected, setSelected] = useState(initialType);

  const optionsTemplate = {
    null: {
      id: "any",
      name: "any",
      description: "Any",
      value: null
    }
  };

  useEffect(() => {
    updateParams({ type: selected });
  }, [selected]);

  return (
    <Dropdown
      emptyable
      items={{ ...optionsTemplate, ...options }}
      onChange={(value) => setSelected(value)}
      value={selected}
      prefix={
        <>
          <div className="text-xs text-gray-500 mr-2 whitespace-nowrap">
            Type:
          </div>
        </>
      }
      {...rest}
    />
  );
};

const TagsDropdown = ({ options = {}, ...rest }) => {
  const { tag: initialTag } = decodeUrlSearchParams(window.location.search);
  const [selected, setSelected] = useState(initialTag);

  const optionsTemplate = {
    null: {
      id: "none",
      name: "none",
      description: "None",
      value: null
    }
  };

  useEffect(() => {
    updateParams({ tag: selected });
  }, [selected]);

  return (
    <Dropdown
      emptyable
      items={{ ...optionsTemplate, ...options }}
      onChange={(value) => setSelected(value)}
      value={selected}
      prefix={
        <>
          <div className="text-xs text-gray-500 mr-2 whitespace-nowrap">
            Tag:
          </div>
        </>
      }
      {...rest}
    />
  );
};
