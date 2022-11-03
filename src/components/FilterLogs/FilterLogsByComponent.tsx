import { useQuery } from "@tanstack/react-query";
import React, { useMemo } from "react";
import { MdOutlineError } from "react-icons/md";
import { useSearchParams } from "react-router-dom";
import { TopologyComponentItem } from "../FilterIncidents/FilterIncidentsByComponents";
import { Icon } from "../Icon";
import { ReactSelectDropdown, StateOption } from "../ReactSelectDropdown";

export const defaultSelections = {
  all: {
    description: "All",
    value: "all",
    order: -1
  }
};

function FilterLogsByComponent() {
  const [searchParams, setSearchParams] = useSearchParams();

  const topologyId = searchParams.get("topologyId");

  const { isLoading, data, error } = useQuery(
    ["components", "names", "list"],
    async () => {
      const res = await fetch(`/api/canary/db/component_names`);
      const data = (await res.json()) as TopologyComponentItem[];
      return data;
    }
  );

  const dropDownOptions = useMemo(() => {
    if (data) {
      return data.map((component) => {
        return {
          value: component.id,
          icon: (
            <Icon name={component.icon} secondary={component.name} size="xl" />
          ),
          label: component.name,
          description: component.name
        } as StateOption;
      });
    }
  }, [data]);

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

  function onComponentSelect(value?: string) {
    console.log(value);
    const selectedComponent = data?.find((c) => c.id === value);
    if (selectedComponent) {
      setSearchParams({
        ...Object.fromEntries(searchParams),
        ...(selectedComponent.id && {
          topologyId: selectedComponent.id
        }),
        ...(selectedComponent.external_id && {
          topologyExternalId: selectedComponent.external_id
        }),
        ...(selectedComponent.type && { type: selectedComponent.type })
      });
    }
  }

  return (
    <div className="flex flex-row items-center space-x-3">
      <ReactSelectDropdown
        onChange={onComponentSelect}
        prefix="Component:"
        name="component"
        className="w-auto max-w-[400px] capitalize"
        value={topologyId ?? undefined}
        // @ts-expect-error
        items={{ ...defaultSelections, ...dropDownOptions }}
        dropDownClassNames="w-auto max-w-[400px] left-0"
        hideControlBorder
      />
    </div>
  );
}

export default React.memo(FilterLogsByComponent);
