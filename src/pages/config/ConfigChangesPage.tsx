import {
  useGetAllConfigsChangesInfiniteQuery,
  useGetAllConfigsChangesQuery
} from "@flanksource-ui/api/query-hooks/useConfigChangesHooks";
import { useGetConfigChangesById } from "@flanksource-ui/api/query-hooks/useGetConfigChangesByConfigChangeIdQuery";
import { ConfigChange } from "@flanksource-ui/api/types/configs";
import { ConfigChangeTable } from "@flanksource-ui/components/Configs/Changes/ConfigChangeTable";
import { ConfigChangeFilters } from "@flanksource-ui/components/Configs/Changes/ConfigChangesFilters/ConfigChangesFilters";
import ConfigChangesSwimlane from "@flanksource-ui/components/Configs/Changes/ConfigChangesSwimlane";
import { useConfigChangesViewToggleState } from "@flanksource-ui/components/Configs/Changes/ConfigChangesViewToggle";
import { ConfigDetailChangeModal } from "@flanksource-ui/components/Configs/Changes/ConfigDetailsChanges/ConfigDetailsChanges";
import ConfigPageTabs from "@flanksource-ui/components/Configs/ConfigPageTabs";
import ConfigsTypeIcon from "@flanksource-ui/components/Configs/ConfigsTypeIcon";
import { InfoMessage } from "@flanksource-ui/components/InfoMessage";
import {
  BreadcrumbChild,
  BreadcrumbNav,
  BreadcrumbRoot
} from "@flanksource-ui/ui/BreadcrumbNav";
import { Head } from "@flanksource-ui/ui/Head";
import { SearchLayout } from "@flanksource-ui/ui/Layout/SearchLayout";
import { refreshButtonClickedTrigger } from "@flanksource-ui/ui/SlidingSideBar/SlidingSideBar";
import { useAtom } from "jotai";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

function normalizeChange(c: ConfigChange): ConfigChange {
  return {
    ...c,
    config: {
      id: c.config_id!,
      type: c.type!,
      name: c.name!,
      deleted_at: c.deleted_at
    }
  };
}

export function ConfigChangesPage() {
  const [, setRefreshButtonClickedTrigger] = useAtom(
    refreshButtonClickedTrigger
  );
  const view = useConfigChangesViewToggleState();
  const [selectedChange, setSelectedChange] = useState<ConfigChange>();
  const { data: changeDetails, isLoading: changeLoading } =
    useGetConfigChangesById(selectedChange?.id ?? "", {
      enabled: !!selectedChange
    });
  const [params] = useSearchParams({});

  const configTypes = params.get("configTypes") ?? undefined;
  const configType =
    configTypes?.split(",").length === 1
      ? configTypes.split(",")[0]?.split(":")?.[0].split("__").join("::")
      : undefined;

  const pageSize = params.get("pageSize") ?? "200";

  // Table view uses standard paginated query
  const tableQuery = useGetAllConfigsChangesQuery({
    keepPreviousData: true,
    enabled: view !== "Graph"
  });

  // Graph view uses infinite query
  const infiniteQuery = useGetAllConfigsChangesInfiniteQuery({
    pageSize: parseInt(pageSize)
  });

  const isGraphView = view === "Graph";

  const { changes, totalChanges, isLoading, isRefetching, error, refetch } =
    useMemo(() => {
      if (isGraphView) {
        const allChanges =
          infiniteQuery.data?.pages.flatMap((p) =>
            (p.changes ?? []).map(normalizeChange)
          ) ?? [];
        return {
          changes: allChanges,
          totalChanges: infiniteQuery.data?.pages[0]?.total ?? 0,
          isLoading: infiniteQuery.isLoading,
          isRefetching: infiniteQuery.isRefetching,
          error: infiniteQuery.error,
          refetch: infiniteQuery.refetch
        };
      }
      const data = tableQuery.data;
      return {
        changes: (data?.changes ?? []).map(normalizeChange),
        totalChanges: data?.total ?? 0,
        isLoading: tableQuery.isLoading,
        isRefetching: tableQuery.isRefetching,
        error: tableQuery.error,
        refetch: tableQuery.refetch
      };
    }, [isGraphView, infiniteQuery, tableQuery]);

  const totalChangesPages = Math.ceil(totalChanges / parseInt(pageSize));

  const errorMessage =
    typeof error === "string"
      ? error
      : ((error as Record<string, string>)?.message ?? "Something went wrong");

  return (
    <>
      <Head prefix="Catalog Changes" />
      <SearchLayout
        title={
          <BreadcrumbNav
            list={[
              <BreadcrumbRoot link="/catalog" key="config-catalog-changes-root">
                Catalog
              </BreadcrumbRoot>,
              <BreadcrumbChild
                link="/catalog/changes"
                key="config-catalog-changes"
              >
                Changes
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
        <ConfigPageTabs activeTab="Changes" configType={configType}>
          {error ? (
            <InfoMessage message={errorMessage} />
          ) : (
            <>
              <ConfigChangeFilters paramsToReset={["page"]} />
              {isGraphView ? (
                <>
                  <ConfigChangesSwimlane
                    changes={changes}
                    onItemClicked={(change) => setSelectedChange(change)}
                    fetchNextPage={infiniteQuery.fetchNextPage}
                    hasNextPage={infiniteQuery.hasNextPage}
                    isFetchingNextPage={infiniteQuery.isFetchingNextPage}
                  />
                  {selectedChange && (
                    <ConfigDetailChangeModal
                      isLoading={changeLoading}
                      open={!!selectedChange}
                      setOpen={(open) => {
                        if (!open) setSelectedChange(undefined);
                      }}
                      changeDetails={changeDetails ?? selectedChange}
                    />
                  )}
                </>
              ) : (
                <ConfigChangeTable
                  data={changes}
                  isLoading={isLoading}
                  isRefetching={isRefetching}
                  totalRecords={totalChanges}
                  numberOfPages={totalChangesPages}
                />
              )}
            </>
          )}
        </ConfigPageTabs>
      </SearchLayout>
    </>
  );
}
