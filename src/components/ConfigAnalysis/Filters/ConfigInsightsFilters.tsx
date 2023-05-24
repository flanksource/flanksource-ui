import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import ConfigInsightsTypeDropdown from "./ConfigInsightsTypeDropdown";
import ConfigInsightsSeverityDropdown from "./ConfigInsightsSeverityDropdown";

export function ConfigInsightsFilters() {
  const [params, setParams] = useSearchParams();

  const severityURL = params.get("severity");
  const typeURL = params.get("type");

  const { control, watch } = useForm({
    defaultValues: {
      severity: severityURL ?? "all",
      type: typeURL ?? "all"
    }
  });

  const { severity, type } = watch();

  useEffect(() => {
    const subscribe = watch((values) => {
      Object.entries(values).forEach(([key, value]) => {
        if (
          value !== null &&
          value !== undefined &&
          value !== "" &&
          value !== "all"
        ) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });
      setParams(params, {
        replace: true
      });
    });

    return () => subscribe.unsubscribe();
  }, [watch, params, setParams]);

  return (
    <div className="flex flex-row space-x-4 py-4 px-2">
      <div className="flex items-center">
        <div className="flex items-center">
          <ConfigInsightsTypeDropdown
            prefix="Type:"
            name="type"
            value={type}
            className="w-auto max-w-[400px] mr-2 flex-shrink-0"
            dropDownClassNames="w-auto max-w-[400px] left-0"
            control={control}
            hideControlBorder
            showAllOption
          />
          <ConfigInsightsSeverityDropdown
            prefix="Severity:"
            name="severity"
            value={severity}
            className="w-auto max-w-[400px] mr-2 flex-shrink-0"
            dropDownClassNames="w-auto max-w-[400px] left-0"
            control={control}
            hideControlBorder
            showAllOption
          />
        </div>
      </div>
    </div>
  );
}
