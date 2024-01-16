import { BreadcrumbChild, BreadcrumbNav, BreadcrumbRoot } from ".";
import { ConfigItem } from "../../api/types/configs";
import ConfigsTypeIcon from "../Configs/ConfigsTypeIcon";
import { ConfigIcon } from "../Icon/ConfigIcon";
import TextSkeletonLoader from "../SkeletonLoader/TextSkeletonLoader";

type Props = {
  isLoading?: boolean;
  config?: ConfigItem;
};

export function ConfigsDetailsBreadcrumbNav({ isLoading, config }: Props) {
  return (
    <BreadcrumbNav
      list={[
        <BreadcrumbRoot key={"root-catalog"} link="/catalog">
          Catalog
        </BreadcrumbRoot>,
        ...(isLoading && !config
          ? [<TextSkeletonLoader key={"loader"} />]
          : [
              <BreadcrumbChild
                key="config-type-crumb"
                link={`/catalog?type=${config?.type}`}
              >
                <span className="whitespace-nowrap">
                  <ConfigsTypeIcon config={{ type: config?.type }} showLabel />
                </span>
              </BreadcrumbChild>,
              <BreadcrumbChild key="config-name">
                <span>
                  <ConfigIcon config={config!} className="h-5 mr-1" />
                  {config?.name}
                </span>
              </BreadcrumbChild>
            ])
      ]}
    />
  );
}
