import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { Modal } from "../../ui/Modal";
import { DateCell } from "../../ui/table";
import { DataTable } from "../DataTable";
import { EventQueueStatus } from "./eventQueue";

const columns: ColumnDef<EventQueueStatus>[] = [
  {
    header: "Table",
    accessorKey: "table",
    size: 200
  },
  {
    header: "First Failed At",
    accessorKey: "first_failure",
    cell: DateCell,
    sortingFn: "datetime"
  },
  {
    header: "Last Failed At",
    accessorKey: "last_failure",
    cell: DateCell,
    sortingFn: "datetime"
  },

  {
    header: "Error Count",
    accessorKey: "error_count"
  },
  {
    header: "Average Attempts",
    accessorKey: "average_attempts"
  }
];

type EventQueueStatusListProps = {
  data: EventQueueStatus[];
  isLoading?: boolean;
  onUpdated?: () => void;
} & Omit<React.HTMLProps<HTMLDivElement>, "data">;

export default function EventQueueStatusList({
  data,
  isLoading,
  onUpdated = () => {},
  ...props
}: EventQueueStatusListProps) {
  const [selectedItem, setSelectedItem] = useState<EventQueueStatus>();

  return (
    <div {...props}>
      <DataTable
        stickyHead
        columns={columns}
        data={data}
        tableStyle={{ borderSpacing: "0" }}
        isLoading={isLoading}
        style={{ maxHeight: "calc(100vh - 12rem)" }}
        preferencesKey="connections-list"
        savePreferences={false}
        handleRowClick={(row) => setSelectedItem(row.original)}
      />

      <Modal
        open={!!selectedItem}
        onClose={() => setSelectedItem(undefined)}
        title={`Most Common Error for ${selectedItem?.table}`}
        bodyClass="flex flex-col flex-1 overflow-y-auto"
        size="full"
      >
        <div className="flex flex-col flex-1">
          <p> {selectedItem?.most_common_error}</p>
        </div>
      </Modal>
    </div>
  );
}
