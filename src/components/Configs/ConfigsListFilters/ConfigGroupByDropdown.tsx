import { getConfigsTags } from "@flanksource-ui/api/services/configs";
import {
  GroupByOptions,
  MultiSelectDropdown
} from "@flanksource-ui/ui/Dropdowns/MultiSelectDropdown";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { BiLabel, BiStats } from "react-icons/bi";
import { MdDifference } from "react-icons/md";
import { usePrefixedSearchParams } from "@flanksource-ui/hooks/usePrefixedSearchParams";
import { MultiValue } from "react-select";

type ConfigGroupByDropdownProps = {
  onChange?: (value: string[] | undefined) => void;
  searchParamKey?: string;
  value?: string;
  paramsToReset?: string[];
  paramPrefix?: string;
};

const items: GroupByOptions[] = [
  {
    label: "name",
    value: "name",
    icon: <BiLabel />
  },
  {
    label: "analysis",
    value: "analysis",
    icon: <BiStats />
  },
  {
    label: "changed",
    value: "changed",
    icon: <MdDifference />
  },
  {
    label: "type",
    value: "type",
    icon: <BiLabel />
  },
  {
    label: "provider",
    value: "config_class",
    icon: <BiLabel />
  }
];

export default function ConfigGroupByDropdown({
  searchParamKey = "groupBy",
  onChange = () => {},
  paramsToReset = [],
  paramPrefix
}: ConfigGroupByDropdownProps) {
  const [params, setParams] = usePrefixedSearchParams(paramPrefix, false);

  const configType = params.get("configType") ?? undefined;

  const groupType: string[] = useMemo(() => {
    const groupBy = params.get(searchParamKey);
    if (!groupBy) {
      if (configType) {
        return [];
      }
      return ["config_class", "type"];
    }
    return groupBy.split(",").map((v) => v.replace("__tag", "")) ?? [];
  }, [configType, params, searchParamKey]);

  const { data: options = [], isLoading } = useQuery({
    queryKey: ["configs", "tags", "all"],
    queryFn: getConfigsTags,
    enabled: true,
    select: (tags) => {
      return [
        ...Object.values(items).filter((item) => {
          // If configType is set, we don't want to show the type and
          // config_class options in the dropdown, we only have one type of
          // config type in this case
          if (!configType) {
            return true;
          }
          if (item.value === "type") {
            return false;
          }
          if (item.value === "config_class") {
            return false;
          }
          return true;
        }),
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
                    label: tag.key.toLocaleLowerCase(),
                    value: tag.key,
                    isTag: true,
                    icon: <BiLabel />
                  }) satisfies GroupByOptions
              )
          : [])
      ].sort((a, b) => a.label.localeCompare(b.label));
    }
  });

  const groupByChange = useCallback(
    (value: MultiValue<GroupByOptions> | undefined) => {
      setParams((currentParams) => {
        const nextParams = new URLSearchParams(currentParams);
        if (!value || value.length === 0) {
          nextParams.delete(searchParamKey);
        } else {
          const values = value
            .map((v) => (v.isTag ? `${v.value}__tag` : v.value))
            .join(",");
          nextParams.set(searchParamKey, values);
        }
        paramsToReset.forEach((param) => {
          nextParams.delete(param);
        });
        return nextParams;
      });
      onChange(value?.map((v) => v.value));
    },
    [onChange, paramsToReset, searchParamKey, setParams]
  );

  const value = useMemo(
    () =>
      groupType
        .map((v) => {
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
        })
        .filter((v) => {
          if (configType) {
            return v.value !== "type";
          }
          return true;
        }),
    [configType, groupType, options]
  );

  return (
    <div className="flex flex-col items-center gap-2">
      <MultiSelectDropdown
        minMenuWidth="250px"
        options={options}
        isLoading={isLoading}
        value={value}
        onChange={(v) => groupByChange(v as MultiValue<GroupByOptions>)}
        label="Group By"
      />
    </div>
  );
}
