import { useAllConfigAccessSummaryQuery } from "@flanksource-ui/api/query-hooks/useAllConfigAccessSummaryQuery";
import {
  useConfigAccessGroupedByUserQuery,
  useConfigAccessGroupedByConfigQuery
} from "@flanksource-ui/api/query-hooks/useConfigAccessGroupedQuery";
import {
  getConfigAccessSummaryCatalogFilter,
  getConfigAccessSummaryRolesFilter,
  getConfigAccessSummaryUsersFilter
} from "@flanksource-ui/api/services/configs";
import {
  ConfigAccessGroupBy,
  ConfigAccessSummary,
  ConfigAccessSummaryByConfig,
  ConfigAccessSummaryByUser
} from "@flanksource-ui/api/types/configs";
import ConfigPageTabs from "@flanksource-ui/components/Configs/ConfigPageTabs";
import ConfigLink from "@flanksource-ui/components/Configs/ConfigLink/ConfigLink";
import ConfigsTypeIcon from "@flanksource-ui/components/Configs/ConfigsTypeIcon";
import { ExternalUserCell } from "@flanksource-ui/components/Configs/ExternalUserCell";
import FormikFilterForm from "@flanksource-ui/components/Forms/FormikFilterForm";
import { InfoMessage } from "@flanksource-ui/components/InfoMessage";
import { Age } from "@flanksource-ui/ui/Age";
import { Badge } from "@flanksource-ui/ui/Badge/Badge";
import {
  BreadcrumbChild,
  BreadcrumbNav,
  BreadcrumbRoot
} from "@flanksource-ui/ui/BreadcrumbNav";
import FilterByCellValue from "@flanksource-ui/ui/DataTable/FilterByCellValue";
import {
  GroupByOptions,
  MultiSelectDropdown
} from "@flanksource-ui/ui/Dropdowns/MultiSelectDropdown";
import TristateReactSelect, {
  TriStateOptions
} from "@flanksource-ui/ui/Dropdowns/TristateReactSelect";
import { Head } from "@flanksource-ui/ui/Head";
import { SearchLayout } from "@flanksource-ui/ui/Layout/SearchLayout";
import { MRTCellProps } from "@flanksource-ui/ui/MRTDataTable/MRTCellProps";
import MRTDataTable from "@flanksource-ui/ui/MRTDataTable/MRTDataTable";
import { refreshButtonClickedTrigger } from "@flanksource-ui/ui/SlidingSideBar/SlidingSideBar";
import { useQuery } from "@tanstack/react-query";
import { useField } from "formik";
import { useAtom } from "jotai";
import { MRT_ColumnDef } from "mantine-react-table";
import { useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const paramsToReset = ["pageIndex"];

function toTriStateIncludeParamValue(value: string) {
  return `${value.replaceAll(",", "||||").replaceAll(":", "____")}:1`;
}

// ---------------------------------------------------------------------------
// Filter dropdowns
// ---------------------------------------------------------------------------

const groupByOptions: GroupByOptions[] = [
  { label: "None", value: "" },
  { label: "User", value: "user" },
  { label: "Catalog", value: "config" }
];

function GroupByDropdown({ effectiveGroupBy }: { effectiveGroupBy: string }) {
  const navigate = useNavigate();

  const value =
    groupByOptions.find((o) => o.value === effectiveGroupBy) ??
    groupByOptions[0];

  return (
    <MultiSelectDropdown
      options={groupByOptions}
      value={value}
      isMulti={false}
      isClearable={false}
      closeMenuOnSelect
      onChange={(selected) => {
        const option = selected as GroupByOptions | null;
        if (option?.value) {
          navigate(`/catalog/access?groupBy=${option.value}`);
        } else {
          navigate(`/catalog/access?groupBy=none`);
        }
      }}
      label="Group By"
      className="w-44"
      minMenuWidth="180px"
      defaultValue="None"
    />
  );
}

function CatalogDropdown() {
  const [field] = useField({ name: "config_id" });

  const { data, isLoading } = useQuery({
    queryKey: ["config", "access-summary", "filter", "catalog"],
    queryFn: getConfigAccessSummaryCatalogFilter,
    select: useCallback(
      (
        items: Awaited<ReturnType<typeof getConfigAccessSummaryCatalogFilter>>
      ) =>
        items.map(
          (item) =>
            ({
              id: item.config_id,
              label: item.config_name,
              value: item.config_id
            }) satisfies TriStateOptions
        ),
      []
    )
  });

  return (
    <TristateReactSelect
      options={data ?? []}
      isLoading={isLoading}
      value={field.value}
      minMenuWidth="20rem"
      onChange={(value) => {
        if (value && value !== "all") {
          field.onChange({ target: { name: "config_id", value } });
        } else {
          field.onChange({ target: { name: "config_id", value: undefined } });
        }
      }}
      label="Catalog"
    />
  );
}

function UserDropdown() {
  const [field] = useField({ name: "user" });

  const { data, isLoading } = useQuery({
    queryKey: ["config", "access-summary", "filter", "user"],
    queryFn: getConfigAccessSummaryUsersFilter,
    select: useCallback(
      (items: Awaited<ReturnType<typeof getConfigAccessSummaryUsersFilter>>) =>
        items.map(
          (item) =>
            ({
              id: item.email ?? item.user,
              label: item.user,
              value: item.user
            }) satisfies TriStateOptions
        ),
      []
    )
  });

  return (
    <TristateReactSelect
      options={data ?? []}
      isLoading={isLoading}
      value={field.value}
      minMenuWidth="16rem"
      onChange={(value) => {
        if (value && value !== "all") {
          field.onChange({ target: { name: "user", value } });
        } else {
          field.onChange({ target: { name: "user", value: undefined } });
        }
      }}
      label="User"
    />
  );
}

function RoleDropdown() {
  const [field] = useField({ name: "role" });

  const { data, isLoading } = useQuery({
    queryKey: ["config", "access-summary", "filter", "role"],
    queryFn: getConfigAccessSummaryRolesFilter,
    select: useCallback(
      (items: Awaited<ReturnType<typeof getConfigAccessSummaryRolesFilter>>) =>
        items.map(
          (item) =>
            ({
              id: item.role,
              label: item.role,
              value: item.role
            }) satisfies TriStateOptions
        ),
      []
    )
  });

  return (
    <TristateReactSelect
      options={data ?? []}
      isLoading={isLoading}
      value={field.value}
      minMenuWidth="16rem"
      onChange={(value) => {
        if (value && value !== "all") {
          field.onChange({ target: { name: "role", value } });
        } else {
          field.onChange({ target: { name: "role", value: undefined } });
        }
      }}
      label="Role"
    />
  );
}

// ---------------------------------------------------------------------------
// Flat table cell renderers (existing)
// ---------------------------------------------------------------------------

const ConfigCell = ({ row }: MRTCellProps<ConfigAccessSummary>) => {
  const configId = row.original.config_id;
  const configType = row.original.config_type;
  const configName = row.original.config_name;

  if (!configId || !configType || !configName) {
    return <span className="text-gray-400">—</span>;
  }

  return (
    <FilterByCellValue
      filterValue={configId}
      paramKey="config_id"
      paramsToReset={paramsToReset}
    >
      <ConfigLink
        config={{
          id: configId,
          type: configType,
          name: configName
        }}
        configId={configId}
        showSecondaryIcon
      />
    </FilterByCellValue>
  );
};

const UserCell = ({ row }: MRTCellProps<ConfigAccessSummary>) => {
  const userName = row.original.user;

  const user = {
    name: userName,
    user_email: row.original.email || null
  };

  if (!userName) {
    return <span className="text-gray-400">—</span>;
  }

  return (
    <FilterByCellValue
      filterValue={userName}
      paramKey="user"
      paramsToReset={paramsToReset}
    >
      <ExternalUserCell user={user} />
    </FilterByCellValue>
  );
};

const RoleCell = ({ cell }: MRTCellProps<ConfigAccessSummary>) => {
  const value = cell.getValue<string | null>();

  if (!value) {
    return <span className="text-gray-400">—</span>;
  }

  return (
    <FilterByCellValue
      filterValue={value}
      paramKey="role"
      paramsToReset={paramsToReset}
    >
      <span>{value}</span>
    </FilterByCellValue>
  );
};

const TypeCell = ({ cell }: MRTCellProps<ConfigAccessSummary>) => {
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

// ---------------------------------------------------------------------------
// Flat table columns
// ---------------------------------------------------------------------------

const flatColumns: MRT_ColumnDef<ConfigAccessSummary>[] = [
  {
    header: "Catalog",
    accessorKey: "config_name",
    Cell: ConfigCell,
    size: 240
  },
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
    header: "Type",
    accessorKey: "user_type",
    Cell: TypeCell,
    size: 120
  },
  {
    header: "Access",
    accessorKey: "access",
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
];

// ---------------------------------------------------------------------------
// Grouped-by-user columns
// ---------------------------------------------------------------------------

const groupedByUserColumns: MRT_ColumnDef<ConfigAccessSummaryByUser>[] = [
  {
    header: "User",
    accessorKey: "user",
    Cell: ({ row }: MRTCellProps<ConfigAccessSummaryByUser>) => {
      const user = {
        name: row.original.user,
        user_email: row.original.email || null
      };
      return (
        <div className="flex flex-row items-center gap-2">
          <ExternalUserCell user={user} />
          <Badge text={row.original.access_count} />
        </div>
      );
    },
    size: 280
  },
  {
    header: "Roles",
    accessorKey: "distinct_roles",
    size: 100,
    Cell: ({ cell }: MRTCellProps<ConfigAccessSummaryByUser>) => (
      <span>{cell.getValue<number>()}</span>
    )
  },
  {
    header: "Catalogs",
    accessorKey: "distinct_configs",
    size: 100,
    Cell: ({ cell }: MRTCellProps<ConfigAccessSummaryByUser>) => (
      <span>{cell.getValue<number>()}</span>
    )
  },
  {
    header: "Last Signed In",
    accessorKey: "last_signed_in_at",
    sortingFn: "datetime",
    size: 160,
    Cell: ({ cell }: MRTCellProps<ConfigAccessSummaryByUser>) => {
      const value = cell.getValue<string | null>();
      if (!value) {
        return <span className="text-gray-400">Never</span>;
      }
      return <Age from={value} />;
    }
  },
  {
    header: "Latest Grant",
    accessorKey: "latest_grant",
    sortingFn: "datetime",
    size: 160,
    Cell: ({ cell }: MRTCellProps<ConfigAccessSummaryByUser>) => {
      const value = cell.getValue<string | null>();
      if (!value) {
        return <span className="text-gray-400">—</span>;
      }
      return <Age from={value} />;
    }
  }
];

// ---------------------------------------------------------------------------
// Grouped-by-config columns
// ---------------------------------------------------------------------------

const groupedByConfigColumns: MRT_ColumnDef<ConfigAccessSummaryByConfig>[] = [
  {
    header: "Catalog",
    accessorKey: "config_name",
    Cell: ({ row }: MRTCellProps<ConfigAccessSummaryByConfig>) => {
      const { config_id, config_type, config_name, access_count } =
        row.original;
      return (
        <div className="flex flex-row items-center gap-2">
          <ConfigLink
            config={{
              id: config_id,
              type: config_type,
              name: config_name
            }}
            configId={config_id}
            showSecondaryIcon
          />
          <Badge text={access_count} />
        </div>
      );
    },
    size: 300
  },
  {
    header: "Users",
    accessorKey: "distinct_users",
    size: 100,
    Cell: ({ cell }: MRTCellProps<ConfigAccessSummaryByConfig>) => (
      <span>{cell.getValue<number>()}</span>
    )
  },
  {
    header: "Roles",
    accessorKey: "distinct_roles",
    size: 100,
    Cell: ({ cell }: MRTCellProps<ConfigAccessSummaryByConfig>) => (
      <span>{cell.getValue<number>()}</span>
    )
  },
  {
    header: "Last Signed In",
    accessorKey: "last_signed_in_at",
    sortingFn: "datetime",
    size: 160,
    Cell: ({ cell }: MRTCellProps<ConfigAccessSummaryByConfig>) => {
      const value = cell.getValue<string | null>();
      if (!value) {
        return <span className="text-gray-400">Never</span>;
      }
      return <Age from={value} />;
    }
  },
  {
    header: "Latest Grant",
    accessorKey: "latest_grant",
    sortingFn: "datetime",
    size: 160,
    Cell: ({ cell }: MRTCellProps<ConfigAccessSummaryByConfig>) => {
      const value = cell.getValue<string | null>();
      if (!value) {
        return <span className="text-gray-400">—</span>;
      }
      return <Age from={value} />;
    }
  }
];

// ---------------------------------------------------------------------------
// Flat (ungrouped) table
// ---------------------------------------------------------------------------

function FlatAccessTable() {
  const {
    data: accessSummary,
    isLoading,
    isRefetching
  } = useAllConfigAccessSummaryQuery({
    keepPreviousData: true
  });

  const rows = accessSummary?.data ?? [];
  const totalRecords = accessSummary?.totalEntries ?? 0;
  const pageSize = 50;
  const totalPages = Math.ceil(totalRecords / pageSize);

  return (
    <MRTDataTable
      columns={flatColumns}
      data={rows}
      isLoading={isLoading}
      isRefetching={isRefetching}
      enableServerSideSorting
      enableServerSidePagination
      totalRowCount={totalRecords}
      manualPageCount={totalPages}
      disableHiding
      defaultSorting={[{ id: "created_at", desc: true }]}
      defaultPageSize={50}
    />
  );
}

// ---------------------------------------------------------------------------
// Grouped-by-user table
// ---------------------------------------------------------------------------

function GroupedByUserTable() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { data, isLoading, isRefetching } = useConfigAccessGroupedByUserQuery();

  const rows = data?.data ?? [];
  const totalRecords = data?.totalEntries ?? 0;
  const pageSize = 50;
  const totalPages = Math.ceil(totalRecords / pageSize);

  const handleRowClick = useCallback(
    (row: ConfigAccessSummaryByUser) => {
      const params = new URLSearchParams();
      const configType = searchParams.get("configType");

      if (configType) {
        params.set("configType", configType);
      }

      params.set("groupBy", "none");
      params.set("user", toTriStateIncludeParamValue(row.user));
      navigate(`/catalog/access?${params.toString()}`);
    },
    [navigate, searchParams]
  );

  return (
    <MRTDataTable
      columns={groupedByUserColumns}
      data={rows}
      isLoading={isLoading}
      isRefetching={isRefetching}
      enableServerSideSorting
      enableServerSidePagination
      totalRowCount={totalRecords}
      manualPageCount={totalPages}
      disableHiding
      defaultSorting={[{ id: "access_count", desc: true }]}
      defaultPageSize={50}
      onRowClick={handleRowClick}
    />
  );
}

// ---------------------------------------------------------------------------
// Grouped-by-config table
// ---------------------------------------------------------------------------

function GroupedByConfigTable() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { data, isLoading, isRefetching } =
    useConfigAccessGroupedByConfigQuery();

  const rows = data?.data ?? [];
  const totalRecords = data?.totalEntries ?? 0;
  const pageSize = 50;
  const totalPages = Math.ceil(totalRecords / pageSize);

  const handleRowClick = useCallback(
    (row: ConfigAccessSummaryByConfig) => {
      const params = new URLSearchParams();
      const configType = searchParams.get("configType");

      if (configType) {
        params.set("configType", configType);
      }

      params.set("groupBy", "none");
      params.set("config_id", toTriStateIncludeParamValue(row.config_id));
      navigate(`/catalog/access?${params.toString()}`);
    },
    [navigate, searchParams]
  );

  return (
    <MRTDataTable
      columns={groupedByConfigColumns}
      data={rows}
      isLoading={isLoading}
      isRefetching={isRefetching}
      enableServerSideSorting
      enableServerSidePagination
      totalRowCount={totalRecords}
      manualPageCount={totalPages}
      disableHiding
      defaultSorting={[{ id: "access_count", desc: true }]}
      defaultPageSize={50}
      onRowClick={handleRowClick}
    />
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export function ConfigAccessPage() {
  const [, setRefreshButtonClickedTrigger] = useAtom(
    refreshButtonClickedTrigger
  );

  const [params] = useSearchParams({});
  const configType = params.get("configType") ?? undefined;

  // Default to grouped-by-config unless the user explicitly chose flat
  // ("none") or drilled down into a specific filter.
  const rawGroupBy = params.get("groupBy");
  const hasDrillDownFilter =
    params.has("config_id") || params.has("user") || params.has("role");
  const groupBy: ConfigAccessGroupBy | null =
    rawGroupBy === "user" || rawGroupBy === "config"
      ? rawGroupBy
      : rawGroupBy === "none" || hasDrillDownFilter
        ? null
        : "config"; // default

  const isGrouped = groupBy === "user" || groupBy === "config";

  // The flat query only runs when not grouped. When grouped, the
  // GroupedAccessTable component manages its own query internally.
  const {
    refetch: refetchFlat,
    isLoading: isLoadingFlat,
    isRefetching: isRefetchingFlat,
    error
  } = useAllConfigAccessSummaryQuery({
    keepPreviousData: true,
    enabled: !isGrouped
  });

  // When grouped, the child component owns loading state. The refresh button
  // still needs a refetch handle — we invalidate the grouped query key.
  const refetch = refetchFlat;
  const isLoading = isGrouped ? false : isLoadingFlat;
  const isRefetching = isGrouped ? false : isRefetchingFlat;

  const errorMessage =
    typeof error === "string"
      ? error
      : ((error as Record<string, string>)?.message ?? "Something went wrong");

  return (
    <>
      <Head prefix="Catalog Access" />
      <SearchLayout
        title={
          <BreadcrumbNav
            list={[
              <BreadcrumbRoot link="/catalog" key="catalog-access-root">
                Catalog
              </BreadcrumbRoot>,
              <BreadcrumbChild link="/catalog/access" key="catalog-access">
                Access
              </BreadcrumbChild>,
              ...(configType
                ? [
                    <BreadcrumbChild
                      link={`/catalog?configType=${configType}`}
                      key={configType}
                    >
                      <ConfigsTypeIcon
                        config={{ type: configType }}
                        showSecondaryIcon
                        showLabel
                      />
                    </BreadcrumbChild>
                  ]
                : [])
            ]}
          />
        }
        onRefresh={() => {
          setRefreshButtonClickedTrigger((prev) => prev + 1);
          refetch();
        }}
        loading={isLoading || isRefetching}
        contentClass="p-0 h-full flex flex-col flex-1"
      >
        <ConfigPageTabs activeTab="Access" configType={configType}>
          {error ? (
            <InfoMessage message={errorMessage} />
          ) : (
            <div className="flex h-full flex-1 flex-col overflow-y-auto">
              {!hasDrillDownFilter && (
                <div className="flex flex-wrap items-center gap-2 pb-2">
                  <GroupByDropdown effectiveGroupBy={groupBy ?? ""} />
                </div>
              )}

              {isGrouped ? (
                <div className="flex w-full flex-1 flex-col overflow-y-auto">
                  {groupBy === "user" && <GroupedByUserTable />}
                  {groupBy === "config" && <GroupedByConfigTable />}
                </div>
              ) : (
                <>
                  <FormikFilterForm
                    paramsToReset={paramsToReset}
                    filterFields={["config_id", "user", "role"]}
                  >
                    <div className="flex flex-wrap items-center gap-2 pb-2">
                      <CatalogDropdown />
                      <UserDropdown />
                      <RoleDropdown />
                    </div>
                  </FormikFilterForm>

                  <div className="flex w-full flex-1 flex-col overflow-y-auto">
                    <FlatAccessTable />
                  </div>
                </>
              )}
            </div>
          )}
        </ConfigPageTabs>
      </SearchLayout>
    </>
  );
}
