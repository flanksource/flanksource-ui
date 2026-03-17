import { CatalogAccessMode } from "@flanksource-ui/hooks/useCatalogAccessUrlState";
import {
  GroupByOptions,
  MultiSelectDropdown
} from "@flanksource-ui/ui/Dropdowns/MultiSelectDropdown";

const groupByOptions: (GroupByOptions & { value: CatalogAccessMode })[] = [
  { label: "None", value: "flat" },
  { label: "User", value: "group-user" },
  { label: "Catalog", value: "group-config" }
];

type ConfigAccessGroupByDropdownProps = {
  mode: CatalogAccessMode;
  onChange: (mode: CatalogAccessMode) => void;
};

export function ConfigAccessGroupByDropdown({
  mode,
  onChange
}: ConfigAccessGroupByDropdownProps) {
  const value =
    groupByOptions.find((option) => option.value === mode) ?? groupByOptions[0];

  return (
    <MultiSelectDropdown
      options={groupByOptions}
      value={value}
      isMulti={false}
      isClearable={false}
      closeMenuOnSelect
      onChange={(selected) => {
        const option = selected as GroupByOptions | null;
        onChange((option?.value as CatalogAccessMode) ?? "flat");
      }}
      label="Group By"
      className="w-44"
      minMenuWidth="180px"
      defaultValue="None"
    />
  );
}
