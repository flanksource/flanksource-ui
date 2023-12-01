import { TupleToUnion } from "type-fest";
import AddTopologyOptionsList, {
  createTopologyOptions
} from "./StepsForms/AddTopologyOptionsList";
import { useState } from "react";
import TopologyResourceForm from "./StepsForms/TopologyResourceForm";

type AddTopologyResourceProps = {
  onSuccess: () => void;
  isModal?: boolean;
};

export default function AddTopologyResource({
  onSuccess,
  isModal = false
}: AddTopologyResourceProps) {
  const [selectedOption, setSelectedOption] = useState<
    TupleToUnion<typeof createTopologyOptions> | undefined
  >();

  return (
    <div className="flex flex-col">
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
