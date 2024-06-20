import { HealthCheck } from "@flanksource-ui/api/types/health";
import { defaultTabSelections } from "@flanksource-ui/components/Dropdown/lib/lists";
import FormikFilterForm from "@flanksource-ui/components/Forms/FormikFilterForm";
import { CanarySearchField } from "./CanarySearchField";
import { ChecksGroupByDropdown } from "./ChecksGroupByDropdown";
import { ChecksTabByDropdown } from "./ChecksTabByDropdown";

type CanaryFiltersBarProps = {
  checks?: HealthCheck[];
};

export default function CanaryFiltersBar({ checks }: CanaryFiltersBarProps) {
  return (
    <div className="flex flex-col w-full gap-2">
      <FormikFilterForm filterFields={["query"]} paramsToReset={[]}>
        <div className="flex flex-row w-full gap-2 items-center">
          <div className="flex flex-col flex-1">
            <CanarySearchField
              name="query"
              placeholder="Search by name, description, or endpoint"
            />
          </div>

          <ChecksGroupByDropdown
            name="groupBy"
            checks={checks}
            className="lg:w-64"
            defaultValue="canary_name"
            prefix={
              <div className="text-xs text-gray-500 mr-2 whitespace-nowrap">
                Group By:
              </div>
            }
          />

          <ChecksTabByDropdown
            checks={checks}
            name="tabBy"
            prefix={
              <div className="text-xs text-gray-500 mr-2 whitespace-nowrap">
                Tab By:
              </div>
            }
            className="lg:w-64"
            defaultValue={defaultTabSelections.namespace.value}
          />
        </div>
      </FormikFilterForm>
    </div>
  );
}
