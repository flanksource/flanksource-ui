import { ColumnDef } from "@tanstack/table-core";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ConfigTypeChanges } from "../ConfigChanges";

import { DateCell } from "../ConfigViewer/columns";
import { PaginationOptions } from "../DataTable";
import EmptyState from "../EmptyState";
import { DataTable, Modal } from "../index";
import { JSONViewer } from "../JSONViewer";

const columns: ColumnDef<ConfigTypeChanges>[] = [
  {
    header: "Type",
    accessorKey: "change_type"
  },
  {
    header: "Created",
    accessorKey: "created_at",
    cell: DateCell
  },
  {
    header: "Changes",
    accessorKey: "patches",
    cell: function JSONViewCell({ row, column }) {
      const [modalIsOpen, setModalIsOpen] = useState(false);
      return (
        <>
          <Modal
            open={modalIsOpen}
            onClose={() => setModalIsOpen(false)}
            bodyClass=""
            title="Change"
          >
            <div
              className="flex flex-col h-full overflow-x-auto p-4"
              style={{
                maxHeight: "calc(100vh - 8rem)",
                zoom: !!row?.getValue(column.id) ? "0.7" : "1"
              }}
            >
              {!!row?.getValue(column.id) && (
                <JSONViewer
                  code={JSON.stringify(row?.getValue(column.id), null, 2)}
                  format="json"
                />
              )}
              {!row?.getValue(column.id) && (
                <EmptyState title="There are no changes" />
              )}
            </div>
          </Modal>
          <div
            className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
            onClick={(e) => {
              setModalIsOpen(true);
            }}
          >
            Show Change
          </div>
        </>
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
  pagination?: PaginationOptions;
};

export function ConfigChangeHistory({
  data,
  isLoading,
  linkConfig,
  className = "w-full",
  pagination,
  tableStyle
}: ConfigChangeHistoryProps) {
  return (
    <DataTable
      className={className}
      columns={linkConfig ? columns.concat(configLinkCol) : columns}
      data={data}
      isLoading={isLoading}
      stickyHead
      isVirtualized={false}
      tableStyle={tableStyle}
      pagination={pagination}
      virtualizedRowEstimatedHeight={500}
    />
  );
}
