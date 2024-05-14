import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useComponentsQuery } from "../../../api/query-hooks";
import { Icon } from "../../Icon";
import { TopologyComponentItem } from "../../Incidents/FilterIncidents/FilterIncidentsByComponents";
import { defaultSelections } from "../../Incidents/data";
import { ReactSelectDropdown, StateOption } from "../../ReactSelectDropdown";

type Props = React.HTMLProps<HTMLDivElement> & {
  prefix?: string;
  dropDownClassNames?: string;
  hideControlBorder?: boolean;
  showAllOption?: boolean;
  paramsToReset?: string[];
};

export function ComponentNamesDropdown({
  prefix = "Component:",
  name = "component",
  className,
  showAllOption,
  dropDownClassNames,
  hideControlBorder,
  paramsToReset = []
}: Props) {
  const [params, setParams] = useSearchParams({
    [name]: "all"
  });

  const value = params.get(name) || "all";

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
        if (value?.toLowerCase() === "all" || !value) {
          params.delete(name);
        } else {
          params.set(name, value);
        }
        paramsToReset.forEach((param) => params.delete(param));
        setParams(params);
      }}
      prefix={<span className="text-gray-500 text-xs">{prefix}</span>}
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
