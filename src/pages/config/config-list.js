import React, { useEffect, useState } from "react";
import history from "history/browser";
import { debounce } from "lodash";
import { BsTable } from "react-icons/bs";
import { RiLayoutGridLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { Tab } from "@headlessui/react";
import clsx from "clsx";
import { getAllConfigs, getAllChanges } from "../../api/services/configs";
import { Dropdown } from "../../components/Dropdown";

import { SearchLayout } from "../../components/Layout";
import { TextInputClearable } from "../../components/TextInputClearable";
import {
  defaultTableColumns,
  historyTableColumns
} from "../../components/ConfigViewer/columns";
import {
  decodeUrlSearchParams,
  updateParams
} from "../../components/Canary/url";
import { ConfigListTable } from "../../components/ConfigViewer/table";
import { filterConfigsByText } from "../../components/ConfigViewer/utils";
import { ConfigHistoryTable } from "../../components/ConfigViewer/changeTable";

export function ConfigListPage() {
  const [searchParams, setSearchParams] = useState(
    decodeUrlSearchParams(window.location.search)
  );
  useEffect(() => {
    history.listen(({ location }) => {
      setSearchParams(decodeUrlSearchParams(location.search));
    });
  }, []);
  const { query } = searchParams;

  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [historyData, setHistoryData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const columns = React.useMemo(() => defaultTableColumns, []);
  const historyColumns = React.useMemo(() => historyTableColumns, []);

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

  const tabs = [
    {
      text: "Config",
      panel: (
        <ConfigListTable
          columns={columns}
          data={filteredData}
          handleRowClick={handleRowClick}
          tableStyle={{ borderSpacing: "0" }}
          isLoading={isLoading}
        />
      )
    },
    {
      text: "Changes",
      panel: (
        <ConfigHistoryTable
          columns={historyColumns}
          data={historyData}
          tableStyle={{ borderSpacing: "0" }}
          isLoading={isLoading}
        />
      )
    }
  ];

  useEffect(() => {
    let filteredData = data;
    if (data?.length > 0) {
      // do filtering here
      filteredData = filterConfigsByText(filteredData, query);
    }
    setFilteredData(filteredData);
  }, [data, query]);

  const onTabChange = (index) => {
    setIsLoading(true);
    if (index === 1) {
      getAllChanges()
        .then((res) => {
          setHistoryData(res.data);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else if (index === 0) {
      getAllConfigs()
        .then((res) => {
          setData(res.data);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

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
        <TypeDropdown className="mr-2" />
        <TagsDropdown />
      </div>

      <Tab.Group onChange={onTabChange}>
        <Tab.List className=" flex space-x-1 border-gray-300">
          {tabs.map((tab) => (
            <Tab
              key={tab.text}
              className={({ selected }) =>
                clsx(
                  "rounded-t-md py-2.5 px-4 text-sm leading-5",
                  "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400",
                  selected ? "border border-b-0 border-gray-300" : ""
                )
              }
            >
              {tab.text}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="">
          {tabs.map((tab) => (
            <Tab.Panel
              key={tab.text}
              className={clsx(
                "rounded-xl bg-white",
                "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400"
              )}
            >
              {tab.panel}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </SearchLayout>
  );
}

const TypeDropdown = ({ ...rest }) => {
  const exampleItems = {
    type1: {
      id: "dropdown-type1",
      name: "type1",
      icon: <BsTable />,
      description: "Type 1",
      value: "type1"
    },
    type2: {
      id: "dropdown-type2",
      name: "type2",
      icon: <RiLayoutGridLine />,
      description: "Type 2",
      value: "type2"
    }
  };

  const [selected, setSelected] = useState(
    Object.values(exampleItems)[0].value
  );

  return (
    <Dropdown
      items={exampleItems}
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

const TagsDropdown = ({ ...rest }) => {
  const exampleItems = {
    tag1: {
      id: "dropdown-tag1",
      name: "tag1",
      description: "Tag 1",
      value: "tag1"
    },
    tag2: {
      id: "dropdown-tag2",
      name: "tag2",
      description: "Tag 2",
      value: "tag2"
    }
  };

  const [selected, setSelected] = useState(
    Object.values(exampleItems)[0].value
  );

  return (
    <Dropdown
      items={exampleItems}
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
