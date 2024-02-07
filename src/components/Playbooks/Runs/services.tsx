import { isEmpty } from "lodash";
import ConfigLink from "../../Configs/ConfigLink/ConfigLink";
import { CheckLink } from "../../HealthChecks/CheckLink";
import { TopologyLink } from "../../Topology/TopologyLink";
import { SubmitPlaybookRunFormValues } from "./Submit/SubmitPlaybookRunForm";

export type ActionResource = {
  label: string;
  link: React.ReactElement;
  id: string;
};

export function getResourceForRun(
  data: Partial<SubmitPlaybookRunFormValues>
): ActionResource | null {
  if (!isEmpty(data.component_id)) {
    return {
      id: data.component_id,
      label: "Component",
      link: <TopologyLink topologyId={data.component_id} size="sm" />
    } as ActionResource;
  }

  if (!isEmpty(data.config_id)) {
    return {
      id: data.config_id,
      label: "Config",
      link: <ConfigLink configId={data.config_id} />
    } as ActionResource;
  }

  if (!isEmpty(data.check_id)) {
    return {
      id: data.check_id,
      label: "Check",
      link: <CheckLink checkId={data.check_id} />
    } as ActionResource;
  }

  return null;
}
