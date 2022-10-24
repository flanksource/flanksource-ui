import { useQuery } from "@tanstack/react-query";
import { Control } from "react-hook-form";
import { getTopologyComponents } from "../../api/services/topology";
import { Icon } from "../Icon";
import { ReactSelectDropdown } from "../ReactSelectDropdown";

const defaultSelections = {
  all: {
    description: "All",
    value: "all",
    order: -1
  }
};

type Props = {
  control: Control<any, any>;
  value?: string;
};

export default function FilterIncidentsByComponents({ control, value }: Props) {
  const { isLoading, data } = useQuery(["components", "list"], async () => {
    const { data } = await getTopologyComponents();
    const components = (data as Record<string, string>[]).map((component) => {
      return {
        value: component.id,
        name: component.name,
        icon: <Icon name={component.name} icon={component.icon} />,
        label: component.name,
        description: component.description ?? component.name
      };
    });
    return components;
  });

  if (isLoading) {
    return (
      <div className="flex items-center">
        <div className="mr-3 text-gray-500 text-sm">Type</div>
        <div className="animate-pulse flex-1 h-6 bg-gray-200"> </div>
      </div>
    );
  }

  return (
    <div className="flex items-center">
      <div className="mr-3 text-gray-500 text-sm">Component</div>
      <ReactSelectDropdown
        control={control}
        label=""
        name="component"
        className="w-56"
        value={value}
        // @ts-expect-error
        items={{ ...defaultSelections, ...data }}
      />
    </div>
  );
}
