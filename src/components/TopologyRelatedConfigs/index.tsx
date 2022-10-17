import { useEffect, useState } from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import { VscJson } from "react-icons/vsc";
import { Link } from "react-router-dom";
import CollapsiblePanel from "../CollapsiblePanel";
import { Icon } from "../Icon";
import { Loading } from "../Loading";

type Props = {
  topologyID: string;
};

export function TopologyRelatedConfigs({ topologyID }: Props) {
  const [componentRelatedConfigs, setComponentRelatedConfig] = useState<
    Record<string, any>[]
  >([]);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchComponentRelatedConfig() {
      setIsLoading(true);
      const res = await fetch(
        `/api/configs_db/config_component_relationships?component_id=eq.${topologyID}&select=*,configs!config_component_relationships_config_id_fkey(*)`
      );
      const data = (await res.json()) as Record<string, any>[];
      setComponentRelatedConfig(data.map((config) => config.configs));
      setIsLoading(false);
    }

    fetchComponentRelatedConfig();
  }, [topologyID]);

  return (
    <div className="flex flex-col space-y-4">
      {isLoading ? (
        <Loading />
      ) : componentRelatedConfigs.length > 0 ? (
        <ol>
          {componentRelatedConfigs.map((config) => (
            <li className="p-1" key={config.id}>
              <Link
                to={{
                  pathname: `/configs/${config.id}`
                }}
              >
                <Icon
                  name={config.external_type}
                  secondary={config.config_type}
                  size="lg"
                  className="mr-2"
                />
                {config.name}
              </Link>
            </li>
          ))}
        </ol>
      ) : (
        <div className="flex flex-row justify-center items-center py-4 space-x-2 text-gray-400">
          <FaExclamationTriangle className="text-xl" />
          <span>No details found</span>
        </div>
      )}
    </div>
  );
}

// eslint-disable-next-line import/no-anonymous-default-export
export default function (props: Props) {
  return (
    <CollapsiblePanel
      Header={
        <h3 className="flex flex-row space-x-2 items-center text-xl font-semibold">
          <VscJson className="text-gray-400" />
          <span>Configs</span>
        </h3>
      }
    >
      <div className="flex flex-col">
        <TopologyRelatedConfigs {...props} />
      </div>
    </CollapsiblePanel>
  );
}
