import { useEffect, useState } from "react";
import { FaExclamationTriangle } from "react-icons/fa";
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
        `/api/configs_db/config_component_relationships?component_id=eq.${topologyID}&select=*`
      );
      const data = (await res.json()) as Record<string, any>[];
      const resRelatedConfig = await Promise.all(
        data.map(async (item) => {
          const res = await fetch(
            `/api/configs_db/configs?config_id=eq.${item.config_id}`
          );
          return res.json();
        })
      );
      setComponentRelatedConfig(resRelatedConfig.flat());
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
        <div className="flex flex-row justify-center items-center py-4 space-x-2 text-gray-500">
          <FaExclamationTriangle className="text-xl" />
          <span>No related configs found for this component</span>
        </div>
      )}
    </div>
  );
}

// eslint-disable-next-line import/no-anonymous-default-export
export default function (props: Props) {
  return (
    <CollapsiblePanel
      Header={<h3 className="text-xl font-semibold">Related configs</h3>}
    >
      <div className="flex flex-col px-4">
        <TopologyRelatedConfigs {...props} />
      </div>
    </CollapsiblePanel>
  );
}
