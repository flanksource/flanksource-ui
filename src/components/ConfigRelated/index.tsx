import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import { VscJson } from "react-icons/vsc";
import { Link } from "react-router-dom";
import {
  ConfigTypeRelationships,
  getRelatedConfigs
} from "../../api/services/configs";
import CollapsiblePanel from "../CollapsiblePanel";
import { Icon } from "../Icon";
import { Loading } from "../Loading";

function ConfigRelatedItem({
  item,
  configID
}: {
  item: ConfigTypeRelationships;
  configID: string;
}) {
  const config = useMemo(
    () => (configID === item.config_id ? item.related : item.configs),
    [configID, item]
  );

  return (
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
  );
}

type Props = {
  configID: string;
};

function ConfigRelatedDetails({ configID }: Props) {
  const { data: relatedConfigs, isLoading } = useQuery(
    ["config_relationships", configID],
    async () => getRelatedConfigs(configID)
  );

  return (
    <div className="flex flex-col space-y-2">
      {isLoading ? (
        <Loading />
      ) : relatedConfigs && relatedConfigs.length > 0 ? (
        <ol>
          {relatedConfigs.map((config) => (
            <ConfigRelatedItem item={config} configID={configID} />
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
