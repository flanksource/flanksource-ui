import { useField } from "formik";
import { useMemo } from "react";
import { useComponentsQuery } from "../../../api/query-hooks";
import { Icon } from "../../../ui/Icons/Icon";
import { TopologyComponentItem } from "../../Incidents/FilterIncidents/FilterIncidentsByComponents";
import { defaultSelections } from "../../Incidents/data";
import { ReactSelectDropdown, StateOption } from "../../ReactSelectDropdown";

type Props = React.HTMLProps<HTMLDivElement> & {
  prefix?: string;
  dropDownClassNames?: string;
  hideControlBorder?: boolean;
  showAllOption?: boolean;
};

/**
 *
 * ComponentNamesDropdown
 *
 * A formik dropdown component for selecting component names, needs to be used inside a
 * formik form and [FormikFilterFilter](@flanksource-ui/components/Forms/FormikFilterForm.tsx) component, to sync the value with url
 * params and formik state.
 *
 */
export function ComponentNamesDropdown({
  prefix = "Component",
  name = "component",
  className,
  showAllOption,
  dropDownClassNames,
  hideControlBorder
}: Props) {
  const [field] = useField({
    name
  });

  const { data: components, isLoading } = useComponentsQuery({});

  const options = useMemo(() => {
    if (!components) {
      return [];
    }
    return components
      .filter((item: TopologyComponentItem) => {
        return item.external_id;
      })
      .map((component) => {
        const option: StateOption = {
          label: component.name || "",
          value: component.id || "",
          icon: (
            <Icon
              name={component.icon}
              secondary={component.name}
              className="h-5 w-5"
            />
          )
        };
        return option;
      });
  }, [components]);

  return (
    <ReactSelectDropdown
      onChange={(value) => {
        if (value && value !== "all") {
          field.onChange({
            target: { name, value }
          });
        } else {
          field.onChange({
            target: { name, value: undefined }
          });
        }
      }}
      prefix={<span className="text-gray-500 text-xs">{prefix}:</span>}
      name={name}
      className={className}
      dropDownClassNames={dropDownClassNames}
      value={field.value ?? "all"}
      isLoading={isLoading}
      items={[...(showAllOption ? [defaultSelections.all] : []), ...options]}
      hideControlBorder={hideControlBorder}
    />
  );
}
