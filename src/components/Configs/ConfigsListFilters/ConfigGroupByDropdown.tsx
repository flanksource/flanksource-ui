import { getConfigsTags } from "@flanksource-ui/api/services/configs";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { BiLabel } from "react-icons/bi";
import { useSearchParams } from "react-router-dom";
import { ReactSelectDropdown } from "../../ReactSelectDropdown";

type ConfigGroupByDropdownProps = {
  onChange?: (value: string | undefined) => void;
  searchParamKey?: string;
  value?: string;
};

type GroupOptionsType = {
  [key: string]: {
    id: string;
    name: string;
    description: string;
    value: string;
    icon?: React.ReactNode;
    [key: string]: string | boolean | React.ReactNode | number;
  };
};

const items: GroupOptionsType = {
  /* Type: {
    id: "Type",
    name: "Type",
    description: "Type",
    value: "type"
  }, */
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

export default function ConfigGroupByDropdown({
  onChange = () => {},
  searchParamKey = "groupBy",
  value
}: ConfigGroupByDropdownProps) {
  const [params, setParams] = useSearchParams({
    [searchParamKey]: value ?? "type"
  });

  const groupType = decodeURIComponent(
    params.get("groupByProp") || params.get("groupBy") || "type"
  );

  const { data: tags, isLoading } = useQuery({
    queryKey: ["configs", "tags", "all"],
    queryFn: getConfigsTags,
    enabled: true
  });

  const groupByOptions = useMemo(() => {
    if (!tags || tags.length === 0) {
      return Object.values(items).sort((a, b) => {
        return a.name?.localeCompare(b.name);
      });
    }
    return (
      tags
        // ensure that the tags are unique
        .filter(
          (tag, index, self) =>
            self.findIndex((t) => t.key === tag.key) === index
        )
        ?.map(
          (tag) =>
            ({
              id: tag.key,
              name: tag.key,
              description: tag.key,
              value: tag.key,
              tag: true,
              icon: <BiLabel />
            } satisfies GroupOptionsType[number])
        )
        .sort((a, b) => {
          return a.name?.localeCompare(b.name);
        })
    );
  }, [tags]);

  const groupByChange = (value: string | undefined) => {
    if (value === undefined || value === "no_grouping") {
      params.delete("groupBy");
      params.delete("groupByProp");
      setParams({
        ...Object.fromEntries(params)
      });
      onChange(undefined);
      return;
    }
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
      isLoading={isLoading}
      items={[
        {
          id: "No Grouping",
          name: "No Grouping",
          description: "No Grouping",
          value: "no_grouping"
        },
        ...groupByOptions
      ]}
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
