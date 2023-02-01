import clsx from "clsx";
import { useEffect, useState } from "react";
import { VscJson } from "react-icons/vsc";
import { reduce } from "lodash";
import { TbTrash, TbTrashOff } from "react-icons/tb";
import ReactTooltip from "react-tooltip";
import { ConfigItem, getConfigsBy } from "../../api/services/configs";
import CollapsiblePanel from "../CollapsiblePanel";
import ConfigLink from "../ConfigLink/ConfigLink";
import EmptyState from "../EmptyState";
import Title from "../Title/title";
import { Badge } from "../Badge";
import { IconButton } from "../IconButton";
import TextSkeletonLoader from "../SkeletonLoader/TextSkeletonLoader";

type Props = {
  topologyId?: string;
  configId?: string;
  hideDeletedConfigs?: boolean;
};

export function ConfigsList({
  topologyId,
  configId,
  hideDeletedConfigs
}: Props) {
  const [configs, setConfigs] = useState<ConfigItem[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchConfigs() {
      setIsLoading(true);
      const res = await getConfigsBy({
        topologyId: topologyId,
        configId: configId
      });
      let items: ConfigItem[] = [];
      if (res!.data) {
        items = reduce(
          res?.data,
          (a, i) => {
            if (a == null) {
              a = [];
            }
            if (i.configs.id !== configId) {
              a.push(i.configs);
            }
            if (i.related.id !== configId) {
              a.push(i.related);
            }
            return a;
          },
          []
        ).sort((ent: ConfigItem) => (ent.deleted_at ? 1 : -1));
      }
      setConfigs(items);
      setIsLoading(false);
    }

    fetchConfigs();
  }, [topologyId, configId]);

  return (
    <div className="flex flex-col space-y-4 text-sm">
      {isLoading ? (
        <TextSkeletonLoader />
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
                configType={config.external_type}
                configTypeSecondary={config.config_type}
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
export default function Configs(props: Props) {
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
