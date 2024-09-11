import dayjs from "dayjs";
import { FaTrash } from "react-icons/fa";
import { Tooltip } from "react-tooltip";
import { BreadcrumbChild, BreadcrumbNav, BreadcrumbRoot } from ".";
import { ConfigItem } from "../../api/types/configs";
import ConfigsTypeIcon from "../../components/Configs/ConfigsTypeIcon";
import { formatDateForTooltip } from "../Age/Age";
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
  const isDeleted = !!config?.deleted_at;
  const timestamp = isDeleted
    ? formatDateForTooltip(dayjs(config?.deleted_at))
    : undefined;

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
                <div className="flex items-center gap-2">
                  <span>{config?.name}</span>
                  {isDeleted && (
                    <>
                      <FaTrash
                        data-tooltip-id={`deleted-${config?.id}`}
                        className="inline-block text-red-500"
                      />
                      <Tooltip
                        id={`deleted-${config?.id}`}
                        content={`Deleted: ${timestamp}`}
                      />
                    </>
                  )}
                </div>
              </BreadcrumbChild>
            ]),
        ...(children ? [children] : [])
      ]}
    />
  );
}
