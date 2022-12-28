import { useEffect, useState } from "react";
import { GoDiff } from "react-icons/go";
import { useGetConfigChangesQueryById } from "../../api/query-hooks";
import CollapsiblePanel from "../CollapsiblePanel";
import { ConfigDetailsChanges } from "../ConfigDetailsChanges/ConfigDetailsChanges";
import EmptyState from "../EmptyState";
import { Loading } from "../Loading";
import Title from "../Title/title";

export type ConfigTypeChanges = {
  id: string;
  config_id: string;
  external_change_id: string;
  change_type: string;
  severity: string;
  source: string;
  summary: string;
  patches: string;
  details: string;
  created_at: string;
  created_by: string;
  external_created_by: string;
};

type Props = {
  configID: string;
};

export function ConfigChangesDetails({ configID }: Props) {
  const [configChanges, setConfigChanges] = useState<ConfigTypeChanges[]>([]);
  const { data, isLoading } = useGetConfigChangesQueryById(configID);

  useEffect(() => {
    if (!data) {
      return;
    }
    setConfigChanges(data);
  }, [data, configID]);

  return (
    <div className="flex flex-col space-y-2">
      {isLoading ? (
        <Loading />
      ) : configChanges.length > 0 ? (
        <div className="w-full text-sm">
          {configChanges.map((configChange) => (
            <div className="py-2 border-b border-dashed">
              <ConfigDetailsChanges
                key={configChange.id}
                id={configChange.id}
                configId={configChange.config_id}
                viewType="summary"
              />
            </div>
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}

export default function ConfigChanges(props: Props) {
  return (
    <CollapsiblePanel
      Header={
        <Title title="Changes" icon={<GoDiff className="w-6 h-auto" />} />
      }
    >
      <div className="w-full max-h-64 overflow-y-auto">
        <ConfigChangesDetails {...props} />
      </div>
    </CollapsiblePanel>
  );
}
