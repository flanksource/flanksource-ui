import { BreadcrumbNav } from ".";
import { useConfigNameQuery } from "../../api/query-hooks";
import { ConfigItem } from "../../api/services/configs";
import { Icon } from "../Icon";
import { Loading } from "../Loading";

type Props = {
  configId?: string;
  config?: Pick<ConfigItem, "external_type" | "config_type" | "name">;
};

export function ConfigsDetailsBreadcrumbNav({ configId, config }: Props) {
  const { isLoading, data } = useConfigNameQuery(configId, {
    enabled: !!configId && !config
  });

  const configItem = data ?? config;

  return (
    <BreadcrumbNav
      list={[
        { to: "/configs", title: "Config" },
        isLoading && !configItem ? (
          <Loading />
        ) : (
          <span>
            <Icon
              name={configItem?.external_type || configItem?.config_type}
              className="h-5 mr-1"
            />
            {configItem?.name}
          </span>
        )
      ]}
    />
  );
}
