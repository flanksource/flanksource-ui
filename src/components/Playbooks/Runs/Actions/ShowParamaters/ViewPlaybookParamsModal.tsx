import {
  PlaybookParam,
  PlaybookRunWithActions
} from "@flanksource-ui/api/types/playbooks";
import ConfigLink from "@flanksource-ui/components/Configs/ConfigLink/ConfigLink";
import { TopologyLink } from "@flanksource-ui/components/Topology/TopologyLink";
import { JSONViewer } from "@flanksource-ui/ui/Code/JSONViewer";
import { Modal } from "@flanksource-ui/ui/Modal";
import PlaybookPeopleDetails from "./PlaybookPeopleLink";
import PlaybookTeamDetails from "./PlaybookTeamLink";

type RenderParamValueProps = {
  paramSpec: PlaybookParam;
  paramValue: any;
};

function RenderParamValue({ paramSpec, paramValue }: RenderParamValueProps) {
  console.log(paramSpec, paramValue);
  switch (paramSpec.type) {
    // for code, we want to render the code in a JSONViewer
    case "code":
      return (
        <JSONViewer
          format={(paramSpec.properties?.language as any) ?? "json"}
          code={paramValue as any}
        />
      );
    case "team":
      return <PlaybookTeamDetails teamId={paramValue} />;
    case "people":
      return <PlaybookPeopleDetails personId={paramValue} />;
    case "component":
      return <TopologyLink topologyId={paramValue} viewType="link" />;
    case "config":
      return <ConfigLink configId={paramValue} variant="link" />;
    default:
      return <span className="text-sm">{paramValue}</span>;
  }
}

type ViewPlaybookParamsModalProps = {
  data: PlaybookRunWithActions;
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
};

export default function ViewPlaybookParamsModal({
  data,
  isModalOpen,
  setIsModalOpen
}: ViewPlaybookParamsModalProps) {
  const playbookParamsSpecs = data.playbooks?.spec?.parameters ?? [];
  const playbookParams = data.parameters;

  if (!playbookParamsSpecs || !playbookParams) {
    return null;
  }

  return (
    <Modal
      open={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      title={`Parameters for ${data.playbooks?.name}`}
    >
      <div className="flex flex-col gap-2 p-4">
        {playbookParamsSpecs.map((paramSpec, index) => {
          const paramValue = playbookParams[paramSpec.name];
          return (
            <div key={index} className="flex flex-col gap-2">
              <div className="flex flex-row items-center gap-2">
                <div className="w-36">
                  <label className="text-sm font-semibold">
                    {paramSpec.label}:
                  </label>
                </div>
                <div className="flex flex-1 flex-col justify-center">
                  <RenderParamValue
                    paramSpec={paramSpec}
                    paramValue={paramValue}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Modal>
  );
}
