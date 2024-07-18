import { debounce } from "lodash";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { useIncidentPageContext } from "../../../context/IncidentPageContext";
import { TextInputClearable } from "../../../ui/FormControls/TextInputClearable";
import IncidentSeverityDropdown from "../IncidentSeverityDropdown";
import IncidentStatusDropdown from "../IncidentStatusDropdown";
import IncidentTypeDropdown from "../IncidentTypeDropdown";
import { defaultSelections } from "../data";
import FilterIncidentsByComponents from "./FilterIncidentsByComponents";
import FilterIncidentsByOwner from "./FilterIncidentsByOwner";

const removeNullValues = (obj: Record<string, string>) =>
  Object.fromEntries(
    Object.entries(obj).filter(
      ([_k, v]) => v !== null && v !== undefined && v !== ""
    )
  );

export default function FilterIncidents() {
  const [searchParams, setSearchParams] = useSearchParams({
    status: "open"
  });
  const defaultValues = {
    severity:
      searchParams.get("severity") || Object.values(defaultSelections)[0].value,
    status:
      searchParams.get("status") || Object.values(defaultSelections)[0].value,
    owner:
      searchParams.get("owner") || Object.values(defaultSelections)[0].value,
    type: searchParams.get("type") || Object.values(defaultSelections)[0].value,
    component:
      searchParams.get("component") ||
      Object.values(defaultSelections)[0].value,
    search: searchParams.get("search") || ""
  };
  const { control, watch, setValue } = useForm({
    defaultValues
  });

  const {
    incidentState: { ownerSelections }
  } = useIncidentPageContext();

  const watchSeverity = watch("severity");
  const watchStatus = watch("status");
  const watchOwner = watch("owner");
  const watchType = watch("type");
  const watchComponent = watch("component");
  const watchSearch = watch("search");

  useEffect(() => {
    const formChanges = watch((values) => {
      const params = removeNullValues(values);
      setSearchParams(params, {
        replace: true
      });
    });

    return () => formChanges.unsubscribe();
  }, [setSearchParams, watch]);

  const handleSearch = debounce((e) => {
    const query = e.target.value || "";
    setValue("search", query);
  }, 400);

  return (
    <div className="flex w-full flex-none flex-col">
      <div className="flex flex-row flex-wrap gap-2.5 border-b border-gray-200 py-4">
        <div className="mr-2 flex items-center space-x-3">
          <IncidentTypeDropdown
            value={watchType}
            control={control}
            prefix="Type:"
            name="type"
            className="w-auto max-w-[400px]"
            dropDownClassNames="w-auto max-w-[400px]"
            hideControlBorder
            showAllOption
          />
        </div>

        <div className="mr-2 flex items-center space-x-3">
          <IncidentSeverityDropdown
            prefix="Severity:"
            name="severity"
            className="w-auto max-w-[400px] flex-shrink-0"
            dropDownClassNames="w-auto max-w-[400px]"
            control={control}
            value={watchSeverity}
            hideControlBorder
            showAllOption
          />
        </div>

        <div className="mr-2 flex items-center space-x-3">
          <IncidentStatusDropdown
            prefix="Status:"
            name="status"
            className="w-auto max-w-[400px] flex-shrink-0"
            dropDownClassNames="w-auto max-w-[400px]"
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

        <div className="flex flex-row items-center space-x-3">
          <TextInputClearable
            onChange={handleSearch}
            className="mr-2 h-[37.6px] w-48 md:w-64"
            placeholder="Search for incident"
            defaultValue={watchSearch}
          />
        </div>
      </div>
    </div>
  );
}
