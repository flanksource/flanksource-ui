import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { ComponentNamesDropdown } from "../../../Dropdown/ComponentNamesDropdown";
import { ConfigTypesDropdown } from "../../ConfigsListFilters/ConfigTypesDropdown";
import ConfigInsightsAnalyzerDropdown from "./ConfigInsightsAnalyzerDropdown";
import ConfigInsightsSeverityDropdown from "./ConfigInsightsSeverityDropdown";
import ConfigInsightsTypeDropdown from "./ConfigInsightsTypeDropdown";

type ConfigInsightsFiltersProps = {
  paramsToReset?: string[];
};

export function ConfigInsightsFilters({
  paramsToReset = ["pageIndex", "pageSize"]
}: ConfigInsightsFiltersProps) {
  const [params, setParams] = useSearchParams();

  const severityURL = params.get("severity");
  const typeURL = params.get("type");
  const analyzerURL = params.get("analyzer");
  const componentID = params.get("component");

  const { control, watch } = useForm({
    defaultValues: {
      severity: severityURL ?? "all",
      type: typeURL ?? "all",
      analyzer: analyzerURL ?? "all",
      component: componentID ?? "all"
    }
  });

  const { severity, type, analyzer, component } = watch();

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
      paramsToReset.forEach((param) => params.delete(param));
      setParams(params, {
        replace: true
      });
    });

    return () => subscribe.unsubscribe();
  }, [watch, params, setParams, paramsToReset]);

  return (
    <div className="flex flex-row gap-4 mr-4">
      <div className="flex items-center">
        <div className="flex flex-row gap-2 items-center">
          <ConfigTypesDropdown
            label="Config Type:"
            paramsToReset={paramsToReset}
          />
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
          <ConfigInsightsAnalyzerDropdown
            prefix="Analyzer:"
            name="analyzer"
            value={analyzer}
            className="w-auto max-w-[400px] mr-2 flex-shrink-0"
            dropDownClassNames="w-auto max-w-[400px] left-0"
            control={control}
            hideControlBorder
            showAllOption
          />
          <ComponentNamesDropdown
            prefix="Component:"
            name="component"
            value={component}
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
