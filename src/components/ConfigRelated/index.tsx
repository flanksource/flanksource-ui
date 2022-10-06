import { useEffect, useState } from "react";
import { ConfigItem } from "../../api/services/configs";
import { Icon } from "../Icon";

export type ConfigTypeRelationships = {
  config_id: string;
  related_id: string;
  property: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  selector_id: string;
};

type Props = {
  configID: string;
};

export default function ConfigRelated({ configID }: Props) {
  const [relatedConfigs, setRelatedConfigs] = useState<ConfigItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchConfigAnalysis(configID: string) {
      setIsLoading(true);
      const res = await fetch(
        `/api/configs_db/config_relationships?config_id=eq.${configID}`
      );
      const data = (await res.json()) as ConfigTypeRelationships[];
      const relatedConfig = await Promise.all(
        data.map(async (relationship) => {
          const res = await fetch(
            `/api/configs_db/configs?id=eq.${relationship.related_id}`
          );
          const data = (await res.json()) as ConfigItem[];
          return data[0];
        })
      );
      setRelatedConfigs(relatedConfig);
      setIsLoading(false);
    }

    fetchConfigAnalysis(configID);
  }, [configID]);

  if (isLoading) {
    return null;
  }

  if (relatedConfigs?.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col space-y-2 w-full px-2 py-4">
      <h3 className="font-semibold text-xl py-4">Related Configs</h3>
      <ol>
        {relatedConfigs.map((config) => (
          <li className="p-1" key={config.id}>
            <Icon
              name={config.external_type}
              secondary={config.config_type}
              size="lg"
              className="mr-2"
            />
            {config.name}
          </li>
        ))}
      </ol>
    </div>
  );
}
