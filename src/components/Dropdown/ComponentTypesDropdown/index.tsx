import { useEffect, useState } from "react";
import { useComponentsQuery } from "../../../api/query-hooks";
import { allOption } from "../../../pages/TopologyPage";
import { TopologyComponentItem } from "../../FilterIncidents/FilterIncidentsByComponents";
import { ReactSelectDropdown, StateOption } from "../../ReactSelectDropdown";

type ComponentTypesDropdownProps = React.HTMLProps<HTMLDivElement> & {
  onChange: (val: any) => void;
  value: string | StateOption | undefined;
};

export function ComponentTypesDropdown({
  name = "component-names",
  label,
  className,
  value,
  onChange,
  ...rest
}: ComponentTypesDropdownProps) {
  const [topologyTypes, setTopologyTypes] = useState<any>({});

  const { data: components } = useComponentsQuery({});

  useEffect(() => {
    setupTypesDropdown(components);
  }, [components]);

  function setupTypesDropdown(data?: TopologyComponentItem[]) {
    const allTypes: { [key: string]: any } = {
      ...allOption
    };
    if (!data) {
      setTopologyTypes({ ...allTypes });
      return;
    }
    data.forEach((component: any) => {
      if (component.type) {
        allTypes[component.type] = {
          id: component.type,
          name: component.type,
          description: component.type,
          value: component.type
        };
      }
    });
    setTopologyTypes({ ...allTypes });
  }

  return (
    <div className={className} {...rest}>
      <label className="self-center inline-block pt-2 mr-3 text-sm text-gray-500">
        {`${name}:`}
      </label>
      <ReactSelectDropdown
        label={label}
        name={name}
        value={value}
        items={topologyTypes}
        className="inline-block p-3 w-80 md:w-60"
        onChange={(val: any) => {
          onChange(val);
        }}
      />
    </div>
  );
}
