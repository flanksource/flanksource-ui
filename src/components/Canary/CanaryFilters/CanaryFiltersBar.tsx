import { HealthCheck } from "@flanksource-ui/api/types/health";
import { GroupByDropdown } from "@flanksource-ui/components/Dropdown/GroupByDropdown";
import { TabByDropdown } from "@flanksource-ui/components/Dropdown/TabByDropdown";
import { defaultTabSelections } from "@flanksource-ui/components/Dropdown/lib/lists";
import { debounce } from "lodash";
import { useSearchParams } from "react-router-dom";
import { CanarySearchBar } from "../CanarySearchBar";
import { DropdownWrapper } from "./DropdownWrapper";

type CanaryFiltersBarProps = {
  checks?: HealthCheck[];
};

export default function CanaryFiltersBar({ checks }: CanaryFiltersBarProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSearch = debounce((value) => {
    searchParams.set("query", value);
    setSearchParams(searchParams);
  }, 400);

  return (
    <>
      <div className="flex flex-col flex-1">
        <CanarySearchBar
          onChange={(e) => handleSearch(e.target.value)}
          onSubmit={(value) => handleSearch(value)}
          onClear={() => handleSearch("")}
          style={{ maxWidth: "480px", width: "100%" }}
          inputClassName="w-full py-2 mr-2 mb-px"
          inputOuterClassName="w-full"
          placeholder="Search by name, description, or endpoint"
          defaultValue={searchParams.get("query") ?? ""}
        />
      </div>

      <DropdownWrapper
        dropdownElem={<GroupByDropdown name="groupBy" />}
        name="groupBy"
        checks={checks ?? []}
        defaultValue="canary_name"
        paramKey="groupBy"
        className="lg:w-64"
        prefix={
          <div className="text-xs text-gray-500 mr-2 whitespace-nowrap">
            Group By:
          </div>
        }
      />

      <DropdownWrapper
        dropdownElem={<TabByDropdown name="tabBy" />}
        defaultValue={defaultTabSelections.namespace.value}
        name="tabBy"
        paramKey="tabBy"
        checks={checks ?? []}
        className="lg:w-64"
        prefix={
          <div className="text-xs text-gray-500 mr-2 whitespace-nowrap">
            Tab By:
          </div>
        }
      />
    </>
  );
}
