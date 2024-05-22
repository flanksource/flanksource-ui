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
  paramsToReset = ["pageIndex", "pageSize"]
}: ConfigInsightsFiltersProps) {
  return (
    <FormikFilterForm
      paramsToReset={paramsToReset}
      filterFields={["type", "severity", "analyzer", "component"]}
    >
      <div className="flex flex-row gap-4 mr-4">
        <div className="flex items-center">
          <div className="flex flex-row gap-2 items-center">
            <ConfigTypesDropdown label="Config Type:" />
            <ConfigInsightsTypeDropdown
              name="type"
              className="w-auto max-w-[400px] mr-2 flex-shrink-0"
              dropDownClassNames="w-auto max-w-[400px] left-0"
              hideControlBorder
              showAllOption
            />
            <ConfigInsightsSeverityDropdown
              prefix="Severity:"
              name="severity"
              className="w-auto max-w-[400px] mr-2 flex-shrink-0"
              dropDownClassNames="w-auto max-w-[400px] left-0"
              hideControlBorder
              showAllOption
            />
            <ConfigInsightsAnalyzerDropdown
              prefix="Analyzer:"
              name="analyzer"
              className="w-auto max-w-[400px] mr-2 flex-shrink-0"
              dropDownClassNames="w-auto max-w-[400px] left-0"
              hideControlBorder
              showAllOption
            />
            <ComponentNamesDropdown
              prefix="Component:"
              name="component"
              className="w-auto max-w-[400px] mr-2 flex-shrink-0"
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
