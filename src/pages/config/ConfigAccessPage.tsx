import { useAllConfigAccessSummaryQuery } from "@flanksource-ui/api/query-hooks/useAllConfigAccessSummaryQuery";
import ConfigPageTabs from "@flanksource-ui/components/Configs/ConfigPageTabs";
import ConfigsTypeIcon from "@flanksource-ui/components/Configs/ConfigsTypeIcon";
import { ConfigAccessFilters } from "@flanksource-ui/components/Configs/Access/ConfigAccessFilters";
import { ConfigAccessGroupByDropdown } from "@flanksource-ui/components/Configs/Access/ConfigAccessGroupByDropdown";
import { ConfigAccessFlatTable } from "@flanksource-ui/components/Configs/Access/tables/ConfigAccessFlatTable";
import { ConfigAccessGroupedByCatalogTable } from "@flanksource-ui/components/Configs/Access/tables/ConfigAccessGroupedByCatalogTable";
import { ConfigAccessGroupedByUserTable } from "@flanksource-ui/components/Configs/Access/tables/ConfigAccessGroupedByUserTable";
import { InfoMessage } from "@flanksource-ui/components/InfoMessage";
import { useCatalogAccessUrlState } from "@flanksource-ui/hooks/useCatalogAccessUrlState";
import {
  BreadcrumbChild,
  BreadcrumbNav,
  BreadcrumbRoot
} from "@flanksource-ui/ui/BreadcrumbNav";
import { Head } from "@flanksource-ui/ui/Head";
import { SearchLayout } from "@flanksource-ui/ui/Layout/SearchLayout";
import { refreshButtonClickedTrigger } from "@flanksource-ui/ui/SlidingSideBar/SlidingSideBar";
import { useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";

export function ConfigAccessPage() {
  const [, setRefreshButtonClickedTrigger] = useAtom(
    refreshButtonClickedTrigger
  );
  const queryClient = useQueryClient();

  const {
    configType,
    groupBy,
    isGrouped,
    hasDrillDownFilter,
    mode,
    actions: { setMode }
  } = useCatalogAccessUrlState();

  const {
    data: flatAccessSummary,
    isLoading: isLoadingFlat,
    isRefetching: isRefetchingFlat,
    error,
    refetch: refetchFlat
  } = useAllConfigAccessSummaryQuery({
    keepPreviousData: true,
    enabled: !isGrouped
  });

  const rows = flatAccessSummary?.data ?? [];
  const totalRecords = flatAccessSummary?.totalEntries ?? 0;

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

          if (isGrouped) {
            void queryClient.invalidateQueries({
              queryKey: ["config", "access-summary", "grouped"]
            });
            return;
          }

          void refetchFlat();
          void queryClient.invalidateQueries({
            queryKey: ["config", "access-summary", "filter"]
          });
        }}
        loading={isGrouped ? false : isLoadingFlat || isRefetchingFlat}
        contentClass="p-0 h-full flex flex-col flex-1"
      >
        <ConfigPageTabs activeTab="Access" configType={configType}>
          {!isGrouped && error ? (
            <InfoMessage message={errorMessage} />
          ) : (
            <div className="flex h-full flex-1 flex-col overflow-y-auto">
              {!hasDrillDownFilter && (
                <div className="flex flex-wrap items-center gap-2 pb-2">
                  <ConfigAccessGroupByDropdown mode={mode} onChange={setMode} />
                </div>
              )}

              {isGrouped ? (
                <div className="flex w-full flex-1 flex-col overflow-y-auto">
                  {groupBy === "user" && <ConfigAccessGroupedByUserTable />}
                  {groupBy === "config" && (
                    <ConfigAccessGroupedByCatalogTable />
                  )}
                </div>
              ) : (
                <>
                  <ConfigAccessFilters />

                  <div className="flex w-full flex-1 flex-col overflow-y-auto">
                    <ConfigAccessFlatTable
                      data={rows}
                      isLoading={isLoadingFlat}
                      isRefetching={isRefetchingFlat}
                      totalRecords={totalRecords}
                    />
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
