import dayjs from "dayjs";
import { GoDiff } from "react-icons/go";
import { Link } from "react-router-dom";
import { useComponentConfigChanges } from "../../api/query-hooks/useComponentConfigChanges";
import PillBadge from "../Badge/PillBadge";
import CollapsiblePanel from "../CollapsiblePanel";
import ConfigLink from "../ConfigLink/ConfigLink";
import EmptyState from "../EmptyState";
import { Icon } from "../Icon";
import TextSkeletonLoader from "../SkeletonLoader/TextSkeletonLoader";
import Title from "../Title/title";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { refreshButtonClickedTrigger } from "../SlidingSideBar";

type Props = {
  topologyID: string;
};

export function TopologyConfigChanges({ topologyID }: Props) {
  const { data: componentConfigChanges = [], isLoading } =
    useComponentConfigChanges<Record<string, any>[]>(topologyID);

  return (
    <div className="flex flex-col ">
      <div className="flex flex-col">
        <div className="flex flex-col pl-2">
          {isLoading ? (
            <TextSkeletonLoader />
          ) : componentConfigChanges.length > 0 ? (
            componentConfigChanges.map((item) => (
              <div className="flex flex-row text-sm mb-2">
                <ConfigLink
                  className="text-zinc-600"
                  configId={item.config_id}
                  configName={item.name}
                  configType={item.external_type}
                  configTypeSecondary={item.config_type}
                />
                &nbsp;/&nbsp;
                <Link
                  className="block"
                  to={{
                    pathname: `/configs/${item.config_id}/changes`
                  }}
                >
                  <Icon name={item.change_type} />
                  {item.summary ?? item.change_type}
                </Link>
                <span className="text-right grow" data-tip={item.created_at}>
                  {dayjs(item.created_at).fromNow()}
                </span>
              </div>
            ))
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </div>
  );
}

// eslint-disable-next-line import/no-anonymous-default-export
export default function (props: Props) {
  const {
    data: componentConfigChanges = [],
    isRefetching,
    refetch,
    isLoading
  } = useComponentConfigChanges<Record<string, any>[]>(props.topologyID);

  const [triggerRefresh] = useAtom(refreshButtonClickedTrigger);

  useEffect(() => {
    if (!isLoading && !isRefetching) {
      refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerRefresh]);

  return (
    <CollapsiblePanel
      Header={
        <div className="flex flex-row w-full items-center space-x-2">
          <Title title="Changes" icon={<GoDiff className="w-6 h-auto" />} />
          <PillBadge>{componentConfigChanges?.length ?? 0}</PillBadge>
        </div>
      }
      dataCount={componentConfigChanges.length}
    >
      <div className="flex flex-col">
        <TopologyConfigChanges {...props} />
      </div>
    </CollapsiblePanel>
  );
}
