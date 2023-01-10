import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useAllConfigsQuery } from "../../api/query-hooks";
import { useConfigPageContext } from "../../context/ConfigPageContext";
import { ReactSelectDropdown, StateOption } from "../ReactSelectDropdown";

type Props = {
  onChange?: (value: string | undefined) => void;
  searchParamKey?: string;
  value?: string;
};

export function ConfigTagsDropdown({
  onChange = () => {},
  searchParamKey = "tag",
  value
}: Props) {
  const [params, setParams] = useSearchParams({
    ...(value && { [searchParamKey]: value })
  });

  const { data: response } = useAllConfigsQuery({}, {});

  const configTagItems: StateOption[] = useMemo(() => {
    if (!response) return [];
    console.log("optionsss", response.data);
    const options = response.data?.flatMap((d) => {
      return Object.entries(d?.tags || {})
        .filter(([key]) => {
          return key !== "toString";
        })
        .map(([key, value]) => ({
          label: `${key}: ${value}`,
          value: `${key}__:__${value}`
        }));
    });
    console.log("options", options);
    return [{ label: "All", value: "All" }, ...options];
  }, [response]);

  return (
    <ReactSelectDropdown
      items={configTagItems}
      name="type"
      onChange={(value) => {
        setParams({
          ...Object.fromEntries(params),
          [searchParamKey]: value ?? "All"
        });
        onChange(value);
      }}
      value={params.get(searchParamKey) ?? "All"}
      className="w-auto max-w-[400px]"
      dropDownClassNames="w-auto max-w-[400px] left-0"
      hideControlBorder
      prefix={
        <div className="text-xs text-gray-500 mr-2 whitespace-nowrap">Tag:</div>
      }
    />
  );
}
