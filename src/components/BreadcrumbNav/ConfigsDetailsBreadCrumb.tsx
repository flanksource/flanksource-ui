import { BreadcrumbChild, BreadcrumbNav, BreadcrumbRoot } from ".";
import { useGetConfigByIdQuery } from "../../api/query-hooks";
import { ConfigItem } from "../../api/types/configs";
import ConfigsTypeIcon from "../Configs/ConfigsTypeIcon";
import { ConfigIcon } from "../Icon/ConfigIcon";
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
        <BreadcrumbRoot key={"root-catalog"} link="/catalog">
          Catalog
        </BreadcrumbRoot>,
        ...(isLoading && !configItem
          ? [<TextSkeletonLoader key={"loader"} />]
          : [
              <BreadcrumbChild
                key="config-type-crumb"
                link={`/catalog?type=${config?.type}`}
              >
                <span className="whitespace-nowrap">
                  <ConfigsTypeIcon
                    config={{ type: config?.type }}
                    showSecondaryIcon
                    showLabel
                  />
                </span>
              </BreadcrumbChild>,
              <BreadcrumbChild key="config-name">
                <span>
                  <ConfigIcon config={configItem!} className="h-5 mr-1" />
                  {configItem?.name}
                </span>
              </BreadcrumbChild>
            ])
      ]}
    />
  );
}
