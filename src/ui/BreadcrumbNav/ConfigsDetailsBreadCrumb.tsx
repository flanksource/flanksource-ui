import { BreadcrumbChild, BreadcrumbNav, BreadcrumbRoot } from ".";
import { ConfigItem } from "../../api/types/configs";
import ConfigsTypeIcon from "../../components/Configs/ConfigsTypeIcon";
import TextSkeletonLoader from "../SkeletonLoader/TextSkeletonLoader";

type Props = {
  isLoading?: boolean;
  config?: ConfigItem;
  children?: React.ReactNode;
};

export function ConfigsDetailsBreadcrumbNav({
  isLoading,
  config,
  children
}: Props) {
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
                link={`/catalog?configType=${config?.type}`}
              >
                <span className="whitespace-nowrap">
                  <ConfigsTypeIcon config={{ type: config?.type! }} showLabel />
                </span>
              </BreadcrumbChild>,
              <BreadcrumbChild
                link={`/catalog/${config?.id}`}
                key="config-name"
              >
                {config?.name}
              </BreadcrumbChild>
            ]),
        ...(children ? [children] : [])
      ]}
    />
  );
}
