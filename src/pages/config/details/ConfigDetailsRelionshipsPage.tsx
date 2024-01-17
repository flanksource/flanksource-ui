import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { getDetailedConfigRelationships } from "@flanksource-ui/api/services/configs";
import { ConfigDetailsTabs } from "@flanksource-ui/components/Configs/ConfigDetailsTabs";
import ConfigList from "@flanksource-ui/components/Configs/ConfigList";

export function ConfigDetailsRelationshipsPage() {
  const { id } = useParams();

  const {
    data: configItems,
    isLoading,
    refetch
  } = useQuery({
    queryKey: ["config", "relationships", id],
    queryFn: () =>
      getDetailedConfigRelationships({
        configId: id!,
        hideDeleted: false
      }),
    enabled: id !== undefined
  });

  const navigate = useNavigate();

  const data = configItems?.data?.map((item) => {
    if (item.configs.id === id) {
      return item.related;
    }
    return item.configs;
  });

  return (
    <ConfigDetailsTabs
      pageTitlePrefix={"Config Relationships"}
      isLoading={isLoading}
      refetch={refetch}
      activeTabName="Relationships"
    >
      <div className={`flex flex-col flex-1 h-full space-y-2`}>
        <div className="flex flex-col h-full overflow-y-hidden">
          <ConfigList
            data={data ?? []}
            isLoading={isLoading}
            handleRowClick={() => {
              navigate(`/catalog/${id}`);
            }}
          />
        </div>
      </div>
    </ConfigDetailsTabs>
  );
}
