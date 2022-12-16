import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { useIncidentPageContext } from "../../context/IncidentPageContext";
import FilterIncidentsByComponents from "./FilterIncidentsByComponents";
import FilterIncidentsByOwner from "./FilterIncidentsByOwner";
import { defaultSelections } from "../Incidents/data";
import IncidentTypeDropdown from "../Incidents/IncidentTypeDropdown";
import IncidentSeverityDropdown from "../Incidents/IncidentSeverityDropdown";
import IncidentStatusDropdown from "../Incidents/IncidentStatusDropdown";

const removeNullValues = (obj: Record<string, string>) =>
  Object.fromEntries(
    Object.entries(obj).filter(([_k, v]) => v !== null && v !== undefined)
  );

export default function FilterIncidents() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { control, watch } = useForm({
    defaultValues: {
      severity:
        searchParams.get("severity") ||
        Object.values(defaultSelections)[0].value,
      status:
        searchParams.get("status") || Object.values(defaultSelections)[0].value,
      owner:
        searchParams.get("owner") || Object.values(defaultSelections)[0].value,
      type:
        searchParams.get("type") || Object.values(defaultSelections)[0].value,
      component:
        searchParams.get("component") ||
        Object.values(defaultSelections)[0].value
    }
  });

  const {
    incidentState: { ownerSelections }
  } = useIncidentPageContext();

  const watchSeverity = watch("severity");
  const watchStatus = watch("status");
  const watchOwner = watch("owner");
  const watchType = watch("type");
  const watchComponent = watch("component");

  useEffect(() => {
    const paramsList = {
      severity: watchSeverity,
      status: watchStatus,
      owner: watchOwner,
      type: watchType,
      component: watchComponent
    };
    setSearchParams(removeNullValues(paramsList));
  }, [
    watchSeverity,
    watchStatus,
    watchOwner,
    watchType,
    watchComponent,
    setSearchParams
  ]);

  return (
    <div className="flex flex-col flex-none w-full">
      <div className="flex flex-row space-x-4 border-b py-4 border-gray-200">
        <div className="space-x-3 flex items-center">
          <IncidentTypeDropdown
            value={watchType}
            control={control}
            prefix="Type:"
            name="type"
            className="w-auto max-w-[400px]"
            dropDownClassNames="w-auto max-w-[400px] right-0"
            hideControlBorder
            showAllOption
          />
        </div>

        <div className="flex items-center space-x-3">
          <IncidentSeverityDropdown
            prefix="Severity:"
            name="severity"
            className="w-auto max-w-[400px] mr-2 flex-shrink-0"
            dropDownClassNames="w-auto max-w-[400px] right-0"
            control={control}
            value={watchSeverity}
            hideControlBorder
            showAllOption
          />
        </div>

        <div className="flex items-center space-x-3">
          <IncidentStatusDropdown
            prefix="Status:"
            name="status"
            className="w-auto max-w-[400px] mr-2 flex-shrink-0"
            dropDownClassNames="w-auto max-w-[400px] right-0"
            control={control}
            value={watchStatus}
            hideControlBorder
            showAllOption
          />
        </div>

        <FilterIncidentsByOwner
          control={control}
          value={watchOwner}
          ownerSelections={ownerSelections}
        />

        <FilterIncidentsByComponents control={control} value={watchComponent} />
      </div>
    </div>
  );
}
