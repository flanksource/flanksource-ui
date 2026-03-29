import FormikFilterForm from "@flanksource-ui/components/Forms/FormikFilterForm";
import { useConfigInsightsFilterOptions } from "@flanksource-ui/api/query-hooks/useConfigInsightsFilterOptions";
import ConfigInsightsAnalyzerDropdown from "./ConfigInsightsAnalyzerDropdown";
import ConfigInsightsCatalogDropdown from "./ConfigInsightsCatalogDropdown";
import ConfigInsightsConfigTypesDropdown from "./ConfigInsightsConfigTypesDropdown";
import ConfigInsightsSeverityDropdown from "./ConfigInsightsSeverityDropdown";
import ConfigInsightsSourceDropdown from "./ConfigInsightsSourceDropdown";
import ConfigInsightsStatusDropdown from "./ConfigInsightsStatusDropdown";
import ConfigInsightsTypeDropdown from "./ConfigInsightsTypeDropdown";

type ConfigInsightsFiltersProps = {
  paramsToReset?: string[];
  /**
   * When provided (config details page), filter options are scoped to that
   * config's analysis rows and the Catalog dropdown is hidden.
   */
  configId?: string;
};

export function ConfigInsightsFilters({
  paramsToReset = ["pageIndex"],
  configId
}: ConfigInsightsFiltersProps) {
  const { data: filterOptions, isLoading } =
    useConfigInsightsFilterOptions(configId);

  return (
    <FormikFilterForm
      paramsToReset={paramsToReset}
      filterFields={[
        "type",
        "severity",
        "status",
        "source",
        "analyzer",
        "configType",
        "catalogId"
      ]}
      defaultFieldValues={{ status: "open" }}
    >
      <div className="flex flex-wrap items-center gap-2 pb-2">
        {/* Catalog filter is only relevant on the global insights page */}
        {!configId && (
          <ConfigInsightsCatalogDropdown
            name="catalogId"
            label="Catalog"
            options={filterOptions?.catalogs}
            isLoading={isLoading}
          />
        )}
        <ConfigInsightsConfigTypesDropdown
          name="configType"
          label="Config Type"
          options={filterOptions?.config_types}
          isLoading={isLoading}
        />
        <ConfigInsightsTypeDropdown
          name="type"
          label="Type"
          options={filterOptions?.types}
          isLoading={isLoading}
        />
        <ConfigInsightsSeverityDropdown name="severity" label="Severity" />
        <ConfigInsightsStatusDropdown name="status" label="Status" />
        <ConfigInsightsSourceDropdown
          name="source"
          label="Source"
          options={filterOptions?.sources}
          isLoading={isLoading}
        />
        <ConfigInsightsAnalyzerDropdown
          name="analyzer"
          label="Analyzer"
          options={filterOptions?.analyzers}
          isLoading={isLoading}
        />
      </div>
    </FormikFilterForm>
  );
}
