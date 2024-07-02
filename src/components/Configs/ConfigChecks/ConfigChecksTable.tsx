import { ConfigHealthCheckView } from "@flanksource-ui/api/types/configs";
import { CheckLink } from "@flanksource-ui/components/Canary/HealthChecks/CheckLink";
import { DataTable } from "@flanksource-ui/ui/DataTable";
import { ColumnDef } from "@tanstack/react-table";

export const configChecksColumns: ColumnDef<ConfigHealthCheckView>[] = [
  {
    id: "Check",
    header: "Check",
    cell: ({ row }) => {
      return <CheckLink check={row.original} />;
    }
  }
];

type ConfigChecksTableProps = {
  data: ConfigHealthCheckView[];
};

export default function ConfigChecksTable({ data }: ConfigChecksTableProps) {
  return <DataTable columns={configChecksColumns} data={data} />;
}
