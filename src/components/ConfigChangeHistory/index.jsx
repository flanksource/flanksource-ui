import { Link, useSearchParams } from "react-router-dom";

import { DateCell } from "../ConfigViewer/columns";
import { DataTable } from "../index";
import { JSONViewer } from "../JSONViewer";

const columns = [
  {
    Header: "Type",
    accessor: "change_type",
    cellClass: `px-5 py-2`
  },
  {
    Header: "Created",
    accessor: "created_at",
    Cell: DateCell,
    cellClass: `px-5 py-2`
  },
  {
    Header: "Changes",
    accessor: "patches",
    Cell: function JSONViewCell({ row, column }) {
      return (
        <JSONViewer code={JSON.stringify(row?.values[column.id], null, 2)} />
      );
    },
    cellClass: "px-5 py-2"
  }
];

const configLinkCol = [
  {
    Header: "Config",
    accessor: "config_id",
    Cell: function ConfigLink({ row, column }) {
      const id = row?.values[column.id];

      return (
        <Link
          className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
          to={`/configs/${id}`}
        >
          Show Config
        </Link>
      );
    },
    cellClass: "px-5 py-2"
  }
];

export function ConfigChangeHistory({ data, isLoading, linkConfig }) {
  const [queryParams, setQueryParams] = useSearchParams({
    sortBy: "",
    sortOrder: ""
  });

  const sortField = queryParams.get("sortBy");
  const isSortOrderDesc = queryParams.get("sortOrder") === "asc" ? false : true;

  const setSortBy = (field, order) => {
    if (field === undefined && order === undefined) {
      queryParams.delete("sortBy");
      queryParams.delete("sortOrder");
    } else {
      queryParams.set("sortBy", field);
      queryParams.set("sortOrder", order);
    }
    setQueryParams(queryParams);
  };

  return (
    <DataTable
      className="w-full"
      columns={linkConfig ? columns.concat(configLinkCol) : columns}
      data={data}
      isLoading={isLoading}
      stickyHead
      sortBy={
        sortField
          ? [
              {
                id: sortField,
                desc: isSortOrderDesc
              }
            ]
          : []
      }
      setSortOptions={setSortBy}
    />
  );
}
