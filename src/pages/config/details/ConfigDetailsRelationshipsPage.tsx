import { useGetConfigByIdQuery } from "@flanksource-ui/api/query-hooks";
import useConfigRelationshipsQuery from "@flanksource-ui/api/query-hooks/useConfigRelationshipsQuery";
import { ConfigItem } from "@flanksource-ui/api/types/configs";
import { ConfigDetailsTabs } from "@flanksource-ui/components/Configs/ConfigDetailsTabs";
import ConfigsRelationshipsTable from "@flanksource-ui/components/Configs/ConfigList/ConfigsRelationshipsTable";
import ConfigRelationshipFilterBar from "@flanksource-ui/components/Configs/ConfigRelationshipFilterBar";
import { useConfigGraphTableToggleViewValue } from "@flanksource-ui/components/Configs/ConfigsListFilters/ConfigGraphTableToggle";
import { ConfigRelationshipGraph } from "@flanksource-ui/components/Configs/Graph/ConfigRelationshipGraph";
import { useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { ReactFlowProvider } from "reactflow";

function filterConfigRelationshipsByType(
  configItems: ConfigItem[] | undefined,
  configTypes: string | undefined
) {
  if (!configItems) {
    return [];
  }
  if (!configTypes) {
    return configItems;
  }
  const filterArray = configTypes.split(",").map((type) => {
    const [_type, symbol] = type.split(":");
    return { type: _type, symbol };
  });
  const excludeItems = filterArray[0].symbol === "-1";
  if (excludeItems) {
    return configItems.filter((configItem) => {
      return (
        filterArray.filter((filterType) => {
          return configItem.type === filterType.type.replaceAll("__", "::");
        }).length === 0
      );
    });
  }
  return configItems.filter(
    (item) =>
      filterArray.filter(
        (configType) => item.type === configType.type.replaceAll("__", "::")
      ).length > 0
  );
}

export function ConfigDetailsRelationshipsPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const view = useConfigGraphTableToggleViewValue();
  const configTypes = searchParams.get("configTypes") ?? undefined;
  const { data: configItem, isLoading: isLoadingConfig } =
    useGetConfigByIdQuery(id!);
  const {
    data: configItems,
    isLoading,
    refetch
  } = useConfigRelationshipsQuery(id);

  const configItemsFiltered = useMemo(
    () => filterConfigRelationshipsByType(configItems, configTypes),
    [configItems, configTypes]
  );

  return (
    <ConfigDetailsTabs
      pageTitlePrefix={"Config Relationships"}
      isLoading={isLoading || isLoadingConfig}
      refetch={refetch}
      activeTabName="Relationships"
    >
      <div className={`flex flex-col flex-1 h-full gap-2 overflow-y-auto`}>
        <ConfigRelationshipFilterBar isGraphView={view === "Graph"} />
        <div className="flex flex-col flex-1 overflow-y-auto">
          {view === "Graph" ? (
            <ReactFlowProvider>
              {configItems && configItem && (
                <ConfigRelationshipGraph configs={configItemsFiltered} />
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
