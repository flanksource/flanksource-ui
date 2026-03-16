import { useAllConfigAccessSummaryQuery } from "@flanksource-ui/api/query-hooks/useAllConfigAccessSummaryQuery";
import {
  getConfigAccessSummaryCatalogFilter,
  getConfigAccessSummaryRolesFilter,
  getConfigAccessSummaryUsersFilter
} from "@flanksource-ui/api/services/configs";
import { ConfigAccessSummary } from "@flanksource-ui/api/types/configs";
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
import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

const paramsToReset = ["pageIndex"];

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

export function ConfigAccessPage() {
  const [, setRefreshButtonClickedTrigger] = useAtom(
    refreshButtonClickedTrigger
  );

  const [params] = useSearchParams({});
  const configType = params.get("configType") ?? undefined;
  const pageSize = parseInt(params.get("pageSize") ?? "200", 10) || 200;

  const {
    data: accessSummary,
    isLoading,
    isRefetching,
    error,
    refetch
  } = useAllConfigAccessSummaryQuery({
    keepPreviousData: true
  });

  const columns = useMemo<MRT_ColumnDef<ConfigAccessSummary>[]>(
    () => [
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
    ],
    []
  );

  const rows = accessSummary?.data ?? [];
  const totalRecords = accessSummary?.totalEntries ?? 0;
  const totalPages = Math.ceil(totalRecords / pageSize);

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
              <FormikFilterForm
                paramsToReset={paramsToReset}
                filterFields={["config_id", "user", "role"]}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <CatalogDropdown />
                  <UserDropdown />
                  <RoleDropdown />
                </div>
              </FormikFilterForm>

              <div className="flex w-full flex-1 flex-col overflow-y-auto">
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
                  defaultSorting={[{ id: "created_at", desc: true }]}
                  defaultPageSize={200}
                />
              </div>
            </div>
          )}
        </ConfigPageTabs>
      </SearchLayout>
    </>
  );
}
