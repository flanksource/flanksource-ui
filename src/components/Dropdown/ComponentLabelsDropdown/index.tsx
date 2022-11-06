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
      <label className="self-center inline-block pt-2 mr-3 text-sm text-gray-500">
        {`${name}:`}
      </label>
      <ReactSelectDropdown
        label={label}
        name={name}
        value={value}
        items={topologyLabels}
        className="inline-block p-3 w-80 md:w-60"
        onChange={(val: any) => {
          onChange(val);
        }}
      />
    </div>
  );
}
