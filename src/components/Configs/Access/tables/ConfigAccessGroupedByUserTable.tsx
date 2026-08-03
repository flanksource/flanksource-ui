import { useConfigAccessGroupedByUserQuery } from "@flanksource-ui/api/query-hooks/useConfigAccessGroupedQuery";
import { ConfigAccessSummaryByUser } from "@flanksource-ui/api/types/configs";
import {
  AddExternalUserAliasDialog,
  ExternalUserAction,
  ExternalUserActionsMenu,
  MergeExternalUserDialog
} from "@flanksource-ui/components/Configs/Access/ExternalUserActions";
import { InfoMessage } from "@flanksource-ui/components/InfoMessage";
import { useUserAccessStateContext } from "@flanksource-ui/context/UserAccessContext/UserAccessContext";
import { tables } from "@flanksource-ui/context/UserAccessContext/permissions";
import {
  CATALOG_ACCESS_GROUP_USER_TABLE_PREFIX,
  useCatalogAccessUrlState
} from "@flanksource-ui/hooks/useCatalogAccessUrlState";
import useReactTablePaginationState from "@flanksource-ui/ui/DataTable/Hooks/useReactTablePaginationState";
import MRTDataTable from "@flanksource-ui/ui/MRTDataTable/MRTDataTable";
import { MRT_ColumnDef, MRT_Row } from "mantine-react-table";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  GroupedByUserIdentityCell,
  GroupedByUserLastSignedInCell,
  GroupedByUserLatestGrantCell
} from "./cells";

const groupedByUserColumns: MRT_ColumnDef<ConfigAccessSummaryByUser>[] = [
  {
    header: "User",
    accessorKey: "user",
    Cell: GroupedByUserIdentityCell,
    size: 280
  },
  {
    header: "Roles",
    accessorKey: "distinct_roles",
    size: 100,
    Cell: ({ cell }) => <span>{cell.getValue<number>()}</span>
  },
  {
    header: "Catalogs",
    accessorKey: "distinct_configs",
    size: 100,
    Cell: ({ cell }) => <span>{cell.getValue<number>()}</span>
  },
  {
    header: "Last Signed In",
    accessorKey: "last_signed_in_at",
    sortingFn: "datetime",
    size: 160,
    Cell: GroupedByUserLastSignedInCell
  },
  {
    header: "Latest Grant",
    accessorKey: "latest_grant",
    sortingFn: "datetime",
    size: 160,
    Cell: GroupedByUserLatestGrantCell
  }
];

export function ConfigAccessGroupedByUserTable() {
  const {
    actions: { drillDownByUser }
  } = useCatalogAccessUrlState();
  const { hasResourceAccess, roles } = useUserAccessStateContext();
  const [canManageExternalUsers, setCanManageExternalUsers] = useState(false);
  const [selectedAction, setSelectedAction] = useState<{
    action: ExternalUserAction;
    user: ConfigAccessSummaryByUser;
  }>();

  useEffect(() => {
    let active = true;
    setCanManageExternalUsers(false);
    void hasResourceAccess(tables.catalog, "write")
      .then((hasAccess) => {
        if (active) setCanManageExternalUsers(hasAccess);
      })
      .catch(() => {
        if (active) setCanManageExternalUsers(false);
      });
    return () => {
      active = false;
    };
  }, [hasResourceAccess, roles]);

  const openAction = useCallback(
    (action: ExternalUserAction, user: ConfigAccessSummaryByUser) => {
      setSelectedAction({ action, user });
    },
    []
  );

  const columns = useMemo<MRT_ColumnDef<ConfigAccessSummaryByUser>[]>(() => {
    if (!canManageExternalUsers) return groupedByUserColumns;

    return [
      ...groupedByUserColumns,
      {
        header: "Actions",
        id: "actions",
        enableSorting: false,
        enableColumnActions: false,
        size: 60,
        Cell: ({ row }: { row: MRT_Row<ConfigAccessSummaryByUser> }) => (
          <ExternalUserActionsMenu user={row.original} onAction={openAction} />
        )
      }
    ];
  }, [canManageExternalUsers, openAction]);

  const { pageSize } = useReactTablePaginationState({
    paramPrefix: CATALOG_ACCESS_GROUP_USER_TABLE_PREFIX,
    defaultPageSize: 50
  });

  const { data, isLoading, isRefetching, error } =
    useConfigAccessGroupedByUserQuery();

  const rows = data?.data ?? [];
  const totalRecords = data?.totalEntries ?? 0;
  const totalPages = Math.ceil(totalRecords / pageSize);

  const handleRowClick = useCallback(
    (row: ConfigAccessSummaryByUser) => {
      drillDownByUser(row.external_user_id);
    },
    [drillDownByUser]
  );

  if (error) {
    const errorMessage =
      typeof error === "string"
        ? error
        : ((error as Record<string, string>)?.message ??
          "Something went wrong");

    return <InfoMessage message={errorMessage} />;
  }

  return (
    <>
      <MRTDataTable
        columns={columns}
        data={rows}
        isLoading={isLoading}
        isRefetching={isRefetching}
        enableServerSideSorting
        enableServerSidePagination
        totalRowCount={totalRecords}
        manualPageCount={totalPages}
        disableHiding
        defaultPageSize={pageSize}
        onRowClick={handleRowClick}
        urlParamPrefix={CATALOG_ACCESS_GROUP_USER_TABLE_PREFIX}
      />

      {selectedAction?.action === "alias" && (
        <AddExternalUserAliasDialog
          user={selectedAction.user}
          open
          onOpenChange={(open) => {
            if (!open) setSelectedAction(undefined);
          }}
        />
      )}
      {selectedAction?.action === "merge" && (
        <MergeExternalUserDialog
          primary={selectedAction.user}
          open
          onOpenChange={(open) => {
            if (!open) setSelectedAction(undefined);
          }}
        />
      )}
    </>
  );
}
