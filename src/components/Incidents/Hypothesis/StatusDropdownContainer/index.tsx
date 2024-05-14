import { UseMutationResult } from "@tanstack/react-query";
import { useEffect } from "react";
import { Hypothesis, HypothesisStatus } from "../../../../api/types/hypothesis";
import { hypothesisStatusDropdownOptions } from "../../../../constants/hypothesisStatusOptions";
import useHypothesisStatusForm from "../../../../hooks/useHypothesisStatusForm";
import { SubtleDropdown } from "../../../Dropdown/SubtleDropdown";

interface Props {
  nodeId: string;
  status: HypothesisStatus;
  updateMutation: UseMutationResult<Hypothesis, { status: HypothesisStatus }>;
}

export function StatusDropdownContainer({
  nodeId,
  status,
  updateMutation
}: Props) {
  const { control, setValue } = useHypothesisStatusForm({
    status: status || HypothesisStatus.Likely,
    updateMutation,
    id: nodeId
  });

  useEffect(() => {
    if (!status) {
      return;
    }
    setValue("status", status);
  }, [status, setValue]);

  return (
    <SubtleDropdown
      className="bg-white m-1 rounded-full"
      control={control}
      name="status"
      items={hypothesisStatusDropdownOptions}
    />
  );
}
