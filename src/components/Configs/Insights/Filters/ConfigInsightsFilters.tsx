import FormikFilterForm from "@flanksource-ui/components/Forms/FormikFilterForm";
import { ComponentNamesDropdown } from "../../../Topology/Dropdowns/ComponentNamesDropdown";
import { ConfigTypesDropdown } from "../../ConfigsListFilters/ConfigTypesDropdown";
import ConfigInsightsAnalyzerDropdown from "./ConfigInsightsAnalyzerDropdown";
import ConfigInsightsSeverityDropdown from "./ConfigInsightsSeverityDropdown";
import ConfigInsightsTypeDropdown from "./ConfigInsightsTypeDropdown";

type ConfigInsightsFiltersProps = {
  paramsToReset?: string[];
};

export function ConfigInsightsFilters({
  paramsToReset = ["pageIndex"]
}: ConfigInsightsFiltersProps) {
  return (
    <FormikFilterForm
      paramsToReset={paramsToReset}
      filterFields={["type", "severity", "analyzer", "component"]}
    >
      <div className="mr-4 flex flex-row gap-4">
        <div className="flex items-center">
          <div className="flex flex-row items-center gap-2">
            <ConfigTypesDropdown label="Config Type:" />
            <ConfigInsightsTypeDropdown
              name="type"
              className="mr-2 w-auto max-w-[400px] flex-shrink-0"
              dropDownClassNames="w-auto max-w-[400px] left-0"
              hideControlBorder
              showAllOption
            />
            <ConfigInsightsSeverityDropdown
              prefix="Severity:"
              name="severity"
              className="mr-2 w-auto max-w-[400px] flex-shrink-0"
              dropDownClassNames="w-auto max-w-[400px] left-0"
              hideControlBorder
              showAllOption
            />
            <ConfigInsightsAnalyzerDropdown
              prefix="Analyzer:"
              name="analyzer"
              className="mr-2 w-auto max-w-[400px] flex-shrink-0"
              dropDownClassNames="w-auto max-w-[400px] left-0"
              hideControlBorder
              showAllOption
            />
            <ComponentNamesDropdown
              prefix="Component:"
              name="component"
              className="mr-2 w-auto max-w-[400px] flex-shrink-0"
              dropDownClassNames="w-auto max-w-[400px] left-0"
              hideControlBorder
              showAllOption
            />
          </div>
        </div>
      </div>
    </FormikFilterForm>
  );
}
