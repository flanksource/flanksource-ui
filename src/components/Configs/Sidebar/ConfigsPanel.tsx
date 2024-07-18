import { ConfirmationPromptDialog } from "@flanksource-ui/ui/AlertDialog/ConfirmationPromptDialog";
import { Badge } from "@flanksource-ui/ui/Badge/Badge";
import CollapsiblePanel from "@flanksource-ui/ui/CollapsiblePanel/CollapsiblePanel";
import clsx from "clsx";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { TbTrash, TbTrashOff } from "react-icons/tb";
import { VscJson } from "react-icons/vsc";
import { Tooltip } from "react-tooltip";
import { useComponentConfigRelationshipQuery } from "../../../api/query-hooks/useComponentConfigRelationshipQuery";
import { removeManualComponentConfigRelationship } from "../../../api/services/configs";
import { IconButton } from "../../../ui/Buttons/IconButton";
import TextSkeletonLoader from "../../../ui/SkeletonLoader/TextSkeletonLoader";
import { refreshButtonClickedTrigger } from "../../../ui/SlidingSideBar/SlidingSideBar";
import EmptyState from "../../EmptyState";
import Title from "../../Title/title";
import { toastError, toastSuccess } from "../../Toast/toast";
import TopologyConfigsActionsDropdown from "../../Topology/Sidebar/Utils/TopologyConfigsActionsDropdown";
import ConfigLink from "../ConfigLink/ConfigLink";

type Props = {
  topologyId?: string;
  configId?: string;
  hideDeletedConfigs?: boolean;
  isCollapsed?: boolean;
  onCollapsedStateChange?: (isClosed: boolean) => void;
};

export function ConfigsPanelList({
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
        <TextSkeletonLoader className="my-2 w-full" />
      ) : configs.length > 0 ? (
        <ol className="flex w-full flex-col overflow-x-hidden">
          {configs.map((config) => (
            <li
              key={
                config.configs.id === configId
                  ? config.related.id
                  : config.configs.id
              }
              className={clsx("relative flex flex-1 flex-row p-1", {
                hidden: hideDeletedConfigs && config.deleted_at
              })}
            >
              <ConfigLink
                config={
                  config.configs.id === configId
                    ? config.related
                    : config.configs
                }
                className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap"
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

export default function ConfigsPanel({
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

  return (
    <CollapsiblePanel
      onCollapsedStateChange={onCollapsedStateChange}
      isCollapsed={isCollapsed}
      Header={
        <div className="flex flex-row items-center space-x-2">
          <Title title="Catalog" icon={<VscJson className="h-auto w-6" />} />
          <Badge
            className="flex h-5 w-5 items-center justify-center"
            roundedClass="rounded-full"
            text={configs?.length ?? 0}
            title="Total catalog count"
          />
          <div className="flex grow justify-center text-right">
            <IconButton
              data-tooltip-id="deleted-tooltip"
              data-tooltip-content={`${
                hideDeletedConfigs ? "Show" : "Hide"
              } deleted configs`}
              icon={
                <TrashIconType
                  size={18}
                  className="border-l-1 border-0 border-gray-200 text-gray-600"
                />
              }
              onClick={handleTrashIconClick}
              className="ml-2"
            />
            <Tooltip id="deleted-tooltip" />
          </div>
        </div>
      }
    >
      <div className="flex flex-col">
        <ConfigsPanelList {...{ ...props, hideDeletedConfigs }} />
      </div>
    </CollapsiblePanel>
  );
}
