import clsx from "clsx";
import { useEffect, useState } from "react";
import { useComponentLabelsQuery } from "../../../api/query-hooks";
import { allOption } from "../../../pages/TopologyPage";
import { ReactSelectDropdown, StateOption } from "../../ReactSelectDropdown";

type ComponentLabelsDropdownProps = React.HTMLProps<HTMLDivElement> & {
  onChange: (val: any) => void;
  value: string | StateOption | undefined;
};

export function ComponentLabelsDropdown({
  name = "component-labels",
  label,
  className,
  value,
  onChange,
  ...rest
}: ComponentLabelsDropdownProps) {
  const [topologyLabels, setTopologyLabels] = useState<any>({});

  const { data: labels } = useComponentLabelsQuery({});

  useEffect(() => {
    setupLabelsDropdown(labels?.data);
  }, [labels]);

  function setupLabelsDropdown(data: any[]) {
    const allLabels: { [key: string]: any } = {
      ...allOption
    };
    if (!data) {
      setTopologyLabels(allLabels);
      return;
    }
    data.forEach((item: any) => {
      const value = `${item.key}=${item.value}`;
      const label = `${item.key}:${item.value}`;
      allLabels[value] = {
        id: value,
        name: label,
        description: label,
        value: value
      };
    });
    setTopologyLabels(allLabels);
  }

  return (
    <div className={clsx(className)} {...rest}>
      <ReactSelectDropdown
        label={label}
        name={name}
        value={value}
        items={topologyLabels}
        className="inline-block p-3 w-auto max-w-[500px]"
        dropDownClassNames="w-auto max-w-[400px] left-0"
        onChange={(val: any) => {
          onChange(val);
        }}
        prefix={
          <div className="text-xs text-gray-500 mr-2 whitespace-nowrap">
            {`${name}:`}
          </div>
        }
      />
    </div>
  );
}
