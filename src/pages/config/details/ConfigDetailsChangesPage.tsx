import { useGetConfigChangesByIDQuery } from "@flanksource-ui/api/query-hooks/useConfigChangesHooks";
import { ConfigChange } from "@flanksource-ui/api/types/configs";
import { ConfigChangeTable } from "@flanksource-ui/components/Configs/Changes/ConfigChangeTable";
import { ConfigRelatedChangesFilters } from "@flanksource-ui/components/Configs/Changes/ConfigsRelatedChanges/FilterBar/ConfigRelatedChangesFilters";
import { ConfigDetailsTabs } from "@flanksource-ui/components/Configs/ConfigDetailsTabs";
import { InfoMessage } from "@flanksource-ui/components/InfoMessage";
import { Toggle } from "@flanksource-ui/ui/FormControls/Toggle";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

function getNewestInsertedAt(changes: ConfigChange[]): string | undefined {
  return changes.reduce(
    (latest, c) =>
      c.inserted_at && (!latest || c.inserted_at > latest)
        ? c.inserted_at
        : latest,
    undefined as string | undefined
  );
}

export function ConfigDetailsChangesPage() {
  const { id } = useParams();

  const [params] = useSearchParams({
    sortBy: "created_at",
    sortDirection: "desc"
  });

  const pageSize = params.get("pageSize") ?? "200";

  const [liveTail, setLiveTail] = useState(false);
  const [tailCursor, setTailCursor] = useState<string | undefined>(undefined);
  const [tailedChanges, setTailedChanges] = useState<ConfigChange[]>([]);

  const { data, isLoading, error, refetch } = useGetConfigChangesByIDQuery({
    keepPreviousData: true,
    enabled: !!id
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

  const { data: pollData } = useGetConfigChangesByIDQuery({
    from_inserted_at: tailCursor,
    keepPreviousData: false,
    enabled: liveTail && !!id && !!tailCursor,
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
      name: change.name!
    }
  }));

  const tailedWithConfig = tailedChanges.map((change) => ({
    ...change,
    config: {
      id: change.config_id!,
      type: change.type!,
      name: change.name!
    }
  }));

  const baseIds = new Set(baseChanges.map((c) => c.id));
  const uniqueTailed = tailedWithConfig.filter((c) => !baseIds.has(c.id));
  const changes = [...uniqueTailed, ...baseChanges];

  const totalChanges = (data?.total ?? 0) + uniqueTailed.length;
  const totalChangesPages = Math.ceil(totalChanges / parseInt(pageSize));

  if (error) {
    const errorMessage =
      typeof error === "symbol"
        ? error
        : ((error as any)?.message ?? "Something went wrong");

    return <InfoMessage message={errorMessage} />;
  }

  return (
    <ConfigDetailsTabs
      pageTitlePrefix={"Catalog Changes"}
      isLoading={isLoading}
      refetch={refetch}
      activeTabName="Changes"
    >
      <div className={`flex h-full flex-1 flex-col overflow-y-auto`}>
        <div className="flex w-full flex-1 flex-col items-start gap-2 overflow-y-auto">
          <ConfigRelatedChangesFilters
            paramsToReset={["page"]}
            extra={
              <Toggle label="Live" value={liveTail} onChange={setLiveTail} />
            }
          />
          <div className="flex w-full flex-1 flex-col overflow-y-auto">
            <ConfigChangeTable
              data={changes}
              isLoading={isLoading}
              numberOfPages={totalChangesPages}
              totalRecords={totalChanges}
            />
          </div>
        </div>
      </div>
    </ConfigDetailsTabs>
  );
}
