import React from "react";
import { MutationFunction } from "react-query";
import { Hypothesis, HypothesisStatus } from "../../../api/services/hypothesis";
import useHypothesisStatusForm from "../../../hooks/useHypothesisStatusForm";
import { SubtleDropdown } from "../../Dropdown/SubtleDropdown";
import { hypothesisStatuses } from "../../HypothesisBuilder/data";

const statusItems = Object.fromEntries(
  Object.values(hypothesisStatuses).map((x) => [
    x.value,
    {
      id: `dropdown-${x.value}`,
      name: x.title,
      iconTitle: React.createElement(x.icon.type, {
        className: "drop-shadow",
        color: x.color,
        style: { width: "24px" }
      }),
      icon: React.createElement(x.icon.type, {
        color: x.color,
        style: { width: "20px" }
      }),
      description: x.title,
      value: x.value
    }
  ])
);

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
    status: status || statusItems[HypothesisStatus.Likely].value,
    updateMutation,
    id: nodeId
  });

  return (
    <SubtleDropdown
      className="-ml-2"
      control={control}
      name="status"
      items={statusItems}
    />
  );
}
