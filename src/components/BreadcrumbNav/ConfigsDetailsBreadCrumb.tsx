import { BreadcrumbChild, BreadcrumbNav, BreadcrumbRoot } from ".";
import { useGetConfigByIdQuery } from "../../api/query-hooks";
import { ConfigItem } from "../../api/types/configs";
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
        <BreadcrumbRoot link="/catalog">Catalog</BreadcrumbRoot>,
        isLoading && !configItem ? (
          <TextSkeletonLoader />
        ) : (
          <BreadcrumbChild>
            <span>
              <ConfigIcon config={configItem!} className="h-5 mr-1" />
              {configItem?.name}
            </span>
          </BreadcrumbChild>
        )
      ]}
    />
  );
}
