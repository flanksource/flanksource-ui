import { CellContext, ColumnDef } from "@tanstack/react-table";
import { LogBackends } from "./LogBackends";
import { Avatar } from "../Avatar";
import { DataTable } from "../DataTable";
import { useState } from "react";
import { Modal } from "../Modal";
import LogBackendsForm from "./LogBackendsForm";
import { DateCell } from "../../ui/table";

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
