import { getDetailedConfigRelationships } from "@flanksource-ui/api/services/configs";
import { ConfigTypeRelationships } from "@flanksource-ui/api/types/configs";
import { ConfigDetailsTabs } from "@flanksource-ui/components/Configs/ConfigDetailsTabs";
import ConfigList from "@flanksource-ui/components/Configs/ConfigList";
import { areDeletedConfigsHidden } from "@flanksource-ui/components/Configs/ConfigListToggledDeletedItems/ConfigListToggledDeletedItems";
import ConfigRelationshipFilterBar from "@flanksource-ui/components/Configs/ConfigRelationshipFilterBar";
import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { useCallback } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

export function ConfigDetailsRelationshipsPage() {
  const { id } = useParams();

  const [searchParams] = useSearchParams();

  const [hideDeletedConfigs] = useAtom(areDeletedConfigsHidden);

  const hideDeleted = hideDeletedConfigs === "yes" ? true : false;

  const type = searchParams.get("type") ?? undefined;
  const tag = searchParams.get("tag") ?? undefined;

  const transformConfigRelationships = useCallback(
    (configs: ConfigTypeRelationships[]) =>
      configs
        ?.map((item) => {
          if (item.configs.id === id) {
            return item.related;
          }
          return item.configs;
        })
        .filter((item) => {
          if (type && item.type !== type) {
            return false;
          }
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
    [id, tag, type]
  );

  const {
    data: configItems,
    isLoading,
    refetch
  } = useQuery({
    queryKey: ["config", "relationships", id, hideDeleted],
    queryFn: () =>
      getDetailedConfigRelationships({
        configId: id!,
        hideDeleted: hideDeleted
      }),
    enabled: id !== undefined,
    select: (res) => transformConfigRelationships(res.data ?? [])
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
              handleRowClick={(row) => {
                navigate(`/catalog/${row.original.id}`);
              }}
            />
          </div>
        </div>
      </div>
    </ConfigDetailsTabs>
  );
}
