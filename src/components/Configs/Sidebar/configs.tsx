import clsx from "clsx";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { TbTrash, TbTrashOff } from "react-icons/tb";
import { VscJson } from "react-icons/vsc";
import ReactTooltip from "react-tooltip";
import { useComponentConfigRelationshipQuery } from "../../../api/query-hooks/useComponentConfigRelationshipQuery";
import { removeManualComponentConfigRelationship } from "../../../api/services/configs";
import { Badge } from "../../Badge";
import CollapsiblePanel from "../../CollapsiblePanel";
import ConfigLink from "../ConfigLink/ConfigLink";
import { ConfirmationPromptDialog } from "../../Dialogs/ConfirmationPromptDialog";
import EmptyState from "../../EmptyState";
import { IconButton } from "../../IconButton";
import TextSkeletonLoader from "../../SkeletonLoader/TextSkeletonLoader";
import { refreshButtonClickedTrigger } from "../../SlidingSideBar";
import Title from "../../Title/title";
import { toastError, toastSuccess } from "../../Toast/toast";
import TopologyConfigsActionsDropdown from "../../Topology/Sidebar/Utils/TopologyConfigsActionsDropdown";

type Props = {
  topologyId?: string;
  configId?: string;
  hideDeletedConfigs?: boolean;
  isCollapsed?: boolean;
  onCollapsedStateChange?: (isClosed: boolean) => void;
};

export function ConfigsList({
  topologyId,
  configId,
  hideDeletedConfigs
}: Props) {
  const [triggerRefresh] = useAtom(refreshButtonClickedTrigger);
  const [deletedConfigLinkId, setDeletedConfigLinkId] = useState<
    string | undefined
  >();

  const {
    data: res,
    isLoading,
    isRefetching,
    refetch
  } = useComponentConfigRelationshipQuery({ topologyId, configId });

  const configs = res?.data ?? [];

  const deleteLink = async (configId: string) => {
    if (!topologyId) {
      return;
    }
    try {
      const response = await removeManualComponentConfigRelationship(
        topologyId,
        configId
      );
      if (response.data) {
        toastSuccess("Deleted config link successfully");
        refetch();
        setDeletedConfigLinkId(undefined);
        return;
      }
      toastError(response.error?.message);
    } catch (ex) {
      toastError((ex as Error).message);
    }
  };

  useEffect(() => {
    if (!isLoading && !isRefetching) {
      refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerRefresh]);

  return (
    <div className="flex flex-col space-y-4 text-sm">
      {isLoading ? (
        <TextSkeletonLoader className="w-full my-2" />
      ) : configs.length > 0 ? (
        <ol className="flex flex-col w-full overflow-x-hidden">
          {configs.map((config) => (
            <li
              key={config.config_id}
              className={clsx("p-1 relative flex flex-row flex-1", {
                hidden: hideDeletedConfigs && config.deleted_at
              })}
            >
              <ConfigLink
                config={config.configs}
                className="overflow-hidden text-ellipsis flex-1 whitespace-nowrap"
              />
              {config.deleted_at && (
                <Badge
                  text="deleted"
                  colorClass="text-white bg-gray-400"
                  className="ml-2"
                />
              )}
              {/* only show delete button on manually linked configs */}
              {topologyId && config.selector_id === "manual" && (
                <TopologyConfigsActionsDropdown
                  onUnlinkUser={() => setDeletedConfigLinkId(config.config_id)}
                />
              )}
            </li>
          ))}
        </ol>
      ) : (
        <EmptyState />
      )}
      <ConfirmationPromptDialog
        isOpen={Boolean(deletedConfigLinkId)}
        title="Delete config link"
        description={`Are you sure you want to delete this config link`}
        yesLabel="Delete"
        onClose={() => setDeletedConfigLinkId(undefined)}
        onConfirm={() => {
          deleteLink(deletedConfigLinkId!);
        }}
      />
    </div>
  );
}

export default function Configs({
  isCollapsed,
  onCollapsedStateChange,
  ...props
}: Props) {
  const [hideDeletedConfigs, setHideDeletedConfigs] = useState(
    () => props.hideDeletedConfigs ?? true
  );

  const { data: res } = useComponentConfigRelationshipQuery({
    ...props,
    hideDeleted: hideDeletedConfigs
  });

  const configs = res?.data ?? [];

  const TrashIconType = hideDeletedConfigs ? TbTrashOff : TbTrash;
  const handleTrashIconClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    setHideDeletedConfigs((state) => !state);
  };

  useEffect(() => {
    ReactTooltip.rebuild();
  });

  return (
    <CollapsiblePanel
      onCollapsedStateChange={onCollapsedStateChange}
      isCollapsed={isCollapsed}
      Header={
        <div className="flex flex-row items-center space-x-2">
          <Title title="Catalog" icon={<VscJson className="w-6 h-auto" />} />
          <Badge
            className="w-5 h-5 flex items-center justify-center"
            roundedClass="rounded-full"
            text={configs?.length ?? 0}
          />
          <div className="flex grow text-right justify-center">
            <IconButton
              data-tip={`${
                hideDeletedConfigs ? "Show" : "Hide"
              } deleted configs`}
              icon={
                <TrashIconType
                  size={18}
                  className="text-gray-600 border-0 border-l-1 border-gray-200"
                />
              }
              onClick={handleTrashIconClick}
              className="ml-2"
            />
          </div>
        </div>
      }
    >
      <div className="flex flex-col">
        <ConfigsList {...{ ...props, hideDeletedConfigs }} />
      </div>
    </CollapsiblePanel>
  );
}
