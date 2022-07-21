import React from "react";
import { MutationFunction } from "@tanstack/react-query";
import { Hypothesis, HypothesisStatus } from "../../../api/services/hypothesis";
import useHypothesisStatusForm from "../../../hooks/useHypothesisStatusForm";
import { SubtleDropdown } from "../../Dropdown/SubtleDropdown";
import { hypothesisStatusDropdownOptions } from "../../../constants/hypothesisStatusOptions";

interface Props {
  nodeId: string;
  status: HypothesisStatus;
  updateMutation: MutationFunction<Hypothesis, { status: HypothesisStatus }>;
}

export function StatusDropdownContainer({
  nodeId,
  status,
  updateMutation
}: Props) {
  const { control } = useHypothesisStatusForm({
    status: status || HypothesisStatus.Likely,
    updateMutation,
    id: nodeId
  });

  return (
    <SubtleDropdown
      className="bg-white m-1 rounded-full"
      control={control}
      name="status"
      items={hypothesisStatusDropdownOptions}
    />
  );
}
