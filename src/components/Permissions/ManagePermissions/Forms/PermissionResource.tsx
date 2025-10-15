import ConfigLink from "@flanksource-ui/components/Configs/ConfigLink/ConfigLink";
import ConnectionLink from "@flanksource-ui/components/Connections/ConnectionLink";
import { PlaybookSpecLabel } from "@flanksource-ui/components/Playbooks/Settings/PlaybookSpecIcon";
import { TopologyLink } from "@flanksource-ui/components/Topology/TopologyLink";
import CanaryLink from "@flanksource-ui/components/Canary/CanaryLink";
import { getCanaryById } from "@flanksource-ui/api/services/topology";
import { useQuery } from "@tanstack/react-query";
import { useFormikContext } from "formik";
import { permissionObjectList } from "./FormikPermissionSelectResourceFields";

export default function PermissionResource() {
  const { values } = useFormikContext<Record<string, any>>();

  const componentId = values.component_id;
  const playbookId = values.playbook_id;
  const configId = values.config_id;
  const canaryId = values.canary_id;
  const connectionId = values.connection_id;
  const object = values.object;
  const objectSelector = values.object_selector;

  const { data: canary } = useQuery({
    queryKey: ["canary", canaryId],
    queryFn: () => getCanaryById(canaryId!),
    enabled: !!canaryId
  });

  if (object) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <>{permissionObjectList.find((o) => o.value === object)?.label}</>;
  }

  if (objectSelector?.scopes) {
    const scopeNames = objectSelector.scopes
      .map((scope: { namespace?: string; name: string }) =>
        scope.namespace ? `${scope.namespace}/${scope.name}` : scope.name
      )
      .join(", ");
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <>Scopes: {scopeNames}</>;
  }

  return (
    <div className="flex flex-row items-center">
      {componentId && (
        <TopologyLink viewType="label" topologyId={componentId} />
      )}
      {playbookId && <PlaybookSpecLabel playbookId={playbookId} />}
      {canary && <CanaryLink canary={canary} />}
      {configId && <ConfigLink configId={configId} />}
      {connectionId && <ConnectionLink connectionId={connectionId} />}
    </div>
  );
}
