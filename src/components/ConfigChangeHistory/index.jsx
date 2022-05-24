import React from "react";

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
    Header: "Summary",
    accessor: "summary",
    cellClass: `px-5 py-2`
  },
  {
    Header: "Created",
    accessor: "created_at",
    Cell: DateCell,
    cellClass: `px-5 py-2`
  },
  {
    Header: "Diff",
    accessor: "patches",
    Cell: function JSONViewCell({ row, column }) {
      return (
        <JSONViewer code={JSON.stringify(row?.values[column.id], null, 2)} />
      );
    },
    cellClass: "px-5 py-2"
  }
];

export function ConfigChangeHistory({ data, isLoading }) {
  return (
    <DataTable
      columns={columns}
      data={data}
      tableStyle={{ borderSpacing: "0" }}
      isLoading={isLoading}
    />
  );
}
