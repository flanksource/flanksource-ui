import React from "react";
import FormikFilterForm from "@flanksource-ui/components/Forms/FormikFilterForm";
import FormikSearchInputClearable from "@flanksource-ui/components/Forms/Formik/FormikSearchInputClearable";
import ConfigGroupByDropdown from "@flanksource-ui/components/Configs/ConfigsListFilters/ConfigGroupByDropdown";
import { ConfigHealthyDropdown } from "@flanksource-ui/components/Configs/ConfigsListFilters/ConfigHealthyDropdown";
import { ConfigLabelsDropdown } from "@flanksource-ui/components/Configs/ConfigsListFilters/ConfigLabelsDropdown";
import { ConfigStatusDropdown } from "@flanksource-ui/components/Configs/ConfigsListFilters/ConfigStatusDropdown";
import { ConfigTypesDropdown } from "@flanksource-ui/components/Configs/ConfigsListFilters/ConfigTypesDropdown";

interface ConfigsUIFiltersProps {
  paramPrefix?: string;
}

/**
 * ConfigsUIFilters - Filter component for Configs UI.
 *
 * Preset filters are seeded into URL params by ConfigsUISection before this
 * form is rendered.
 */
export function ConfigsUIFilters({ paramPrefix }: ConfigsUIFiltersProps) {
  return (
    <FormikFilterForm
      paramsToReset={["tags", "group_by"]}
      filterFields={[
        "search",
        "configType",
        "labels",
        "status",
        "health",
        "groupBy"
      ]}
      paramPrefix={paramPrefix}
    >
      <div className="mr-4 flex flex-wrap items-center gap-2">
        <ConfigTypesDropdown />

        <ConfigGroupByDropdown paramPrefix={paramPrefix} />

        <ConfigLabelsDropdown />

        <ConfigStatusDropdown />

        <ConfigHealthyDropdown />

        <FormikSearchInputClearable
          name="search"
          placeholder="Search for configs"
          className="w-[250px]"
        />
      </div>
    </FormikFilterForm>
  );
}

export default ConfigsUIFilters;
