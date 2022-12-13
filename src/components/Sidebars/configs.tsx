import { useEffect, useState } from "react";
import { VscJson } from "react-icons/vsc";
import { ConfigItem, getConfigsBy } from "../../api/services/configs";
import CollapsiblePanel from "../CollapsiblePanel";
import ConfigLink from "../ConfigLink/ConfigLink";
import EmptyState from "../EmptyState";
import { Loading } from "../Loading";
import Title from "../Title/title";

type Props = {
  topologyId?: string;
  configId?: string;
};

export function ConfigsList({ topologyId, configId }: Props) {
  const [configs, setConfigs] = useState<ConfigItem[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchConfigs() {
      setIsLoading(true);
      const res = await getConfigsBy({
        topologyId: topologyId,
        configId: configId
      });
      var items = [];
      if (res.data) {
        items = _.reduce(
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
        );
      }
      setConfigs(items);
      setIsLoading(false);
    }

    fetchConfigs();
  }, [topologyId, configId]);

  return (
    <div className="flex flex-col space-y-4 text-sm">
      {isLoading ? (
        <Loading />
      ) : configs.length > 0 ? (
        <ol>
          {configs.map((config) => (
            <li className="p-1" key={config.id}>
              <ConfigLink
                configId={config.id}
                configName={config.name}
                configType={config.external_type}
                configTypeSecondary={config.config_type}
              />
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
  return (
    <CollapsiblePanel
      Header={
        <Title title="Configs" icon={<VscJson className="w-6 h-auto" />} />
      }
    >
      <div className="flex flex-col">
        <ConfigsList {...props} />
      </div>
    </CollapsiblePanel>
  );
}
