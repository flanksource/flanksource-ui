import { useState, useEffect } from "react";
import { BiLabel } from "react-icons/bi";
import { useSearchParams } from "react-router-dom";
import { useAllConfigsQuery } from "../../api/query-hooks";
import { ReactSelectDropdown } from "../ReactSelectDropdown";

type ConfigGroupByDropdownProps = {
  onChange?: (value: string | undefined) => void;
  searchParamKey?: string;
  value?: string;
};

type GroupOptionsType = Record<string, Record<string, string | boolean>>;

const items: GroupOptionsType = {
  NoGrouping: {
    id: "No Grouping",
    name: "No Grouping",
    description: "No Grouping",
    value: "no_grouping"
  },
  Type: {
    id: "Type",
    name: "Type",
    description: "Type",
    value: "config_type"
  },
  Name: {
    id: "Name",
    name: "Name",
    description: "Name",
    value: "name"
  },
  Analysis: {
    id: "Analysis",
    name: "Analysis",
    description: "Analysis",
    value: "analysis"
  },
  Changed: {
    id: "Changed",
    name: "Changed",
    description: "Changed",
    value: "changed"
  }
};

export default function GroupByDropdown({
  onChange = () => {},
  searchParamKey = "groupBy",
  value
}: ConfigGroupByDropdownProps) {
  const [params, setParams] = useSearchParams({
    [searchParamKey]: value ?? "config_type"
  });
  const groupType = decodeURIComponent(
    params.get("groupByProp") || params.get("groupBy") || "config_type"
  );

  const [groupByOptions, setGroupByOptions] = useState<GroupOptionsType>();
  const { data: allConfigs, isLoading } = useAllConfigsQuery({});

  useEffect(() => {
    if (!allConfigs?.data) {
      setGroupByOptions(items);
    }
    const newItems = items;
    allConfigs?.data?.forEach((d) => {
      return Object.entries(d?.tags || {})
        .filter(([key]) => {
          return key !== "toString";
        })
        .forEach(([key]) => {
          newItems[`tag-${key}`] = {
            id: key,
            name: key,
            icon: <BiLabel />,
            description: key,
            value: key,
            tag: true
          };
        });
    });
    setGroupByOptions({ ...newItems });
  }, [allConfigs?.data, isLoading]);

  const groupByChange = (value: string | undefined) => {
    const options = groupByOptions as any;
    let selectedOption: any;
    Object.keys(options).forEach((key) => {
      if (options[key]?.value === value) {
        selectedOption = options[key];
      }
    });
    if (!selectedOption.tag) {
      params.set("groupBy", encodeURIComponent(selectedOption.value || ""));
      params.delete("groupByProp");
    } else {
      params.set("groupBy", "tags");
      params.set("groupByProp", encodeURIComponent(selectedOption.value || ""));
    }
    setParams({
      ...Object.fromEntries(params)
    });
    onChange(value);
  };

  return (
    <ReactSelectDropdown
      name="group"
      items={groupByOptions}
      onChange={groupByChange}
      value={groupType}
      className="w-auto max-w-[400px]"
      dropDownClassNames="w-auto max-w-[400px] left-0"
      hideControlBorder
      prefix={
        <div className="text-xs text-gray-500 mr-2 whitespace-nowrap">
          Group By:
        </div>
      }
    />
  );
}
