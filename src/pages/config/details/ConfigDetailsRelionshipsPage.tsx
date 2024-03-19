import { getAConfigRelationships } from "@flanksource-ui/api/services/configs";
import { ConfigItem } from "@flanksource-ui/api/types/configs";
import { ConfigDetailsTabs } from "@flanksource-ui/components/Configs/ConfigDetailsTabs";
import ConfigList from "@flanksource-ui/components/Configs/ConfigList";
import { areDeletedConfigsHidden } from "@flanksource-ui/components/Configs/ConfigListToggledDeletedItems/ConfigListToggledDeletedItems";
import ConfigRelationshipFilterBar from "@flanksource-ui/components/Configs/ConfigRelationshipFilterBar";
import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { useCallback, useMemo } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

export function ConfigDetailsRelationshipsPage() {
  const { id } = useParams();

  const [searchParams] = useSearchParams();

  const [hideDeletedConfigs] = useAtom(areDeletedConfigsHidden);

  const hideDeleted = hideDeletedConfigs === "yes" ? true : false;

  const configType = searchParams.get("configType") ?? undefined;
  const tag = searchParams.get("tag") ?? undefined;

  const incoming = searchParams.get("incoming") === "true";
  const outgoing = searchParams.get("outgoing") === "true";

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

  console.log(all, incoming, outgoing, relationshipType);

  const transformConfigRelationships = useCallback(
    (configs: ConfigItem[]) =>
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
      incoming,
      outgoing
    ],
    queryFn: () =>
      getAConfigRelationships({
        configId: id!,
        type_filter: relationshipType,
        configType: configType,
        hideDeleted: hideDeleted
      }),
    enabled: id !== undefined,
    select: (data) => transformConfigRelationships(data ?? [])
  });

  const navigate = useNavigate();

  return (
    <ConfigDetailsTabs
      pageTitlePrefix={"Config Relationships"}
      isLoading={isLoading}
      refetch={refetch}
      activeTabName="Relationships"
    >
      <div className={`flex flex-col flex-1 h-full overflow-y-auto`}>
        <div className="flex flex-col flex-1 items-start gap-2 overflow-y-auto">
          <ConfigRelationshipFilterBar />
          <div className="flex flex-col flex-1 overflow-y-auto">
            <ConfigList
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
          </div>
        </div>
      </div>
    </ConfigDetailsTabs>
  );
}
