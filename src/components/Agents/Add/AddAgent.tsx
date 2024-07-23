import { useState } from "react";
import { AiFillPlusCircle } from "react-icons/ai";
import { useSearchParams } from "react-router-dom";
import { GeneratedAgent } from "../../../api/services/agents";
import InstallAgentModal from "../InstalAgentInstruction/InstallAgentModal";
import AgentForm, { AgentFormValues } from "./AddAgentForm";

type Props = {
  refresh: () => void;
};

export default function AddAgent({ refresh }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();

  const isModalOpen = searchParams.get("addAgent") === "true";
  const setIsModalOpen = (isOpen: boolean) => {
    if (isOpen) {
      searchParams.set("addAgent", isOpen.toString());
    } else {
      searchParams.delete("addAgent");
    }
    setSearchParams(searchParams);
  };

  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [generatedAgent, setGeneratedAgent] = useState<GeneratedAgent>();
  const [agentFormValues, setAgentFormValues] = useState<AgentFormValues>();

  return (
    <>
      <button type="button" className="" onClick={() => setIsModalOpen(true)}>
        <AiFillPlusCircle size={32} className="text-blue-600" />
      </button>
      <AgentForm
        isOpen={isModalOpen}
        onClose={() => {
          refresh();
          setIsModalOpen(false);
        }}
        onSuccess={(agent, formValues) => {
          refresh();
          setGeneratedAgent(agent);
          setAgentFormValues(formValues);
          setIsModalOpen(false);
          setIsInstallModalOpen(true);
        }}
      />
      {generatedAgent && (
        <InstallAgentModal
          isOpen={isInstallModalOpen}
          onClose={() => setIsInstallModalOpen(false)}
          generatedAgent={generatedAgent}
          agentFormValues={agentFormValues}
        />
      )}
    </>
  );
}
