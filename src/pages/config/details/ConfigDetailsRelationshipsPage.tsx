import { useGetConfigByIdQuery } from "@flanksource-ui/api/query-hooks";
import { useConfigRelationshipsQuery } from "@flanksource-ui/api/query-hooks/useConfigRelationshipsQuery";
import { ConfigDetailsTabs } from "@flanksource-ui/components/Configs/ConfigDetailsTabs";
import ConfigsRelationshipsTable from "@flanksource-ui/components/Configs/ConfigList/ConfigsRelationshipsTable";
import ConfigRelationshipFilterBar from "@flanksource-ui/components/Configs/ConfigRelationshipFilterBar";
import { useConfigGraphTableToggleViewValue } from "@flanksource-ui/components/Configs/ConfigsListFilters/ConfigGraphTableToggle";
import { ConfigRelationshipGraph } from "@flanksource-ui/components/Configs/Graph/ConfigRelationshipGraph";
import { useParams } from "react-router-dom";
import { ReactFlowProvider } from "reactflow";

export function ConfigDetailsRelationshipsPage() {
  const { id } = useParams();
  const view = useConfigGraphTableToggleViewValue();

  const { data: configItem, isLoading: isLoadingConfig } =
    useGetConfigByIdQuery(id!);

  const {
    data: configItems,
    isLoading,
    refetch
  } = useConfigRelationshipsQuery(id);

  return (
    <ConfigDetailsTabs
      pageTitlePrefix={"Config Relationships"}
      isLoading={isLoading || isLoadingConfig}
      refetch={refetch}
      activeTabName="Relationships"
    >
      <div className={`flex h-full flex-1 flex-col gap-2 overflow-y-auto`}>
        <ConfigRelationshipFilterBar />
        <div className="flex flex-1 flex-col overflow-y-auto">
          {view === "Graph" ? (
            <ReactFlowProvider>
              {configItems && configItem && (
                <ConfigRelationshipGraph configs={configItems} />
              )}
            </ReactFlowProvider>
          ) : (
            <ConfigsRelationshipsTable
              columnsToHide={["type"]}
              data={configItems ?? []}
              isLoading={isLoading}
              groupBy={["type"]}
              expandAllRows
            />
          )}
        </div>
      </div>
    </ConfigDetailsTabs>
  );
}
