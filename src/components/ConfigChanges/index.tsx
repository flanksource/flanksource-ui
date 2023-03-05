import { useEffect, useState } from "react";
import { GoDiff } from "react-icons/go";
import { useGetConfigChangesQueryById } from "../../api/query-hooks";
import { ViewType } from "../../types";
import { relativeDateTime } from "../../utils/date";
import CollapsiblePanel from "../CollapsiblePanel";
import { ConfigDetailsChanges } from "../ConfigDetailsChanges/ConfigDetailsChanges";
import { DetailsTable } from "../DetailsTable/DetailsTable";
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

const columns = [
  {
    key: "change",
    label: "Name"
  },
  {
    key: "age",
    label: "Age"
  }
];

export function ConfigChangesDetails({ configID }: Props) {
  const [configChanges, setConfigChanges] = useState<
    {
      age: string;
      change: React.ReactNode;
    }[]
  >([]);
  const { data, isLoading } = useGetConfigChangesQueryById(configID);

  useEffect(() => {
    if (!data) {
      return;
    }
    const changes = data.map((item) => {
      return {
        age: relativeDateTime(item.created_at),
        change: (
          <div className="whitespace-nowrap">
            <ConfigDetailsChanges
              key={item.id}
              id={item.id}
              configId={item.config_id}
              viewType={ViewType.summary}
            />
          </div>
        )
      };
    });
    setConfigChanges(changes);
  }, [data, configID]);

  return (
    <div className="flex flex-col space-y-2">
      <DetailsTable
        loading={isLoading}
        data={configChanges}
        columns={columns}
      />
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
      <ConfigChangesDetails {...props} />
    </CollapsiblePanel>
  );
}
