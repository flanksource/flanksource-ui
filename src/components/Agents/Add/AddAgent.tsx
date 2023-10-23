import { useState } from "react";
import { AiFillPlusCircle } from "react-icons/ai";
import AgentForm from "./AddAgentForm";
import { GeneratedAgent } from "../../../api/services/agents";
import InstallAgentModal from "../InstallAgentModal";

type Props = {
  refresh: () => void;
};

export default function AddAgent({ refresh }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [generatedAgent, setGeneratedAgent] = useState<GeneratedAgent>();

  return (
    <>
      <button type="button" className="" onClick={() => setIsModalOpen(true)}>
        <AiFillPlusCircle size={32} className="text-blue-600" />
      </button>
      <AgentForm
        isOpen={isModalOpen}
        onClose={() => {
          // todo: show modal with helm install instructions
          refresh();
          return setIsModalOpen(false);
        }}
        onSuccess={(agent) => {
          setGeneratedAgent(agent);
          setIsModalOpen(false);
          setIsInstallModalOpen(true);
        }}
      />
      {generatedAgent && (
        <InstallAgentModal
          isOpen={isInstallModalOpen}
          onClose={() => setIsInstallModalOpen(false)}
          generatedAgent={generatedAgent}
        />
      )}
    </>
  );
}
