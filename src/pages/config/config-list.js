import React from "react";
import { useNavigate } from "react-router-dom";
import { useTable } from "react-table";

import { SearchLayout } from "../../components/Layout";
import { DateCell, TagsCell } from "./columns";

const sampleRow = {
  type: "Type",
  name: "package.json",
  tags: ["tag1", "tag2", "tag3"],
  id: 12345,
  created_at: `${new Date()}`,
  updated_at: `${new Date()}`
};

export function ConfigListPage() {
  const data = React.useMemo(() => [...Array(10).fill(sampleRow)], []);
  const navigate = useNavigate();

  const columns = React.useMemo(
    () => [
      {
        Header: "Type",
        accessor: "type"
      },
      {
        Header: "Name",
        accessor: "name"
      },
      {
        Header: "Tags",
        accessor: "tags",
        Cell: TagsCell
      },
      {
        Header: "ID",
        accessor: "id"
      },
      {
        Header: "Created",
        accessor: "created_at",
        Cell: DateCell
      },
      {
        Header: "Last Updated",
        accessor: "updated_at",
        Cell: DateCell
      }
    ],
    []
  );

  const handleRowClick = (row) => {
    const id = row?.original?.id;
    if (id) {
      navigate(`/config/${id}`);
    }
  };

  return (
    <SearchLayout title="Config Viewer">
      <ConfigListTable
        columns={columns}
        data={data}
        handleRowClick={handleRowClick}
      />
    </SearchLayout>
  );
}

const ConfigListTable = ({ columns, data, handleRowClick }) => {
  const tableInstance = useTable({ columns, data });

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr
            key={headerGroup.getHeaderGroupProps().key}
            {...headerGroup.getHeaderGroupProps()}
          >
            {headerGroup.headers.map((column) => (
              <th key={column.Header} {...column.getHeaderProps()}>
                {column.render("Header")}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <tr
              key={row.id}
              {...row.getRowProps()}
              onClick={handleRowClick ? () => handleRowClick(row) : () => {}}
            >
              {row.cells.map((cell) => (
                <td key={cell.column.Header} {...cell.getCellProps()}>
                  {cell.render("Cell")}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
