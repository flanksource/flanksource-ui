import React, { useEffect, useState } from "react";
import { BsTable } from "react-icons/bs";
import { RiLayoutGridLine } from "react-icons/ri";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getAllConfigs } from "../../api/services/configs";
import { Dropdown } from "../../components/Dropdown";

import { defaultTableColumns } from "../../components/ConfigViewer/columns";
import { filterConfigsByText } from "../../components/ConfigViewer/utils";
import { DataTable } from "../../components";

export function ConfigListPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const columns = React.useMemo(() => defaultTableColumns, []);

  const query = params.get("query");

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

  useEffect(() => {
    let filteredData = data;
    if (data?.length > 0) {
      // do filtering here
      filteredData = filterConfigsByText(filteredData, query);
    }
    setFilteredData(filteredData);
  }, [data, query]);

  return (
    <>
      <div className="flex mb-4">
        <TypeDropdown className="mr-2" />
        <TagsDropdown />
      </div>
      <DataTable
        columns={columns}
        data={filteredData}
        handleRowClick={handleRowClick}
        tableStyle={{ borderSpacing: "0" }}
        isLoading={isLoading}
      />
    </>
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
        <div className="text-xs text-gray-500 mr-2 whitespace-nowrap">
          Type:
        </div>
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
