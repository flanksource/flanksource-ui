import { useContext } from "react";
import { GeneratedAgent } from "../../api/services/agents";
import { Button } from "../Button";
import CodeBlock from "../CodeBlock/CodeBlock";
import { Modal } from "../Modal";
import { AuthContext } from "../../context";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  generatedAgent: GeneratedAgent;
};

export default function InstallAgentModal({
  isOpen,
  onClose,
  generatedAgent
}: Props) {
  const { backendUrl } = useContext(AuthContext);

  return (
    <Modal
      title={"Installation Instructions"}
      onClose={onClose}
      open={isOpen}
      bodyClass="flex flex-col w-full flex-1 h-full overflow-y-auto"
    >
      <div className="flex flex-col flex-1 p-4 gap-4 overflow-y-auto">
        <p>Copy the following command to install agent</p>
        <CodeBlock
          code={`helm repo add flanksource https://flanksource.github.io/charts
helm repo update
helm install mc-agent flanksource/mission-control-agent -n "mission-control-agent"  --create-namespace --set upstream.createSecret=true --set upstream.host=${backendUrl} --set upstream.username=${generatedAgent.username} --set upstream.password=${generatedAgent.access_token}`}
        />
      </div>
      <div className="flex flex-row justify-end gap-4 p-4">
        <Button text="Close" onClick={onClose} />
      </div>
    </Modal>
  );
}
