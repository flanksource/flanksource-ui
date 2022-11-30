import { useSearchParams } from "react-router-dom";
import { ReactSelectDropdown } from "../ReactSelectDropdown";

type ConfigGroupByDropdownProps = {
  onChange?: (value: string | undefined) => void;
  searchParamKey?: string;
  value?: string;
};

export default function GroupByDropdown({
  onChange = () => {},
  searchParamKey = "groupBy",
  value
}: ConfigGroupByDropdownProps) {
  const items = {
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

  const [params, setParams] = useSearchParams({
    [searchParamKey]: value ?? "no_grouping"
  });

  return (
    <ReactSelectDropdown
      name="group"
      items={items}
      onChange={(value) => {
        setParams({
          ...Object.fromEntries(params),
          [searchParamKey]: value || ""
        });
        onChange(value);
      }}
      value={params.get(searchParamKey) ?? ""}
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
