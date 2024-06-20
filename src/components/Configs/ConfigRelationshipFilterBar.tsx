import FormikFilterForm from "../Forms/FormikFilterForm";
import ConfigTypesTristateDropdown from "./Changes/ConfigChangesFilters/ConfigTypesTristateDropdown";
import { ConfigRelationshipToggles } from "./Changes/ConfigsRelatedChanges/FilterBar/ConfigRelationshipToggles";
import { ConfigListToggledDeletedItems } from "./ConfigListToggledDeletedItems/ConfigListToggledDeletedItems";
import ConfigGraphTableToggle from "./ConfigsListFilters/ConfigGraphTableToggle";
import { ConfigLabelsDropdown } from "./ConfigsListFilters/ConfigLabelsDropdown";
import { ConfigTypesDropdown } from "./ConfigsListFilters/ConfigTypesDropdown";

type ConfigRelationshipFilterBarProps = {
  isGraphView: boolean;
};

export default function ConfigRelationshipFilterBar({
  isGraphView
}: ConfigRelationshipFilterBarProps) {
  return (
    <FormikFilterForm
      paramsToReset={[]}
      filterFields={["configTypes", "labels", "relationship"]}
    >
      <div className="flex flex-row items-center gap-1">
        {isGraphView ? (
          <ConfigTypesTristateDropdown />
        ) : (
          <ConfigTypesDropdown />
        )}
        <ConfigLabelsDropdown />
        <ConfigRelationshipToggles />
        <ConfigListToggledDeletedItems />
        <div className="flex-1" />
        <ConfigGraphTableToggle />
      </div>
    </FormikFilterForm>
  );
}
