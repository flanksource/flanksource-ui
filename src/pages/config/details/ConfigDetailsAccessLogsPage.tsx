import useConfigAccessLogsQuery from "@flanksource-ui/api/query-hooks/useConfigAccessLogsQuery";
import { ConfigAccessLog } from "@flanksource-ui/api/types/configs";
import { ConfigDetailsTabs } from "@flanksource-ui/components/Configs/ConfigDetailsTabs";
import { ExternalUserCell } from "@flanksource-ui/components/Configs/ExternalUserCell";
import { Age } from "@flanksource-ui/ui/Age";
import { MRTCellProps } from "@flanksource-ui/ui/MRTDataTable/MRTCellProps";
import MRTDataTable from "@flanksource-ui/ui/MRTDataTable/MRTDataTable";
import { MRT_ColumnDef } from "mantine-react-table";
import { useMemo } from "react";
import { useParams } from "react-router-dom";

const MFACell = ({ cell }: MRTCellProps<ConfigAccessLog>) => {
  const value = cell.getValue<boolean | null>();
  if (value === null || value === undefined) {
    return <span className="text-gray-400">—</span>;
  }
  return value ? (
    <span className="font-medium text-green-600">Yes</span>
  ) : (
    <span className="font-medium text-red-600">No</span>
  );
};

const PropertiesCell = ({ cell }: MRTCellProps<ConfigAccessLog>) => {
  const value = cell.getValue<Record<string, any> | null>();
  if (!value || Object.keys(value).length === 0) {
    return <span className="text-gray-400">—</span>;
  }

  return (
    <div className="max-w-xs truncate" title={JSON.stringify(value, null, 2)}>
      {JSON.stringify(value)}
    </div>
  );
};

const UserCell = ({ row }: MRTCellProps<ConfigAccessLog>) => {
  const user = row.original.external_users;
  return <ExternalUserCell user={user} />;
};

export function ConfigDetailsAccessLogsPage() {
  const { id } = useParams();
  const {
    data: accessLogsData,
    isLoading,
    refetch
  } = useConfigAccessLogsQuery(id);

  const columns = useMemo<MRT_ColumnDef<ConfigAccessLog>[]>(
    () => [
      {
        header: "User",
        accessorKey: "external_users",
        Cell: UserCell,
        size: 250
      },
      {
        header: "Accessed At",
        accessorKey: "created_at",
        Cell: ({ cell }) => <Age from={cell.getValue<string>()} />,
        sortingFn: "datetime",
        size: 180
      },
      {
        header: "MFA",
        accessorKey: "mfa",
        Cell: MFACell,
        size: 80
      },
      {
        header: "Properties",
        accessorKey: "properties",
        Cell: PropertiesCell,
        size: 250
      }
    ],
    []
  );

  const rows = accessLogsData?.data ?? [];

  return (
    <ConfigDetailsTabs
      pageTitlePrefix={"Access Logs"}
      isLoading={isLoading}
      refetch={refetch}
      activeTabName="Access Logs"
    >
      <div className="flex h-full flex-1 flex-col gap-2 overflow-y-auto">
        <div className="flex flex-1 flex-col overflow-y-auto">
          <MRTDataTable
            columns={columns}
            data={rows}
            isLoading={isLoading}
            disablePagination
            defaultSorting={[{ id: "created_at", desc: true }]}
          />
        </div>
      </div>
    </ConfigDetailsTabs>
  );
}
