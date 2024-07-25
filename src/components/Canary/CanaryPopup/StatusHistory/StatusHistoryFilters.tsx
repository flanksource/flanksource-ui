import { useState } from "react";
import { ReactSelectDropdown } from "../../../ReactSelectDropdown";

const statuses = {
  Healthy: {
    id: "Healthy",
    name: "Healthy",
    description: "Healthy",
    value: "Healthy"
  },
  Unhealthy: {
    id: "Unhealthy",
    name: "Unhealthy",
    description: "Unhealthy",
    value: "Unhealthy"
  },
  All: {
    id: "All",
    name: "All",
    description: "All",
    value: "All"
  }
};

const createDurationOption = (label: string) => {
  return {
    id: label,
    name: label,
    description: label,
    value: label
  };
};

const durations = [
  createDurationOption("All"),
  createDurationOption("100ms"),
  createDurationOption("500ms"),
  createDurationOption("1s"),
  createDurationOption("5s"),
  createDurationOption("10s"),
  createDurationOption("30s")
];

type StatusHistoryFiltersProps = React.HTMLProps<HTMLDivElement> & {
  onFiltersChanges?: ({
    status,
    duration
  }: {
    status: string | undefined;
    duration: string | undefined;
  }) => void;
};

export function StatusHistoryFilters(props: StatusHistoryFiltersProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [selectedDuration, setSelectedDuration] = useState<string>("All");

  return (
    <div className="flex flex-row space-x-4 py-2">
      <ReactSelectDropdown
        items={statuses}
        name="status"
        onChange={(value) => {
          setSelectedStatus(value as string);
          props.onFiltersChanges?.({
            duration: selectedDuration,
            status: value
          });
        }}
        value={selectedStatus}
        className="w-auto max-w-[38rem]"
        dropDownClassNames="w-auto max-w-[38rem] left-0"
        hideControlBorder
        prefix={
          <div className="mr-2 whitespace-nowrap text-xs text-gray-500">
            Status:
          </div>
        }
      />

      <ReactSelectDropdown
        items={durations}
        name="duration"
        onChange={(value) => {
          setSelectedDuration(value as string);
          props.onFiltersChanges?.({
            duration: value,
            status: selectedStatus
          });
        }}
        value={selectedDuration}
        className="w-auto max-w-[38rem]"
        dropDownClassNames="w-auto max-w-[38rem] left-0"
        hideControlBorder
        prefix={
          <div className="mr-2 whitespace-nowrap text-xs text-gray-500">
            Duration:
          </div>
        }
        isCreatable
      />
    </div>
  );
}
