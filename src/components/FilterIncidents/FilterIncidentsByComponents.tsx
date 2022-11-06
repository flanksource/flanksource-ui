import { useQuery } from "@tanstack/react-query";
import React, { useCallback } from "react";
import { Control } from "react-hook-form";
import { MdOutlineError } from "react-icons/md";
import { Icon } from "../Icon";
import { ReactSelectDropdown } from "../ReactSelectDropdown";

export const defaultSelections = {
  all: {
    description: "All",
    value: "all",
    order: -1
  }
};

export type TopologyComponentItem = {
  created_at?: string;
  external_id?: string;
  icon?: string;
  id?: string;
  name?: string;
  parent_id?: string;
  type?: string;
  updated_at?: string;
};

type Props = {
  control: Control<any, any>;
  value?: string;
};

function FilterIncidentsByComponents({ control, value }: Props) {
  const { isLoading, data, error } = useQuery(
    ["components", "names", "list"],
    async () => {
      const res = await fetch(`/api/canary/db/component_names`);
      const data = (await res.json()) as TopologyComponentItem[];
      return data;
    },
    {
      // use select to transform data, so we can cache the request data as is
      // allowing it to be used in other places
      select: useCallback(
        (data: TopologyComponentItem[]) =>
          data.map((component) => {
            return {
              value: component.id,
              name: component.name,
              icon: (
                <Icon
                  name={component.icon}
                  secondary={component.name}
                  size="xl"
                />
              ),
              label: component.name,
              description: component.name
            };
          }),
        []
      )
    }
  );

  if (isLoading && !data) {
    return (
      <div className="flex space-x-3 items-center animate-pulse">
        <div className="text-gray-500 text-sm">Component</div>
        <div className="animate-pulse flex-1 w-56 h-8 bg-gray-200 rounded-sm"></div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="flex space-x-3 items-center">
        <div className="flex items-center space-x-2 text-red-600">
          <MdOutlineError />
          <span>Unable to load components!</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-row items-center space-x-3">
      <ReactSelectDropdown
        control={control}
        prefix="Component:"
        name="component"
        className="w-auto max-w-[400px] capitalize"
        value={value}
        // @ts-expect-error
        items={{ ...defaultSelections, ...data }}
        dropDownClassNames="w-auto max-w-[400px] right-0"
        hideControlBorder
      />
    </div>
  );
}

export default React.memo(FilterIncidentsByComponents);
