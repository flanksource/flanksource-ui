import { useGetConfigChangesById } from "@flanksource-ui/api/query-hooks/useGetConfigChangesByConfigChangeIdQuery";
import { useGetConfigChangesByIDQuery } from "@flanksource-ui/api/query-hooks/useConfigChangesHooks";
import { ConfigChange } from "@flanksource-ui/api/types/configs";
import { ConfigChangeTable } from "@flanksource-ui/components/Configs/Changes/ConfigChangeTable";
import ConfigChangesSwimlane from "@flanksource-ui/components/Configs/Changes/ConfigChangesSwimlane";
import { useConfigChangesViewToggleState } from "@flanksource-ui/components/Configs/Changes/ConfigChangesViewToggle";
import { ConfigDetailChangeModal } from "@flanksource-ui/components/Configs/Changes/ConfigDetailsChanges/ConfigDetailsChanges";
import { ConfigRelatedChangesFilters } from "@flanksource-ui/components/Configs/Changes/ConfigsRelatedChanges/FilterBar/ConfigRelatedChangesFilters";
import { ConfigDetailsTabs } from "@flanksource-ui/components/Configs/ConfigDetailsTabs";
import { InfoMessage } from "@flanksource-ui/components/InfoMessage";
import { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

export function ConfigDetailsChangesPage() {
  const { id } = useParams();
  const view = useConfigChangesViewToggleState();

  const [params] = useSearchParams({
    sortBy: "created_at",
    sortDirection: "desc"
  });

  const pageSize = params.get("pageSize") ?? "200";

  const { data, isLoading, error, refetch } = useGetConfigChangesByIDQuery({
    keepPreviousData: true,
    enabled: !!id
  });

  const changes = (data?.changes ?? []).map((changes) => ({
    ...changes,
    config: {
      id: changes.config_id!,
      type: changes.type!,
      name: changes.name!
    }
  }));

  const totalChanges = data?.total ?? 0;
  const totalChangesPages = Math.ceil(totalChanges / parseInt(pageSize));

  const [selectedChange, setSelectedChange] = useState<ConfigChange>();
  const { data: changeDetails, isLoading: changeLoading } =
    useGetConfigChangesById(selectedChange?.id ?? "", {
      enabled: !!selectedChange
    });

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
          <ConfigRelatedChangesFilters paramsToReset={["page"]} />
          <div className="flex w-full flex-1 flex-col overflow-y-auto">
            {view === "Graph" ? (
              <>
                <ConfigChangesSwimlane
                  changes={changes}
                  onItemClicked={(change) => setSelectedChange(change)}
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
                numberOfPages={totalChangesPages}
                totalRecords={totalChanges}
              />
            )}
          </div>
        </div>
      </div>
    </ConfigDetailsTabs>
  );
}
