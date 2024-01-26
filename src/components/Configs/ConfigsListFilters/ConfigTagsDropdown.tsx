import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useGetConfigTagsListQuery } from "../../../api/query-hooks";
import { ReactSelectDropdown } from "../../ReactSelectDropdown";

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

  const { data, isLoading } = useGetConfigTagsListQuery();

  const configTagItems = useMemo(() => {
    if (data) {
      const options = data.map((tag) => ({
        label: (
          <div className="block space-x-1 text-sm">
            <span className="w-auto text-gray-600">{tag.key}:</span>
            <span className="w-full">{tag.value}</span>
          </div>
        ),
        value: `${tag.key}__:__${tag.value}`
      }));
      return [{ label: "All", value: "All" }, ...options];
    }
  }, [data]);

  return (
    <ReactSelectDropdown
      items={configTagItems}
      name="type"
      onChange={(value) => {
        if (!value || value === "All") {
          params.delete(searchParamKey);
        } else {
          params.set(searchParamKey, value);
        }
        setParams(params);
        onChange(value);
      }}
      value={params.get(searchParamKey) ?? "All"}
      className="w-auto max-w-[38rem]"
      dropDownClassNames="w-auto max-w-[38rem] left-0"
      hideControlBorder
      prefix={
        <div className="text-xs text-gray-500 mr-2 whitespace-nowrap">Tag:</div>
      }
      isLoading={isLoading}
    />
  );
}
