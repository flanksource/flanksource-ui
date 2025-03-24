import FormikFilterForm from "../Forms/FormikFilterForm";
import ConfigTypesTristateDropdown from "./Changes/ConfigChangesFilters/ConfigTypesTristateDropdown";
import { ConfigRelationshipToggles } from "./Changes/ConfigsRelatedChanges/FilterBar/ConfigRelationshipToggles";
import ConfigGraphTableToggle from "./ConfigsListFilters/ConfigGraphTableToggle";
import { ConfigHealthyDropdown } from "./ConfigsListFilters/ConfigHealthyDropdown";
import { ConfigLabelsDropdown } from "./ConfigsListFilters/ConfigLabelsDropdown";
import { ConfigStatusDropdown } from "./ConfigsListFilters/ConfigStatusDropdown";

export default function ConfigRelationshipFilterBar() {
  return (
    <FormikFilterForm
      paramsToReset={[]}
      filterFields={[
        "configTypes",
        "labels",
        "relationship",
        "status",
        "health"
      ]}
    >
      <div className="flex flex-wrap items-center gap-1">
        <ConfigTypesTristateDropdown />
        <ConfigLabelsDropdown />
        <ConfigHealthyDropdown />
        <ConfigStatusDropdown />
        <ConfigRelationshipToggles />
        <ConfigGraphTableToggle />
      </div>
    </FormikFilterForm>
  );
}
