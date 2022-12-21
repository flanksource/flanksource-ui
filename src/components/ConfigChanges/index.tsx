import { useEffect, useState } from "react";
import { GoDiff } from "react-icons/go";
import { relativeDateTime } from "../../utils/date";
import CollapsiblePanel from "../CollapsiblePanel";
import { ConfigDetailsChanges } from "../ConfigDetailsChanges/ConfigDetailsChanges";
import EmptyState from "../EmptyState";
import { Icon } from "../Icon";
import { Loading } from "../Loading";
import { Modal } from "../Modal";
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

function ConfigChangesDetails({ configID }: Props) {
  const [configChanges, setConfigChanges] = useState<ConfigTypeChanges[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedConfigChange, setSelectedConfigChange] =
    useState<ConfigTypeChanges>();

  useEffect(() => {
    async function fetchConfigAnalysis(configID: string) {
      setIsLoading(true);
      const res = await fetch(
        `/api/db/config_changes?config_id=eq.${configID}`
      );
      const data = (await res.json()) as ConfigTypeChanges[];
      setConfigChanges(data);
      setIsLoading(false);
    }

    fetchConfigAnalysis(configID);
  }, [configID]);

  return (
    <div className="flex flex-col space-y-2">
      <Modal
        title={"Config Change"}
        open={open}
        onClose={() => setOpen(false)}
        size="large"
        bodyClass=""
      >
        <div
          className="flex flex-col h-full py-4"
          style={{ maxHeight: "calc(100vh - 8rem)" }}
        >
          {selectedConfigChange?.config_id && (
            <ConfigDetailsChanges
              configId={selectedConfigChange.config_id}
              id={selectedConfigChange.id}
            />
          )}
        </div>
      </Modal>
      {isLoading ? (
        <Loading />
      ) : configChanges.length > 0 ? (
        <table className="w-full text-sm text-left">
          <thead className="text-sm uppercase text-gray-600">
            <tr>
              <th scope="col" className="p-2">
                Name
              </th>
              <th scope="col" className="p-2">
                Age
              </th>
            </tr>
          </thead>
          <tbody>
            {configChanges.map((configChange) => (
              <tr
                key={configChange.id}
                className="cursor-pointer"
                onClick={(e) => {
                  setOpen(true);
                  setSelectedConfigChange(configChange);
                }}
              >
                <td className="p-2 font-medium text-black whitespace-nowrap">
                  <div className="block">
                    <Icon
                      name={configChange.change_type}
                      secondary="diff"
                      className="w-5 h-auto pr-1"
                    />
                    {configChange.summary ?? configChange.change_type}
                  </div>
                </td>
                <td className="p-2 ">
                  <div className="block">
                    {relativeDateTime(configChange.created_at)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
