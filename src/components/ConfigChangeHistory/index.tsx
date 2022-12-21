import { ColumnDef } from "@tanstack/table-core";
import { Link } from "react-router-dom";
import { ConfigTypeChanges } from "../ConfigChanges";

import { DateCell } from "../ConfigViewer/columns";
import { DataTable } from "../index";
import { JSONViewer } from "../JSONViewer";

const columns: ColumnDef<ConfigTypeChanges>[] = [
  {
    header: "Type",
    accessorKey: "change_type"
    // cellClass: `px-5 py-2`
  },
  {
    header: "Created",
    accessorKey: "created_at",
    cell: DateCell
    // cellClass: `px-5 py-2`
  },
  {
    header: "Changes",
    accessorKey: "patches",
    cell: function JSONViewCell({ row, column }) {
      return (
        <JSONViewer
          code={JSON.stringify(row?.getValue(column.id), null, 2)}
          format="json"
        />
      );
    }
    // cellClass: "px-5 py-2"
  }
];

const configLinkCol: ColumnDef<ConfigTypeChanges>[] = [
  {
    header: "Config",
    accessorKey: "config_id",
    cell: function ConfigLink({ row, column }) {
      const id = row?.getValue(column.id);

      return (
        <Link
          className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
          to={`/configs/${id}`}
        >
          Show Config
        </Link>
      );
    }
    // cellClass: "px-5 py-2"
  }
];

type ConfigChangeHistoryProps = {
  data: ConfigTypeChanges[];
  isLoading?: boolean;
  linkConfig?: boolean;
  className?: string;
  tableStyle?: React.CSSProperties;
};

export function ConfigChangeHistory({
  data,
  isLoading,
  linkConfig,
  className = "w-full",
  tableStyle
}: ConfigChangeHistoryProps) {
  return (
    <DataTable
      className={className}
      columns={linkConfig ? columns.concat(configLinkCol) : columns}
      data={data}
      isLoading={isLoading}
      stickyHead
      isVirtualized
      tableStyle={tableStyle}
      virtualizedRowEstimatedHeight={500}
    />
  );
}
