import React, { useMemo, useState } from "react";
import { MdOutlineError } from "react-icons/md";
import { useSearchParams } from "react-router-dom";
import { useComponentsQuery } from "../../api/query-hooks";
import { Icon } from "../Icon";
import { ReactSelectDropdown, StateOption } from "../ReactSelectDropdown";

export const defaultSelections = {
  none: {
    description: "None",
    value: "none",
    order: -1
  }
};

type FilterLogsByComponentProps = {
  showDeleted: boolean;
};

function FilterLogsByComponent({ showDeleted }: FilterLogsByComponentProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const topologyId = searchParams.get("topologyId");
  const { isLoading, data, error } = useComponentsQuery({});
  const [to, setTo] = useState("");

  const dropDownOptions = useMemo(() => {
    if (data) {
      return data
        .map((component) => {
          return {
            value: component.id,
            icon: <Icon name={component.icon} secondary={component.name} />,
            label: component.name,
            description: component.name,
            created_at: component.created_at,
            deleted_at: component.deleted_at || false
          } as StateOption;
        })
        .filter(
          (c) =>
            Date.parse(c.created_at) <= Date.parse(new Date().toISOString())
        )
        .sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at))
        .filter((c) => showDeleted === !!c.deleted_at);
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
      searchParams.delete("topologyExternalId");
      searchParams.delete("type");
      setSearchParams(searchParams);
      return;
    }
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
  console.log("data", dropDownOptions);
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
        dropDownClassNames="w-auto max-w-[400px] left-0"
        hideControlBorder
        isLoading={isLoading}
        isDisabled={isLoading}
        to={to}
        setTo={setTo}
      />
    </div>
  );
}

export default React.memo(FilterLogsByComponent);
