import { TupleToUnion } from "type-fest";
import AddTopologyOptionsList, {
  createTopologyOptions
} from "./StepsForms/AddTopologyOptionsList";
import { useEffect, useState } from "react";
import TopologyResourceForm from "./StepsForms/TopologyResourceForm";

type AddTopologyResourceProps = {
  onSuccess: () => void;
  isModal?: boolean;
  setModalTitle?: (title: string) => void;
};

export default function AddTopologyResource({
  onSuccess,
  isModal = false,
  setModalTitle = () => {}
}: AddTopologyResourceProps) {
  const [selectedOption, setSelectedOption] = useState<
    TupleToUnion<typeof createTopologyOptions> | undefined
  >();

  useEffect(() => {
    if (selectedOption) {
      setModalTitle(`Create  a ${selectedOption.toLocaleLowerCase()} topology`);
    } else {
      setModalTitle("Create Topology");
    }
  }, [selectedOption, setModalTitle]);

  return (
    <div className="flex flex-col flex-1 gap-2">
      {selectedOption ? (
        <TopologyResourceForm
          selectedOption={selectedOption}
          onSuccess={onSuccess}
          onBack={() => setSelectedOption(undefined)}
          isModal={isModal}
        />
      ) : (
        <AddTopologyOptionsList
          onSelectOption={(options) => setSelectedOption(options)}
        />
      )}
    </div>
  );
}
