import FormikFilterForm from "@flanksource-ui/components/Forms/FormikFilterForm";
import ConfigInsightsAnalyzerDropdown from "./ConfigInsightsAnalyzerDropdown";
import ConfigInsightsConfigTypesDropdown from "./ConfigInsightsConfigTypesDropdown";
import ConfigInsightsSeverityDropdown from "./ConfigInsightsSeverityDropdown";
import ConfigInsightsSourceDropdown from "./ConfigInsightsSourceDropdown";
import ConfigInsightsStatusDropdown from "./ConfigInsightsStatusDropdown";
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
      filterFields={[
        "type",
        "severity",
        "status",
        "source",
        "analyzer",
        "configType"
      ]}
    >
      <div className="flex flex-wrap items-center gap-2 pb-2">
        <ConfigInsightsConfigTypesDropdown
          name="configType"
          label="Config Type"
        />
        <ConfigInsightsTypeDropdown name="type" label="Type" />
        <ConfigInsightsSeverityDropdown name="severity" label="Severity" />
        <ConfigInsightsStatusDropdown name="status" label="Status" />
        <ConfigInsightsSourceDropdown name="source" label="Source" />
        <ConfigInsightsAnalyzerDropdown name="analyzer" label="Analyzer" />
      </div>
    </FormikFilterForm>
  );
}
