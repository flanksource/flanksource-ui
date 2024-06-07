import { Avatar } from "@flanksource-ui/ui/Avatar";
import { DataTable } from "@flanksource-ui/ui/DataTable";
import { DateCell } from "@flanksource-ui/ui/DataTable/Cells/DateCells";
import { Modal } from "@flanksource-ui/ui/Modal";
import { CellContext, ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { LogBackends } from "./LogBackends";
import LogBackendsForm from "./LogBackendsForm";

const columns: ColumnDef<LogBackends>[] = [
  {
    header: "Name",
    accessorKey: "name"
  },
  {
    header: "Source",
    accessorKey: "source"
  },
  {
    header: "Created By",
    accessorKey: "created_by",
    cell: ({ getValue }: CellContext<LogBackends, any>) => {
      if (!getValue()) return null;
      return <Avatar user={getValue()} circular />;
    }
  },
  {
    header: "Created At",
    accessorKey: "created_at",
    cell: DateCell,
    sortingFn: "datetime"
  },
  {
    header: "Updated At",
    accessorKey: "updated_at",
    cell: DateCell,
    sortingFn: "datetime"
  }
];

type LogBackendsListProps = {
  data: LogBackends[];
  isLoading?: boolean;
  onUpdated?: () => void;
} & Omit<React.HTMLProps<HTMLDivElement>, "data">;

export default function LogBackendsList({
  data,
  isLoading,
  onUpdated = () => {},
  ...props
}: LogBackendsListProps) {
  const [selectedItem, setSelectedItem] = useState<LogBackends>();

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
        title="Edit Logging Backend"
        bodyClass="flex flex-col flex-1 overflow-y-auto"
        size="full"
      >
        <LogBackendsForm
          values={selectedItem}
          onUpdated={() => {
            setSelectedItem(undefined);
            onUpdated();
          }}
        />
      </Modal>
    </div>
  );
}
