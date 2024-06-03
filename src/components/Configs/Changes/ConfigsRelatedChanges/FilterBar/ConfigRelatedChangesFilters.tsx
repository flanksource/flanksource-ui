import FormikFilterForm from "@flanksource-ui/components/Forms/FormikFilterForm";
import clsx from "clsx";
import { ChangesTypesDropdown } from "../../ConfigChangesFilters/ChangeTypesDropdown";
import { ConfigChangeSeverity } from "../../ConfigChangesFilters/ConfigChangeSeverity";
import ConfigChangesDateRangeFilter from "../../ConfigChangesFilters/ConfigChangesDateRangeFIlter";
import { ConfigRelatedChangesToggles } from "../../ConfigChangesFilters/ConfigRelatedChangesToggles";
import { ConfigTagsDropdown } from "../../ConfigChangesFilters/ConfigTagsDropdown";
import ConfigTypesTristateDropdown from "../../ConfigChangesFilters/ConfigTypesTristateDropdown";
import { ConfigChangesToggledDeletedItems } from "./ConfigChangesToggledDeletedItems";

type ConfigChangeFiltersProps = {
  className?: string;
  paramsToReset?: string[];
};

export function ConfigRelatedChangesFilters({
  className,
  paramsToReset = []
}: ConfigChangeFiltersProps) {
  return (
    <FormikFilterForm
      paramsToReset={paramsToReset}
      filterFields={["configTypes", "changeType", "severity"]}
    >
      <div className={clsx("flex flex-row gap-2 items-center", className)}>
        <ConfigTypesTristateDropdown />
        <ChangesTypesDropdown />
        <ConfigChangeSeverity />
        <ConfigTagsDropdown />
        <ConfigRelatedChangesToggles />
        <ConfigChangesDateRangeFilter paramsToReset={paramsToReset} />
        <ConfigChangesToggledDeletedItems />
      </div>
    </FormikFilterForm>
  );
}
