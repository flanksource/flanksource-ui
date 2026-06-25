import {
  useGetAllConfigsChangesInfiniteQuery,
  useGetAllConfigsChangesQuery
} from "@flanksource-ui/api/query-hooks/useConfigChangesHooks";
import { useGetConfigChangesById } from "@flanksource-ui/api/query-hooks/useGetConfigChangesByConfigChangeIdQuery";
import { ConfigChange } from "@flanksource-ui/api/types/configs";
import { ConfigChangeTable } from "@flanksource-ui/components/Configs/Changes/ConfigChangeTable";
import { ConfigChangeFilters } from "@flanksource-ui/components/Configs/Changes/ConfigChangesFilters/ConfigChangesFilters";
import ConfigChangesSwimlane from "@flanksource-ui/components/Configs/Changes/ConfigChangesSwimlane";
import ConfigChangesViewToggle, {
  useConfigChangesViewToggleState
} from "@flanksource-ui/components/Configs/Changes/ConfigChangesViewToggle";
import { ConfigDetailChangeModal } from "@flanksource-ui/components/Configs/Changes/ConfigDetailsChanges/ConfigDetailsChanges";
import ConfigPageTabs from "@flanksource-ui/components/Configs/ConfigPageTabs";
import ConfigsTypeIcon from "@flanksource-ui/components/Configs/ConfigsTypeIcon";
import { InfoMessage } from "@flanksource-ui/components/InfoMessage";
import {
  BreadcrumbChild,
  BreadcrumbNav,
  BreadcrumbRoot
} from "@flanksource-ui/ui/BreadcrumbNav";
import { Toggle } from "@flanksource-ui/ui/FormControls/Toggle";
import { Head } from "@flanksource-ui/ui/Head";
import { SearchLayout } from "@flanksource-ui/ui/Layout/SearchLayout";
import { Loading } from "@flanksource-ui/ui/Loading";
import { refreshButtonClickedTrigger } from "@flanksource-ui/ui/SlidingSideBar/SlidingSideBar";
import { useAtom } from "jotai";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

function getNewestInsertedAt(changes: ConfigChange[]): string | undefined {
  let latest: string | undefined;
  for (const c of changes) {
    const ts = typeof c.inserted_at === "string" ? c.inserted_at : undefined;
    if (ts && (!latest || ts > latest)) {
      latest = ts;
    }
  }
  return latest;
}

function getLiveTailQueryKey(params: URLSearchParams) {
  return Array.from(params.entries())
    .filter(([key]) => key !== "changeId")
    .sort(([aKey, aValue], [bKey, bValue]) =>
      aKey === bKey ? aValue.localeCompare(bValue) : aKey.localeCompare(bKey)
    )
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
}

const GRAPH_VIEW_MAX_CHANGES = 2500;

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
  const isGraphView = view === "Graph";
  const [params] = useSearchParams({});

  const configTypes = params.get("configTypes") ?? undefined;
  const configType =
    // we want to show breadcrumb only if there is only one config type selected
    // in the filter dropdown and not multiple
    configTypes?.split(",").length === 1
      ? configTypes.split(",")[0]?.split(":")?.[0].split("__").join("::")
      : undefined;

  const pageSize = params.get("pageSize") ?? "200";

  const [liveTail, setLiveTail] = useState(false);
  const [tailCursor, setTailCursor] = useState<string | undefined>(undefined);
  const [tailedChanges, setTailedChanges] = useState<ConfigChange[]>([]);
  const liveTailQueryKey = useMemo(() => getLiveTailQueryKey(params), [params]);
  const liveTailQueryKeyRef = useRef(liveTailQueryKey);

  // Table view: paginated query (with optional live tail)
  const tableQuery = useGetAllConfigsChangesQuery({
    keepPreviousData: true,
    enabled: !isGraphView
  });

  // Graph view: fetch the capped number of changes in a single request.
  const infiniteQuery = useGetAllConfigsChangesInfiniteQuery({
    enabled: isGraphView,
    pageSize: GRAPH_VIEW_MAX_CHANGES,
    maxChanges: GRAPH_VIEW_MAX_CHANGES
  });

  // Initialize cursor from base data when live tail is turned on
  useEffect(() => {
    if (
      liveTail &&
      tableQuery.data?.changes?.length &&
      !tailCursor &&
      !tableQuery.isPreviousData
    ) {
      setTailCursor(getNewestInsertedAt(tableQuery.data.changes));
    }
  }, [liveTail, tableQuery.data, tailCursor, tableQuery.isPreviousData]);

  // Reset when live tail is turned off
  useEffect(() => {
    if (!liveTail) {
      setTailedChanges([]);
      setTailCursor(undefined);
      tableQuery.refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liveTail]);

  // Reset live tail state whenever filters, sorting, pagination, or date range changes.
  useEffect(() => {
    if (!liveTail) {
      liveTailQueryKeyRef.current = liveTailQueryKey;
      return;
    }
    if (liveTailQueryKeyRef.current === liveTailQueryKey) {
      return;
    }
    liveTailQueryKeyRef.current = liveTailQueryKey;
    setTailedChanges([]);
    setTailCursor(undefined);
  }, [liveTail, liveTailQueryKey]);

  const { data: pollData } = useGetAllConfigsChangesQuery({
    from_inserted_at: tailCursor,
    keepPreviousData: false,
    enabled: !isGraphView && liveTail && !!tailCursor,
    refetchInterval: !isGraphView && liveTail ? 5000 : false
  });

  // Accumulate new items from poll and advance cursor
  useEffect(() => {
    if (!pollData?.changes?.length) return;

    const incoming = pollData.changes;
    const newest = getNewestInsertedAt(incoming);
    if (newest) {
      setTailCursor((prev) => (!prev || newest > prev ? newest : prev));
    }

    setTailedChanges((prev) => {
      const incomingIds = new Set(incoming.map((c) => c.id));
      const filtered = prev.filter((c) => !incomingIds.has(c.id));
      return [...incoming, ...filtered];
    });
  }, [pollData]);

  const { changes, totalChanges, isLoading, isRefetching, error, refetch } =
    useMemo(() => {
      if (isGraphView) {
        const allChanges =
          infiniteQuery.data?.pages
            .flatMap((p) => (p.changes ?? []).map(normalizeChange))
            .slice(0, GRAPH_VIEW_MAX_CHANGES) ?? [];
        return {
          changes: allChanges,
          totalChanges: infiniteQuery.data?.pages[0]?.total ?? 0,
          isLoading: infiniteQuery.isLoading,
          isRefetching:
            infiniteQuery.isRefetching || infiniteQuery.isFetchingNextPage,
          error: infiniteQuery.error,
          refetch: infiniteQuery.refetch
        };
      }

      const baseChanges = (tableQuery.data?.changes ?? []).map(normalizeChange);
      const tailedWithConfig = tailedChanges.map(normalizeChange);
      const tailedIds = new Set(tailedWithConfig.map((c) => c.id));
      const baseWithoutTailed = baseChanges.filter((c) => !tailedIds.has(c.id));
      const baseIds = new Set(baseChanges.map((c) => c.id));
      const newTailedCount = tailedWithConfig.filter(
        (c) => !baseIds.has(c.id)
      ).length;

      return {
        changes: liveTail
          ? [...tailedWithConfig, ...baseWithoutTailed]
          : baseChanges,
        totalChanges: liveTail
          ? (tableQuery.data?.total ?? 0) + newTailedCount
          : (tableQuery.data?.total ?? 0),
        isLoading: tableQuery.isLoading,
        isRefetching: tableQuery.isRefetching,
        error: tableQuery.error,
        refetch: tableQuery.refetch
      };
    }, [isGraphView, infiniteQuery, tableQuery, tailedChanges, liveTail]);

  const totalChangesPages = Math.ceil(totalChanges / parseInt(pageSize));
  const graphLimitReached =
    isGraphView && totalChanges > GRAPH_VIEW_MAX_CHANGES;
  const showGraphLoadStatus =
    isGraphView && !isLoading && infiniteQuery.isFetching;

  const [selectedChange, setSelectedChange] = useState<ConfigChange>();
  const { data: changeDetails, isLoading: changeLoading } =
    useGetConfigChangesById(selectedChange?.id ?? "", {
      enabled: !!selectedChange
    });

  useEffect(() => {
    if (!isGraphView) setSelectedChange(undefined);
  }, [isGraphView]);

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
              <ConfigChangeFilters
                paramsToReset={["page"]}
                extra={
                  <>
                    {!isGraphView && (
                      <Toggle
                        label="Live"
                        value={liveTail}
                        onChange={setLiveTail}
                      />
                    )}
                    <div className="ml-auto flex items-center gap-2">
                      {graphLimitReached && (
                        <span className="flex items-center whitespace-nowrap px-2 text-sm font-medium text-amber-700">
                          ⚠️ Only {GRAPH_VIEW_MAX_CHANGES.toLocaleString()} of{" "}
                          {totalChanges.toLocaleString()} changes shown
                        </span>
                      )}
                      <ConfigChangesViewToggle />
                    </div>
                  </>
                }
              />
              {isGraphView ? (
                <>
                  <div className="relative min-h-0 flex-1">
                    {showGraphLoadStatus && (
                      <div className="pointer-events-none fixed left-1/2 top-32 z-50 -translate-x-1/2 rounded-md border border-gray-200 bg-white/95 px-4 py-2 text-sm text-gray-700 shadow-md backdrop-blur">
                        <Loading
                          text={`Loaded ${changes.length.toLocaleString()} of ${totalChanges.toLocaleString()} changes`}
                        />
                      </div>
                    )}

                    <ConfigChangesSwimlane
                      changes={changes}
                      isLoading={isLoading}
                      onItemClicked={(change) => setSelectedChange(change)}
                    />
                  </div>
                  {selectedChange && (
                    <ConfigDetailChangeModal
                      isLoading={changeLoading}
                      open={!!selectedChange}
                      setOpen={(open) => {
                        if (!open) setSelectedChange(undefined);
                      }}
                      changeDetails={changeDetails ?? undefined}
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
