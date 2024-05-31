import FormikFilterSelectDropdown from "@flanksource-ui/components/Forms/Formik/FormikFilterSelectDropdown";
import { StateOption } from "../../ReactSelectDropdown";

type ComponentTypesDropdownProps = {
  className?: string;
  topologyTypes: StateOption[];
  name: string;
  prefix?: string;
};

/**
 *
 * ComponentTypesDropdown
 *
 * A formik dropdown component for selecting component types, needs to be used inside a
 * formik form and [FormikFilterFilter](@flanksource-ui/components/Forms/FormikFilterForm.tsx) component, to sync the value with url
 * params and formik state.
 *
 */
export function ComponentTypesDropdown({
  name,
  className,
  topologyTypes,
  prefix = "Type"
}: ComponentTypesDropdownProps) {
  return (
    <div className={className}>
      <FormikFilterSelectDropdown
        name={name}
        defaultValue="All"
        label=""
        items={topologyTypes}
        className="inline-block p-3 w-auto max-w-[500px]"
        dropDownClassNames="w-auto max-w-[400px] left-0"
        prefix={
          <div className="text-xs text-gray-500 mr-2 whitespace-nowrap">
            {prefix}:
          </div>
        }
      />
    </div>
  );
}
