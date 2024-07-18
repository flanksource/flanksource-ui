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
    <div className="flex w-full flex-col gap-2">
      <FormikFilterForm filterFields={["query"]} paramsToReset={[]}>
        <div className="flex w-full flex-row items-center gap-2">
          <div className="flex flex-1 flex-col">
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
              <div className="mr-2 whitespace-nowrap text-xs text-gray-500">
                Group By:
              </div>
            }
          />

          <ChecksTabByDropdown
            checks={checks}
            name="tabBy"
            prefix={
              <div className="mr-2 whitespace-nowrap text-xs text-gray-500">
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
