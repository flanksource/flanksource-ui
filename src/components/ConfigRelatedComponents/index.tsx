import { useEffect, useState } from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { ConfigItem } from "../../api/services/configs";
import { Icon } from "../Icon";
import { Loading } from "../Loading";

export type ConfigTypeRelationships = {
  config_id: string;
  related_id: string;
  property: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  selector_id: string;
  components: Record<string, any>;
};

type Props = {
  configID: string;
};

export default function ConfigRelatedComponents({ configID }: Props) {
  const [components, setConfigRelationships] = useState<
    ConfigTypeRelationships[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchConfigAnalysis(configID: string) {
      setIsLoading(true);
      const res = await fetch(
        `/api/configs_db/config_component_relationships?config_id=eq.${configID}&select=*,components!config_component_relationships_component_id_fkey(*)`
      );
      const data = (await res.json()) as ConfigTypeRelationships[];
      setConfigRelationships(data);
      setIsLoading(false);
    }

    fetchConfigAnalysis(configID);
  }, [configID]);

  return (
    <div className="flex flex-col space-y-2 w-full px-2 py-4">
      <h3 className="font-semibold text-xl py-4">Components</h3>
      {isLoading ? (
        <Loading />
      ) : components.length > 0 ? (
        <ol className="w-full text-sm text-left">
          {components.map((analysis) => (
            <li className="" key={analysis.related_id}>
              <Link
                className="space-x-2"
                to={{
                  pathname: `/topology/${analysis.components.topology_id}`
                }}
              >
                <Icon
                  name={analysis.components.icon}
                  size="2xl"
                  secondary={analysis.components.name}
                />
                <span className="capitalize">{analysis.components.name}</span>
              </Link>
            </li>
          ))}
        </ol>
      ) : (
        <div className="flex flex-row justify-center items-center space-x-2 text-gray-500 text-center">
          <FaExclamationTriangle />
          <span>No components found</span>
        </div>
      )}
    </div>
  );
}
