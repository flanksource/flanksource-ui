import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import { VscJson } from "react-icons/vsc";
import { Link } from "react-router-dom";
import { ConfigItem } from "../../api/services/configs";
import CollapsiblePanel from "../CollapsiblePanel";
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
  configs: ConfigItem;
};

type Props = {
  configID: string;
};

function ConfigRelatedDetails({ configID }: Props) {
  const { data: relatedConfigs, isLoading } = useQuery(
    ["config_relationships", configID],
    async () => {
      const res = await fetch(
        `/api/configs_db/config_relationships?&or=(related_id.eq.${configID},config_id.eq.${configID})&select=*,configs!config_relationships_related_id_fkey(*)`
      );
      const data = (await res.json()) as ConfigTypeRelationships[];
      return data.map((item) => item.configs);
    }
  );

  return (
    <div className="flex flex-col space-y-2">
      {isLoading ? (
        <Loading />
      ) : relatedConfigs && relatedConfigs.length > 0 ? (
        <ol>
          {relatedConfigs.map((config) => (
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
        <div className="flex flex-row justify-center items-center space-x-2 text-gray-500 text-center">
          <FaExclamationTriangle />
          <span>No details found</span>
        </div>
      )}
    </div>
  );
}

export default function ConfigChanges(props: Props) {
  return (
    <CollapsiblePanel
      Header={
        <h3 className="flex flex-row space-x-2 items-center text-xl font-semibold">
          <VscJson className="text-gray-400" />
          <span>Related Configs</span>
        </h3>
      }
    >
      <ConfigRelatedDetails {...props} />
    </CollapsiblePanel>
  );
}
