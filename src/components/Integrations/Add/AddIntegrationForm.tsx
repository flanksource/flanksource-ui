import TopologyResourceForm from "@flanksource-ui/components/Integrations/Topology/TopologyResourceForm";
import { IntegrationOption } from "./steps/AddIntegrationOptionsList";
import CatalogFormOption from "./steps/CatalogFormOption";
import MissionControlRegistryOptions from "./steps/MissionControlRegistryOptions";
import { SpecEditorProps } from "@flanksource-ui/components/SpecEditor/SpecEditor";
import { useMemo } from "react";

type Props = Pick<SpecEditorProps, | "onBack"> & {
  onSuccess: () => void;
  selectedOption: IntegrationOption;
  onBack: () => void;
};

export default function AddIntegrationForm({
  onSuccess,
  selectedOption,
  onBack
}: Props) {


  return useMemo(() => {
    if (selectedOption.category === "Scraper" || selectedOption.name === "Catalog Scraper") {

      return <CatalogFormOption onSuccess={onSuccess} onBack={onBack} />;
    } else if (selectedOption.name === "Custom Topology") {
      return <TopologyResourceForm onBack={onBack} isModal onSuccess={onSuccess} />
    } else {
      return <MissionControlRegistryOptions
        selectedOption={selectedOption}
        onBack={onBack}
        onSuccess={onSuccess}
      />
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOption])
}
