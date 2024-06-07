import dayjs from "dayjs";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { GoDiff } from "react-icons/go";
import { Tooltip } from "react-tooltip";
import { useComponentConfigChanges } from "../../../../api/query-hooks/useComponentConfigChanges";
import { useGetConfigChangesById } from "../../../../api/query-hooks/useGetConfigChangesByConfigChangeIdQuery";
import { ConfigChange } from "../../../../api/types/configs";
import PillBadge from "../../../../ui/Badge/PillBadge";
import CollapsiblePanel from "../../../../ui/CollapsiblePanel/CollapsiblePanel";
import { ConfigIcon } from "../../../../ui/Icons/ConfigIcon";
import { Icon } from "../../../../ui/Icons/Icon";
import TextSkeletonLoader from "../../../../ui/SkeletonLoader/TextSkeletonLoader";
import { refreshButtonClickedTrigger } from "../../../../ui/SlidingSideBar/SlidingSideBar";
import { ConfigDetailChangeModal } from "../../../Configs/Changes/ConfigDetailsChanges/ConfigDetailsChanges";
import EmptyState from "../../../EmptyState";
import Title from "../../../Title/title";

type Props = {
  topologyID: string;
  isCollapsed?: boolean;
  onCollapsedStateChange?: (isClosed: boolean) => void;
};

export function TopologyConfigChanges({ topologyID }: Props) {
  const { data: componentConfigChanges = [], isLoading } =
    useComponentConfigChanges(topologyID);

  const [open, setOpen] = useState(false);

  const [selectedConfigChange, setSelectedConfigChanges] =
    useState<
      Pick<ConfigChange, "change_type" | "id" | "config_id" | "config">
    >();

  const { data: changeDetails, isLoading: changesLoading } =
    useGetConfigChangesById(
      selectedConfigChange?.id!,
      selectedConfigChange?.config_id!,
      {}
    );

  return (
    <>
      <div className="flex flex-col ">
        <div className="flex flex-col">
          <div className="flex flex-col overflow-ellipsis px-2 ">
            {isLoading ? (
              <TextSkeletonLoader />
            ) : componentConfigChanges.length > 0 ? (
              componentConfigChanges.map((item) => (
                <div
                  key={`change-${item.id}`}
                  className="flex flex-row text-sm mb-2 hover:cursor-pointer hover:bg-zinc-100"
                  onClick={() => {
                    setOpen(true);
                    setSelectedConfigChanges(item);
                  }}
                >
                  <ConfigIcon config={item.config} />
                  <div
                    className="flex flex-row shrink overflow-ellipsis whitespace-nowrap  overflow-hidden"
                    style={{ direction: "rtl" }}
                  >
                    <span className="overflow-ellipsis whitespace-nowrap overflow-hidden">
                      {item.config?.name}
                    </span>
                  </div>
                  &nbsp;/&nbsp;
                  <Icon name={item.change_type} />
                  <div className="pl-1 flex">
                    {item.summary ?? item.change_type}
                  </div>
                  <div
                    className="whitespace-nowrap grow text-right pl-2"
                    data-tooltip-id="created_at_tooltip"
                    data-tooltip-content={item.created_at?.toString()}
                  >
                    {dayjs(item.created_at).fromNow()}
                  </div>
                  <Tooltip id="created_at_tooltip" />
                </div>
              ))
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      </div>

      <ConfigDetailChangeModal
        open={open}
        isLoading={changesLoading}
        setOpen={setOpen}
        changeDetails={changeDetails}
      />
    </>
  );
}

// eslint-disable-next-line import/no-anonymous-default-export
export default function ({
  isCollapsed,
  onCollapsedStateChange,
  ...props
}: Props) {
  const {
    data: componentConfigChanges = [],
    isRefetching,
    refetch,
    isLoading
  } = useComponentConfigChanges(props.topologyID);

  const [triggerRefresh] = useAtom(refreshButtonClickedTrigger);

  useEffect(() => {
    if (!isLoading && !isRefetching) {
      refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerRefresh]);

  return (
    <CollapsiblePanel
      isCollapsed={isCollapsed}
      onCollapsedStateChange={onCollapsedStateChange}
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
