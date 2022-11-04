import { CSSProperties, useEffect, useState } from "react";
import { useComponentsQuery } from "../../../api/query-hooks";
import { TopologyComponentItem } from "../../FilterIncidents/FilterIncidentsByComponents";
import { Icon } from "../../Icon";
import { SearchableDropdown } from "../../SearchableDropdown";

type ComponentNamesDropdownProps = Omit<
  React.HTMLProps<HTMLDivElement>,
  "value"
> & {
  value?: Record<string, any>;
  onChange: any;
  loading?: boolean;
  placeholder?: string;
  disabled?: boolean;
};

type ComponentItem = TopologyComponentItem & { label: string; value: string };

const optionStyles: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  paddingLeft: "10px",
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis"
};

const formatOptionLabel = (data: { label: string; icon: any }) => (
  <div style={optionStyles} title={data.label}>
    <span>
      <Icon className="inline" name={data.icon} size="xl" /> {data.label}
    </span>
  </div>
);

export function ComponentNamesDropdown({
  value,
  loading,
  placeholder,
  onChange,
  className = "w-96",
  disabled,
  ...rest
}: ComponentNamesDropdownProps) {
  const [topologies, setTopologies] = useState<ComponentItem[]>([]);

  const { data: components } = useComponentsQuery({});

  useEffect(() => {
    if (!components?.data) {
      return;
    }
    const data = (components.data as ComponentItem[])
      .filter((item: TopologyComponentItem) => {
        return item.external_id;
      })
      .map((item) => {
        const option: ComponentItem = {
          ...item,
          label: item.name || "",
          value: item.id || ""
        };
        return option;
      })
      .sort((value1, value2) => {
        return value1.label.localeCompare(value2.label);
      });
    console.log(data);
    setTopologies(data);
  }, [components]);

  return (
    <SearchableDropdown
      className={className}
      value={value}
      isLoading={loading}
      options={topologies}
      isDisabled={disabled}
      placeholder={placeholder}
      onChange={onChange}
      formatOptionLabel={formatOptionLabel}
      formatGroupLabel={undefined}
      defaultValue={undefined}
      {...rest}
    />
  );
}
