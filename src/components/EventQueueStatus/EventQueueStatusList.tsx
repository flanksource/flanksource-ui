import { DataTable } from "@flanksource-ui/ui/DataTable";
import { DateCell } from "@flanksource-ui/ui/DataTable/Cells/DateCells";
import { Modal } from "@flanksource-ui/ui/Modal";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { EventQueueSummary } from "./eventQueue";

const columns: ColumnDef<EventQueueSummary>[] = [
  {
    header: "Name",
    accessorKey: "name",
    size: 200
  },
  {
    header: "Pending Count",
    accessorKey: "pending"
  },
  {
    header: "Error Count",
    accessorKey: "failed"
  },
  {
    header: "Average Attempts",
    accessorKey: "average_attempts"
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
  }
];

type EventQueueStatusListProps = {
  data: EventQueueSummary[];
  isLoading?: boolean;
  onUpdated?: () => void;
} & Omit<React.HTMLProps<HTMLDivElement>, "data">;

export default function EventQueueStatusList({
  data,
  isLoading,
  onUpdated = () => {},
  ...props
}: EventQueueStatusListProps) {
  const [selectedItem, setSelectedItem] = useState<EventQueueSummary>();

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

      {
        <Modal
          open={!!selectedItem && !!selectedItem?.most_common_error}
          onClose={() => setSelectedItem(undefined)}
          title={`Most Common Error for ${selectedItem?.name}`}
        >
          <div className="flex flex-1 flex-col p-4">
            <p> {selectedItem?.most_common_error}</p>
          </div>
        </Modal>
      }
    </div>
  );
}
