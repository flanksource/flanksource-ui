import { debounce } from "lodash";
import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { HypothesisStatus } from "../../../api/services/hypothesis";
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

export function StatusDropdownContainer({ nodeId, status, updateMutation }) {
  const { control, watch, getValues } = useForm({
    defaultValues: {
      status: status || statusItems[HypothesisStatus.Likely].value
    }
  });

  watch();

  const handleApiUpdate = useMemo(
    () =>
      debounce(({ status }) => {
        if (updateMutation && nodeId) {
          updateMutation.mutate({ id: nodeId, params: { status } });
        }
      }, 200),
    [updateMutation, nodeId]
  );

  useEffect(() => {
    const subscription = watch(handleApiUpdate);
    return () => subscription.unsubscribe();
  }, [watch, getValues, handleApiUpdate]);

  return (
    <SubtleDropdown
      className="-ml-2"
      control={control}
      name="status"
      items={statusItems}
    />
  );
}
