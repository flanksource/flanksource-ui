import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { FaFilter } from "react-icons/fa";
import { incidentStatusItems, typeItems } from "../Incidents/data";
import IncidentStatusDropdown from "../Incidents/IncidentStatusDropdown";
import IncidentTypeDropdown from "../Incidents/IncidentTypeDropdown";

export type IncidentFilter = {
  type: "all" | keyof typeof typeItems;
  status: "all" | `${keyof typeof incidentStatusItems}`;
  age: number;
};

type Props = {
  onChangeFilterValues: (filterValues: IncidentFilter) => void;
  defaultValues: IncidentFilter;
};

export default function TopologyOpenIncidentsFilterBar({
  defaultValues,
  onChangeFilterValues
}: Props) {
  const { control, watch } = useForm<IncidentFilter>({
    mode: "onBlur",
    defaultValues: {
      ...defaultValues
    }
  });

  const { status, type } = watch();

  useEffect(() => {
    const formChanges = watch(({ status, type }) => {
      onChangeFilterValues({
        status: status ?? "all",
        type: type ?? "all",
        age: 0
      });
    });

    return () => formChanges.unsubscribe();
  }, [onChangeFilterValues, watch]);

  return (
    <div
      className="flex flex-row items-center justify-center"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <div className="px-2">
        <FaFilter className="text-gray-500 w-4 inline-block object-center" />
      </div>

      <IncidentTypeDropdown
        name="type"
        control={control}
        prefix={"Type:"}
        showAllOption
        value={type}
      />

      <IncidentStatusDropdown
        control={control}
        value={status}
        prefix={"Status:"}
        showAllOption
      />
    </div>
  );
}
