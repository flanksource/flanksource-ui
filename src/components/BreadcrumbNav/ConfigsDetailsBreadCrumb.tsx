import { BreadcrumbChild, BreadcrumbNav, BreadcrumbRoot } from ".";
import { useGetConfigByIdQuery } from "../../api/query-hooks";
import { ConfigItem } from "../../api/services/configs";
import { Icon } from "../Icon";
import TextSkeletonLoader from "../SkeletonLoader/TextSkeletonLoader";

type Props = {
  configId?: string;
  config?: ConfigItem;
};

export function ConfigsDetailsBreadcrumbNav({ configId, config }: Props) {
  const { isLoading, data } = useGetConfigByIdQuery(configId || config?.id!);

  const configItem = data ?? config;

  return (
    <BreadcrumbNav
      list={[
        <BreadcrumbRoot link="/configs">Config</BreadcrumbRoot>,
        isLoading && !configItem ? (
          <TextSkeletonLoader />
        ) : (
          <BreadcrumbChild>
            <span>
              <Icon
                name={configItem?.external_type || configItem?.config_type}
                className="h-5 mr-1"
              />
              {configItem?.name}
            </span>
          </BreadcrumbChild>
        )
      ]}
    />
  );
}
