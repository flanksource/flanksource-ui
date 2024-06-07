import React, { useMemo } from "react";
import { MdOutlineError } from "react-icons/md";
import { useSearchParams } from "react-router-dom";
import { useComponentsWithLogsQuery } from "../../../api/query-hooks";
import { Icon } from "../../../ui/Icons/Icon";
import { ReactSelectDropdown, StateOption } from "../../ReactSelectDropdown";

export const defaultSelections = {
  none: {
    description: "None",
    value: "none",
    order: -1
  }
};

function FilterLogsByComponent() {
  const [searchParams, setSearchParams] = useSearchParams();

  const topologyId = searchParams.get("topologyId");

  const { isLoading, data, error } = useComponentsWithLogsQuery({});

  const dropDownOptions = useMemo(() => {
    if (data) {
      return data.map((component) => {
        return {
          value: component.id,
          icon: <Icon name={component.icon} secondary={component.name} />,
          label: component.name,
          description: component.name
        } as StateOption;
      });
    }
  }, [data]);

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
    if (value?.toLowerCase() === "none") {
      searchParams.delete("topologyId");
      searchParams.delete("logsSelector");
      setSearchParams(searchParams);
      return;
    }
    const selectedComponent = data?.find((c) => c.id === value);
    if (selectedComponent) {
      searchParams.set("topologyId", selectedComponent.id!);
      searchParams.delete("logsSelector");
      setSearchParams(searchParams);
    }
  }

  return (
    <div className="flex flex-row items-center space-x-3">
      <ReactSelectDropdown
        onChange={onComponentSelect}
        prefix="Component:"
        name="component"
        className="w-auto max-w-[400px] capitalize"
        value={topologyId ?? "none"}
        // @ts-expect-error
        items={{ ...defaultSelections, ...dropDownOptions }}
        dropDownClassNames="w-auto max-w-[40rem] left-0"
        hideControlBorder
        isLoading={isLoading}
        isDisabled={isLoading}
      />
    </div>
  );
}

export default React.memo(FilterLogsByComponent);
