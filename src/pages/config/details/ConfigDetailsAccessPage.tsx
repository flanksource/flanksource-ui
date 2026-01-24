import useConfigAccessSummaryQuery from "@flanksource-ui/api/query-hooks/useConfigAccessSummaryQuery";
import { ConfigAccessSummary } from "@flanksource-ui/api/types/configs";
import { ConfigDetailsTabs } from "@flanksource-ui/components/Configs/ConfigDetailsTabs";
import { ExternalUserCell } from "@flanksource-ui/components/Configs/ExternalUserCell";
import { Age } from "@flanksource-ui/ui/Age";
import { Badge } from "@flanksource-ui/ui/Badge/Badge";
import { MRTCellProps } from "@flanksource-ui/ui/MRTDataTable/MRTCellProps";
import MRTDataTable from "@flanksource-ui/ui/MRTDataTable/MRTDataTable";
import { MRT_ColumnDef } from "mantine-react-table";
import { useMemo } from "react";
import { useParams } from "react-router-dom";

const UserCell = ({ row }: MRTCellProps<ConfigAccessSummary>) => {
  const user = {
    name: row.original.user,
    user_email: row.original.email || null
  };
  return <ExternalUserCell user={user} />;
};

const RoleCell = ({ cell }: MRTCellProps<ConfigAccessSummary>) => {
  const value = cell.getValue<string | null>();
  return value ? (
    <span>{value}</span>
  ) : (
    <span className="text-gray-400">—</span>
  );
};

const LastSignedInCell = ({ cell }: MRTCellProps<ConfigAccessSummary>) => {
  const value = cell.getValue<string | null>();
  if (!value) {
    return <span className="text-gray-400">Never</span>;
  }
  return <Age from={value} />;
};

const OptionalDateCell = ({ cell }: MRTCellProps<ConfigAccessSummary>) => {
  const value = cell.getValue<string | null>();
  if (!value) {
    return <span className="text-gray-400">—</span>;
  }
  return <Age from={value} />;
};

const AccessTypeCell = ({ row }: MRTCellProps<ConfigAccessSummary>) => {
  const groupId = row.original.external_group_id;
  if (groupId) {
    return <Badge text="Group" color="yellow" title={`Group ID: ${groupId}`} />;
  }

  return <Badge text="Direct" color="gray" />;
};

export function ConfigDetailsAccessPage() {
  const { id } = useParams();
  const {
    data: accessSummary,
    isLoading,
    refetch
  } = useConfigAccessSummaryQuery(id);

  const columns = useMemo<MRT_ColumnDef<ConfigAccessSummary>[]>(
    () => [
      {
        header: "User",
        accessorKey: "user",
        Cell: UserCell,
        size: 220
      },
      {
        header: "Role",
        accessorKey: "role",
        Cell: RoleCell,
        size: 120
      },
      {
        header: "Access",
        accessorKey: "external_group_id",
        Cell: AccessTypeCell,
        size: 120
      },
      {
        header: "Last Signed In",
        accessorKey: "last_signed_in_at",
        Cell: LastSignedInCell,
        sortingFn: "datetime",
        size: 160
      },
      {
        header: "Last Reviewed",
        accessorKey: "last_reviewed_at",
        Cell: OptionalDateCell,
        sortingFn: "datetime",
        size: 160
      },
      {
        header: "Granted",
        accessorKey: "created_at",
        Cell: OptionalDateCell,
        sortingFn: "datetime",
        size: 140
      }
    ],
    []
  );

  const rows = accessSummary?.data ?? [];

  return (
    <ConfigDetailsTabs
      pageTitlePrefix={"Catalog Access"}
      isLoading={isLoading}
      refetch={refetch}
      activeTabName="Access"
    >
      <div className="flex h-full flex-1 flex-col gap-2 overflow-y-auto">
        <div className="flex flex-1 flex-col overflow-y-auto">
          <MRTDataTable
            columns={columns}
            data={rows}
            isLoading={isLoading}
            disablePagination
            defaultSorting={[{ id: "user", desc: false }]}
          />
        </div>
      </div>
    </ConfigDetailsTabs>
  );
}
