import {
  deletePermissionGroup,
  fetchPermissionGroups,
  PermissionGroup
} from "@flanksource-ui/api/services/permissions";
import { getErrorMessage } from "@flanksource-ui/api/types/error";
import LegacyPermissionDetails from "@flanksource-ui/components/Permissions/LegacyPermissionDetails";
import LegacyPermissionsBanner from "@flanksource-ui/components/Permissions/LegacyPermissionsBanner";
import PermissionsTabsLinks from "@flanksource-ui/components/Permissions/PermissionsTabsLinks";
import CRDSource from "@flanksource-ui/components/Settings/CRDSource";
import { Badge } from "@flanksource-ui/ui/Badge/Badge";
import useReactTablePaginationState from "@flanksource-ui/ui/DataTable/Hooks/useReactTablePaginationState";
import { MRTDateCell } from "@flanksource-ui/ui/MRTDataTable/Cells/MRTDateCells";
import MRTDataTable from "@flanksource-ui/ui/MRTDataTable/MRTDataTable";
import { useQuery } from "@tanstack/react-query";
import { MRT_ColumnDef } from "mantine-react-table";
import { useState } from "react";

const columns: MRT_ColumnDef<PermissionGroup>[] = [
  {
    header: "Name",
    id: "name",
    size: 100,
    Cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span>{row.original.name}</span>
        {row.original.namespace && (
          <Badge text={row.original.namespace} color="gray" />
        )}
      </div>
    )
  },
  {
    header: "Members",
    id: "members",
    size: 150,
    Cell: ({ row }) => {
      const members = Object.entries(row.original.selectors ?? {})
        .filter(([, value]) => Array.isArray(value) && value.length > 0)
        .map(([kind, value]) => `${(value as unknown[]).length} ${kind}`);
      return (
        <span className="text-sm text-gray-600">
          {members.length > 0 ? members.join(", ") : "None"}
        </span>
      );
    }
  },
  {
    header: "Source",
    id: "source",
    size: 50,
    Cell: ({ row }) => (
      <CRDSource
        source={row.original.source}
        id={row.original.id}
        showMinimal
      />
    )
  },
  {
    header: "Created",
    id: "created_at",
    size: 70,
    accessorFn: (row) => row.created_at,
    Cell: MRTDateCell
  },
  {
    header: "Updated",
    id: "updated_at",
    size: 70,
    accessorFn: (row) => row.updated_at,
    Cell: MRTDateCell
  }
];

// PermissionGroupsPage lists the deprecated Permission Groups that remain,
// read-only, so they can be recreated as Role Bindings.
export default function PermissionGroupsPage() {
  const { pageSize, pageIndex } = useReactTablePaginationState();
  const [selected, setSelected] = useState<PermissionGroup>();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["permission_groups", { pageIndex, pageSize }],
    queryFn: () => fetchPermissionGroups({ pageIndex, pageSize }),
    keepPreviousData: true
  });

  const totalEntries = data?.totalEntries ?? 0;

  return (
    <>
      <PermissionsTabsLinks
        activeTab="Permission Groups"
        loading={isLoading}
        onRefresh={() => refetch()}
      >
        <div className="flex h-full flex-col gap-2 overflow-y-auto px-6 py-6">
          <LegacyPermissionsBanner />
          {isError ? (
            <p className="py-12 text-center text-red-600">
              Error loading permission groups: {getErrorMessage(error)}
            </p>
          ) : (
            <MRTDataTable
              columns={columns}
              data={data?.data ?? []}
              isLoading={isLoading}
              manualPageCount={
                totalEntries ? Math.ceil(totalEntries / pageSize) : 1
              }
              totalRowCount={totalEntries}
              enableServerSidePagination
              onRowClick={setSelected}
            />
          )}
        </div>
      </PermissionsTabsLinks>

      {selected && (
        <LegacyPermissionDetails
          title="Permission Group"
          record={selected}
          onDelete={deletePermissionGroup}
          onClose={() => {
            setSelected(undefined);
            refetch();
          }}
        />
      )}
    </>
  );
}
