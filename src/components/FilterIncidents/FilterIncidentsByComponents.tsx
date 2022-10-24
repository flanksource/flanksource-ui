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
        icon: (
          <Icon name={component.icon} secondary={component.name} size="xl" />
        ),
        label: component.name,
        description: component.description ?? component.name
      };
    });
    return components;
  });

  if (isLoading && !data) {
    return (
      <div className="flex space-x-3 items-center animate-pulse">
        <div className="text-gray-500 text-sm">Component</div>
        <div className="animate-pulse flex-1 w-56 h-8 bg-gray-200 rounded-sm"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-row items-center space-x-3">
      <div className="text-gray-500 text-sm">Component</div>
      <ReactSelectDropdown
        control={control}
        label=""
        name="component"
        className="w-56 capitalize"
        value={value}
        // @ts-expect-error
        items={{ ...defaultSelections, ...data }}
      />
    </div>
  );
}
