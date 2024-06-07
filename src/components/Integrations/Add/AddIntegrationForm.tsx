import TopologyResourceForm from "@flanksource-ui/components/Integrations/Topology/TopologyResourceForm";
import LogBackendsForm from "@flanksource-ui/components/Logs/LogBackends/LogBackendsForm";
import { CreateIntegrationOption } from "./steps/AddIntegrationOptionsList";
import CatalogFormOption from "./steps/CatalogFormOption";
import MissionControlRegistryOptions from "./steps/MissionControlRegistryOptions";

type Props = {
  onSuccess: () => void;
  selectedOption: CreateIntegrationOption;
  onBack: () => void;
};

export default function AddIntegrationForm({
  onSuccess,
  selectedOption,
  onBack
}: Props) {
  switch (selectedOption) {
    case "AWS":
    case "Azure":
    case "Prometheus":
    case "Flux":
    case "Kubernetes":
    case "Mission Control":
      return (
        <MissionControlRegistryOptions
          selectedOption={selectedOption}
          onBack={onBack}
          onSuccess={onSuccess}
        />
      );
    case "Custom Topology":
      return (
        <TopologyResourceForm onBack={onBack} isModal onSuccess={onSuccess} />
      );
    case "Log Backends":
      return <LogBackendsForm onUpdated={onSuccess} />;
    case "Catalog Scraper":
      return <CatalogFormOption onSuccess={onSuccess} onBack={onBack} />;
    default:
      return null;
  }
}
