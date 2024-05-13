import { useGetConfigByIdQuery } from "@flanksource-ui/api/query-hooks";
import { getAConfigRelationships } from "@flanksource-ui/api/services/configs";
import { ConfigRelationships } from "@flanksource-ui/api/types/configs";
import { ConfigRelationKey } from "@flanksource-ui/components/Configs/Changes/ConfigsRelatedChanges/FilterBar/ConfigRelationshipToggles";
import { ConfigDetailsTabs } from "@flanksource-ui/components/Configs/ConfigDetailsTabs";
import ConfigsTable from "@flanksource-ui/components/Configs/ConfigList/ConfigsTable";
import { areDeletedConfigsHidden } from "@flanksource-ui/components/Configs/ConfigListToggledDeletedItems/ConfigListToggledDeletedItems";
import ConfigRelationshipFilterBar from "@flanksource-ui/components/Configs/ConfigRelationshipFilterBar";
import { configRelationshipGraphTableToggle } from "@flanksource-ui/components/Configs/ConfigsListFilters/ConfigGraphTableToggle";
import { ConfigRelationshipGraph } from "@flanksource-ui/components/Configs/Graph/ConfigRelationshipGraph";
import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { useCallback, useMemo } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ReactFlowProvider } from "reactflow";

export function ConfigDetailsRelationshipsPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [view] = useAtom(configRelationshipGraphTableToggle);

  const [hideDeletedConfigs] = useAtom(areDeletedConfigsHidden);

  const hideDeleted = hideDeletedConfigs === "yes" ? true : false;

  const configType = searchParams.get("configType") ?? undefined;
  const configTypes = searchParams.get("configTypes") ?? undefined;
  const tag = searchParams.get("tag") ?? undefined;

  const incoming = searchParams.get("incoming") === "true";
  const outgoing = searchParams.get("outgoing") === "true";
  const relation =
    searchParams.get(ConfigRelationKey) === "both" ? "both" : "hard";

  const all = incoming && outgoing;

  const relationshipType = useMemo(() => {
    if (all) {
      return "all";
    }
    if (incoming) {
      return "incoming";
    }
    if (outgoing) {
      return "outgoing";
    }
    return undefined;
  }, [all, incoming, outgoing]);

  const transformConfigRelationships = useCallback(
    (configs: ConfigRelationships[]) =>
      configs.filter((item) => {
        if (
          tag &&
          !(
            Object.entries(item.tags!).map(
              ([key, value]) => `${key}__:__${value}`
            ) ?? []
          )?.includes(tag)
        ) {
          return false;
        }
        return true;
      }),
    [tag]
  );

  const { data: configItem, isLoading: isLoadingConfig } =
    useGetConfigByIdQuery(id!);

  const {
    data: configItems,
    isLoading,
    refetch
  } = useQuery({
    // we add type and tag to the queryKey so that the query is re-executed when
    // the type or tag changes
    queryKey: [
      "config",
      "relationships",
      id,
      hideDeleted,
      tag,
      configType,
      relationshipType,
      relation,
      incoming,
      outgoing
    ],
    queryFn: () =>
      getAConfigRelationships({
        configId: id!,
        type_filter: relationshipType,
        configType: configType,
        hideDeleted: hideDeleted,
        relation: relation
      }),
    enabled: id !== undefined,
    select: (data) => transformConfigRelationships(data ?? [])
  });

  const configItemsFiltered = useMemo(() => {
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
  }, [configItems, configTypes]);

  const navigate = useNavigate();

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
                <ConfigRelationshipGraph
                  currentConfig={configItem}
                  configs={configItemsFiltered}
                />
              )}
            </ReactFlowProvider>
          ) : (
            <ConfigsTable
              // show the type column
              columnsToHide={[]}
              data={configItems ?? []}
              isLoading={isLoading}
              groupBy="type"
              handleRowClick={(row) => {
                navigate(`/catalog/${row.original.id}`);
              }}
              expandAllRows
            />
          )}
        </div>
      </div>
    </ConfigDetailsTabs>
  );
}
