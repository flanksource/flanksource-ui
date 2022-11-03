import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useConfigPageContext } from "../../context/ConfigPageContext";
import { ReactSelectDropdown, StateOption } from "../ReactSelectDropdown";

export function ConfigTagFilterDropdown() {
  const [params, setParams] = useSearchParams();

  const {
    configState: { data }
  } = useConfigPageContext();

  const configTagItems: StateOption[] = useMemo(() => {
    if (!data) return [];
    const options = data.flatMap((d) => {
      return Object.entries(d?.tags || {}).map(([key, value]) => ({
        label: `${key}: ${value}`,
        value: `${key}__:__${value}`
      }));
    });
    return [{ label: "All", value: "All" }, ...options];
  }, [data]);

  return (
    <ReactSelectDropdown
      items={configTagItems}
      name="type"
      onChange={(value) =>
        setParams({ ...Object.fromEntries(params), tag: value ?? "All" })
      }
      value={params.get("tag") ?? "All"}
      className="w-auto max-w-[400px]"
      dropDownClassNames="w-auto max-w-[400px] left-0"
      hideControlBorder
      prefix={
        <div className="text-xs text-gray-500 mr-2 whitespace-nowrap">Tag:</div>
      }
    />
  );
}
