import ConfigLink from "@flanksource-ui/components/Configs/ConfigLink/ConfigLink";
import ConnectionLink from "@flanksource-ui/components/Connections/ConnectionLink";
import { PlaybookSpecLabel } from "@flanksource-ui/components/Playbooks/Settings/PlaybookSpecIcon";
import { TopologyLink } from "@flanksource-ui/components/Topology/TopologyLink";
import { useFormikContext } from "formik";

export default function PermissionResource() {
  const { values } = useFormikContext<Record<string, string>>();

  const componentId = values.component_id;
  const playbookId = values.playbook_id;
  const configId = values.config_id;
  const connectionId = values.connection_id;

  return (
    <div className="flex flex-row items-center">
      {componentId && (
        <TopologyLink viewType="label" topologyId={componentId} />
      )}
      {playbookId && <PlaybookSpecLabel playbookId={playbookId} />}
      {/*  {canaryId && <TopologyLink viewType="label" topology={canaryId} />} */}
      {configId && <ConfigLink configId={configId} />}
      {connectionId && <ConnectionLink connectionId={connectionId} />}
    </div>
  );
}
