import { useMemo } from "react";
import { Control } from "react-hook-form";
import { useComponentsQuery } from "../../../api/query-hooks";
import { TopologyComponentItem } from "../../FilterIncidents/FilterIncidentsByComponents";
import { Icon } from "../../Icon";
import { defaultSelections } from "../../Incidents/data";
import { ReactSelectDropdown, StateOption } from "../../ReactSelectDropdown";

type Props = React.HTMLProps<HTMLDivElement> & {
  control?: Control<any, any>;
  value?: string;
  prefix?: string;
  dropDownClassNames?: string;
  hideControlBorder?: boolean;
  showAllOption?: boolean;
};

export function ComponentNamesDropdown({
  control,
  value,
  prefix = "Component:",
  name = "component",
  className,
  showAllOption,
  dropDownClassNames,
  hideControlBorder
}: Props) {
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
      control={control}
      prefix={prefix}
      name={name}
      className={className}
      dropDownClassNames={dropDownClassNames}
      value={value}
      isLoading={isLoading}
      items={[...(showAllOption ? [defaultSelections.all] : []), ...options]}
      hideControlBorder={hideControlBorder}
    />
  );
}
