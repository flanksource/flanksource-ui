import { useGetAllConfigsChangesQuery } from "@flanksource-ui/api/query-hooks/useConfigChangesHooks";
import { ConfigChange } from "@flanksource-ui/api/types/configs";
import { ConfigChangeTable } from "@flanksource-ui/components/Configs/Changes/ConfigChangeTable";
import { ConfigChangeFilters } from "@flanksource-ui/components/Configs/Changes/ConfigChangesFilters/ConfigChangesFilters";
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
import { Toggle } from "@flanksource-ui/ui/FormControls/Toggle";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

function getNewestInsertedAt(changes: ConfigChange[]): string | undefined {
  return changes.reduce(
    (latest, c) =>
      c.inserted_at && (!latest || c.inserted_at > latest)
        ? c.inserted_at
        : latest,
    undefined as string | undefined
  );
}

export function ConfigChangesPage() {
  const [, setRefreshButtonClickedTrigger] = useAtom(
    refreshButtonClickedTrigger
  );
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

  const { data, isLoading, error, isRefetching, refetch } =
    useGetAllConfigsChangesQuery({
      keepPreviousData: true
    });

  // Initialize cursor from base data when live tail is turned on
  useEffect(() => {
    if (liveTail && data?.changes?.length && !tailCursor) {
      setTailCursor(getNewestInsertedAt(data.changes));
    }
  }, [liveTail, data, tailCursor]);

  // Reset when live tail is turned off
  useEffect(() => {
    if (!liveTail) {
      setTailedChanges([]);
      setTailCursor(undefined);
    }
  }, [liveTail]);

  const { data: pollData } = useGetAllConfigsChangesQuery({
    from_inserted_at: tailCursor,
    keepPreviousData: false,
    enabled: liveTail && !!tailCursor,
    refetchInterval: liveTail ? 5000 : false
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
      const existingIds = new Set(prev.map((c) => c.id));
      const deduped = incoming.filter((c) => !existingIds.has(c.id));
      if (deduped.length === 0) return prev;
      return [...deduped, ...prev];
    });
  }, [pollData]);

  const baseChanges = (data?.changes ?? []).map((change) => ({
    ...change,
    config: {
      id: change.config_id!,
      type: change.type!,
      name: change.name!,
      deleted_at: change.deleted_at
    }
  }));

  const tailedWithConfig = tailedChanges.map((change) => ({
    ...change,
    config: {
      id: change.config_id!,
      type: change.type!,
      name: change.name!,
      deleted_at: change.deleted_at
    }
  }));

  const baseIds = new Set(baseChanges.map((c) => c.id));
  const uniqueTailed = tailedWithConfig.filter((c) => !baseIds.has(c.id));
  const changes = [...uniqueTailed, ...baseChanges];

  const totalChanges = (data?.total ?? 0) + uniqueTailed.length;
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
              <ConfigChangeFilters
                paramsToReset={["page"]}
                extra={
                  <Toggle
                    label="Live"
                    value={liveTail}
                    onChange={setLiveTail}
                  />
                }
              />
              <ConfigChangeTable
                data={changes}
                isLoading={isLoading}
                isRefetching={isRefetching}
                totalRecords={totalChanges}
                numberOfPages={totalChangesPages}
              />
            </>
          )}
        </ConfigPageTabs>
      </SearchLayout>
    </>
  );
}
