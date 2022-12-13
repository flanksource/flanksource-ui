import { Link } from "react-router-dom";

import { FiExternalLink } from "react-icons/fi";
import { FaExclamationTriangle } from "react-icons/fa";

import { DateCell } from "../ConfigViewer/columns";
import { DataTable } from "../index";
import { JSONViewer } from "../JSONViewer";

const columns = [
  {
    Header: "Type",
    accessor: "change_type",
    Cell: function ({ row }) {
      if (row.original.severity === "failed") {
        return (
          <div className="flex flex-row">
            <FaExclamationTriangle className="text-red-500 w-5" />
            {row.original.change_type}
          </div>
        );
      }
      return row.original.change_type;
    },
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
      var patches = row.original.details || row.original.patches;
      return <JSONViewer code={JSON.stringify(patches, null, 2)} />;
    },
    cellClass: "px-5 py-2"
  },
  {
    Header: "Link",
    accessor: "source",
    Cell: function LinkCell({ row }) {
      if (!row.original.source?.startsWith("http")) {
        return null;
      }
      return (
        <a
          href={row.original.source}
          target="_blank"
          rel="noreferrer"
          className="underline"
        >
          <span>{row.original.source}</span>
          <FiExternalLink className="inline-block ml-1" />
        </a>
      );
    }
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
  return (
    <DataTable
      className="w-full"
      columns={linkConfig ? columns.concat(configLinkCol) : columns}
      data={data}
      isLoading={isLoading}
      stickyHead
      usageSection="config-change-history"
    />
  );
}
