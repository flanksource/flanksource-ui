import clsx from "clsx";
import { useEffect, useState } from "react";
import { VscJson } from "react-icons/vsc";
import { TbTrash, TbTrashOff } from "react-icons/tb";
import ReactTooltip from "react-tooltip";
import {
  ConfigItem,
  ConfigTypeRelationships,
  getConfigsBy
} from "../../api/services/configs";
import CollapsiblePanel from "../CollapsiblePanel";
import ConfigLink from "../ConfigLink/ConfigLink";
import EmptyState from "../EmptyState";
import Title from "../Title/title";
import { Badge } from "../Badge";
import { IconButton } from "../IconButton";
import TextSkeletonLoader from "../SkeletonLoader/TextSkeletonLoader";
import { useQuery } from "@tanstack/react-query";
import { refreshButtonClickedTrigger } from "../SlidingSideBar";
import { useAtom } from "jotai";

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
  const {
    data: configs = [],
    isLoading,
    refetch,
    isRefetching
  } = useQuery(
    [
      "configs",
      "related",
      ...(topologyId ? ["topology", topologyId] : []),
      ...(configId ? ["configs", configId] : [])
    ],
    async () => {
      const res = await getConfigsBy({
        topologyId: topologyId,
        configId: configId
      });
      return res?.data ?? [];
    },
    {
      select: (data) => {
        const items = data
          .map((item) => ({
            configs: item.configs,
            related: item.related
          }))
          .reduce((a: ConfigItem[], i) => {
            if (a == null) {
              a = [];
            }
            if ((i as ConfigTypeRelationships).configs?.id !== configId) {
              a.push((i as ConfigTypeRelationships).configs);
            }
            if ((i as ConfigTypeRelationships).related?.id !== configId) {
              a.push((i as ConfigTypeRelationships).related);
            }
            return a;
          }, [])
          .sort((ent: ConfigItem) => (ent.deleted_at ? 1 : -1));
        return items ?? [];
      }
    }
  );

  const [triggerRefresh] = useAtom(refreshButtonClickedTrigger);

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
        <ol>
          {configs.map((config) => (
            <li
              key={config.id}
              className={clsx("p-1", {
                hidden: hideDeletedConfigs && config.deleted_at
              })}
            >
              <ConfigLink
                configId={config.id}
                configName={config.name}
                configType={config.type}
                configTypeSecondary={config.config_class}
              />
              {config.deleted_at && (
                <Badge
                  text="deleted"
                  colorClass="text-white bg-gray-400"
                  className="ml-2"
                />
              )}
            </li>
          ))}
        </ol>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}

// eslint-disable-next-line import/no-anonymous-default-export
export default function Configs({
  isCollapsed,
  onCollapsedStateChange,
  ...props
}: Props) {
  const [hideDeletedConfigs, setHideDeletedConfigs] = useState(true);

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
        <div className="flex flex-row items-center">
          <Title title="Configs" icon={<VscJson className="w-6 h-auto" />} />
          <div className="flex grow ml-5 text-right justify-center">
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
