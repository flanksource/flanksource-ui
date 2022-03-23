import React, { useState } from "react";
import { BsTable } from "react-icons/bs";
import { RiLayoutGridLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { useTable } from "react-table";
import { Dropdown } from "../../components/Dropdown";

import { SearchLayout } from "../../components/Layout";
import { TextInputClearable } from "../../components/TextInputClearable";
import { DateCell, TagsCell } from "./columns";

const sampleRow = {
  type: "Type",
  name: "package.json",
  tags: null,
  id: 12345,
  created_at: `${new Date()}`,
  updated_at: `${new Date()}`
};

const tableStyles = {
  outerDivClass: "border border-b-0 border-gray-300",
  tableClass: "min-w-full border-separate",
  theadClass: "bg-white z-10",
  theadRowClass: "z-10",
  theadHeaderClass:
    "px-5 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-300",
  tbodyClass: "rounded-md",
  tbodyRowClass: "border cursor-pointer text-sm",
  tbodyDataClass: "whitespace-nowrap border-gray-300 border-b p-2"
};

const defaultTableColumns = [
  {
    Header: "Type",
    accessor: "type",
    cellClass: `px-5 py-2`
  },
  {
    Header: "Name",
    accessor: "name",
    cellClass: `px-5 py-2`
  },
  {
    Header: "Tags",
    accessor: "tags",
    Cell: TagsCell,
    cellClass: `px-5 py-2`
  },
  {
    Header: "ID",
    accessor: "id",
    cellClass: `px-5 py-2`
  },
  {
    Header: "Created",
    accessor: "created_at",
    Cell: DateCell,
    cellClass: `px-5 py-2`
  },
  {
    Header: "Last Updated",
    accessor: "updated_at",
    Cell: DateCell,
    cellClass: `px-5 py-2`
  }
];

export function ConfigListPage() {
  const navigate = useNavigate();
  const data = React.useMemo(() => [...Array(10).fill(sampleRow)], []);
  const columns = React.useMemo(() => defaultTableColumns, []);

  const handleRowClick = (row) => {
    const id = row?.original?.id;
    if (id) {
      navigate(`/config/${id}`);
    }
  };

  return (
    <SearchLayout
      extra={
        <>
          <TextInputClearable
            onChange={(v) => console.log("onchange", v)}
            className="w-80"
            placeholder="Search for configs"
          />
        </>
      }
      title="Config List"
    >
      <div className="flex mb-4">
        <TypeDropdown className="mr-2" />
        <TagsDropdown />
      </div>

      <ConfigListTable
        columns={columns}
        data={data}
        handleRowClick={handleRowClick}
        tableStyle={{ borderSpacing: "0" }}
      />
    </SearchLayout>
  );
}

const ConfigListTable = ({
  columns,
  data,
  handleRowClick,
  tableStyle,
  ...rest
}) => {
  const tableInstance = useTable({ columns, data });

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  return (
    <div className={tableStyles.outerDivClass} {...rest}>
      <table
        className={tableStyles.tableClass}
        style={tableStyle}
        {...getTableProps()}
      >
        <thead className={tableStyles.theadClass}>
          {headerGroups.map((headerGroup) => (
            <tr
              key={headerGroup.getHeaderGroupProps().key}
              className={tableStyles.theadRowClass}
              {...headerGroup.getHeaderGroupProps()}
            >
              {headerGroup.headers.map((column) => (
                <th
                  key={column.Header}
                  className={tableStyles.theadHeaderClass}
                  {...column.getHeaderProps()}
                >
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className={tableStyles.tbodyClass} {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr
                key={row.id}
                className={tableStyles.tbodyRowClass}
                {...row.getRowProps()}
                onClick={handleRowClick ? () => handleRowClick(row) : () => {}}
              >
                {row.cells.map((cell) => (
                  <td
                    key={cell.column.Header}
                    className={`${tableStyles.tbodyDataClass} ${
                      cell.column.cellClass || ""
                    }`}
                    {...cell.getCellProps()}
                  >
                    {cell.render("Cell")}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

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
