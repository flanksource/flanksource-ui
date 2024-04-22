import { getConfigsTags } from "@flanksource-ui/api/services/configs";
import {
  GroupByOptions,
  MultiSelectDropdown
} from "@flanksource-ui/ui/Dropdowns/MultiSelectDropdown";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { BiLabel } from "react-icons/bi";
import { useSearchParams } from "react-router-dom";
import { MultiValue } from "react-select";

type ConfigGroupByDropdownProps = {
  onChange?: (value: string[] | undefined) => void;
  searchParamKey?: string;
  value?: string;
};

const items: GroupByOptions[] = [
  {
    label: "Name",
    value: "name"
  },
  {
    label: "Analysis",
    value: "analysis"
  },
  {
    label: "Changed",
    value: "changed"
  },
  {
    label: "Type",
    value: "type"
  }
];

export default function ConfigGroupByDropdown({
  searchParamKey = "groupBy",
  onChange = () => {}
}: ConfigGroupByDropdownProps) {
  const [params, setParams] = useSearchParams();

  const groupType: string[] = useMemo(() => {
    const groupBy = params.get(searchParamKey);
    if (!groupBy) {
      return [];
    }
    return groupBy.split(",").map((v) => v.replace("__tag", "")) ?? [];
  }, [params, searchParamKey]);

  const { data: options = [], isLoading } = useQuery({
    queryKey: ["configs", "tags", "all"],
    queryFn: getConfigsTags,
    enabled: true,
    select: (tags) => {
      return [
        ...Object.values(items),
        ...(tags && tags.length > 0
          ? tags
              // ensure that the tags are unique
              .filter(
                (tag, index, self) =>
                  self.findIndex((t) => t.key === tag.key) === index
              )
              ?.map(
                (tag) =>
                  ({
                    label: tag.key,
                    value: tag.key,
                    isTag: true,
                    icon: <BiLabel />
                  } satisfies GroupByOptions)
              )
          : [])
      ].sort((a, b) => a.label.localeCompare(b.label));
    }
  });

  const groupByChange = useCallback(
    (value: MultiValue<GroupByOptions> | undefined) => {
      if (!value || value.length === 0) {
        params.delete(searchParamKey);
      } else {
        const values = value
          .map((v) => (v.isTag ? `${v.value}__tag` : v.value))
          .join(",");
        params.set(searchParamKey, values);
      }
      setParams(params);
      onChange(value?.map((v) => v.value));
    },
    [onChange, params, searchParamKey, setParams]
  );

  const value = useMemo(
    () =>
      groupType.map((v) => {
        // @ts-ignore not sure why this is not working
        const item = options.find((option) => option.value === v);
        if (item) {
          return item;
        }
        return {
          label: v,
          value: v,
          isTag: true,
          icon: <BiLabel />
        } as GroupByOptions;
      }),
    [groupType, options]
  );

  return (
    <div className="flex flex-col items-center gap-2">
      <MultiSelectDropdown
        options={options}
        isLoading={isLoading}
        value={value}
        onChange={(v) => groupByChange(v as MultiValue<GroupByOptions>)}
        label="Group By"
      />
    </div>
  );
}
