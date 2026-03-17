import {
  GroupByOptions,
  MultiSelectDropdown
} from "@flanksource-ui/ui/Dropdowns/MultiSelectDropdown";
import { useNavigate } from "react-router-dom";

const groupByOptions: GroupByOptions[] = [
  { label: "None", value: "" },
  { label: "User", value: "user" },
  { label: "Catalog", value: "config" }
];

type ConfigAccessGroupByDropdownProps = {
  effectiveGroupBy: string;
};

export function ConfigAccessGroupByDropdown({
  effectiveGroupBy
}: ConfigAccessGroupByDropdownProps) {
  const navigate = useNavigate();

  const value =
    groupByOptions.find((option) => option.value === effectiveGroupBy) ??
    groupByOptions[0];

  return (
    <MultiSelectDropdown
      options={groupByOptions}
      value={value}
      isMulti={false}
      isClearable={false}
      closeMenuOnSelect
      onChange={(selected) => {
        const option = selected as GroupByOptions | null;
        if (option?.value) {
          navigate(`/catalog/access?groupBy=${option.value}`);
        } else {
          navigate(`/catalog/access?groupBy=none`);
        }
      }}
      label="Group By"
      className="w-44"
      minMenuWidth="180px"
      defaultValue="None"
    />
  );
}
