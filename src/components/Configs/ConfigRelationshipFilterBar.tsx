import { ConfigListToggledDeletedItems } from "./ConfigListToggledDeletedItems/ConfigListToggledDeletedItems";
import { ConfigRelationshipDropdown } from "./ConfigRelationshipDropdown";
import { ConfigTagsDropdown } from "./ConfigsListFilters/ConfigTagsDropdown";
import { ConfigTypesDropdown } from "./ConfigsListFilters/ConfigTypesDropdown";

export default function ConfigRelationshipFilterBar() {
  return (
    <div className="flex flex-row items-center gap-2">
      <ConfigTypesDropdown />
      <ConfigTagsDropdown />
      <ConfigRelationshipDropdown />
      <ConfigListToggledDeletedItems />
    </div>
  );
}
