import { ComponentProps, useState } from "react";
import { ReactSelectDropdown } from "../ReactSelectDropdown";

export function ConfigTypeFilterDropdown({
  ...props
}: ComponentProps<typeof ReactSelectDropdown>) {
  const items = {
    All: {
      id: "All",
      name: "All",
      description: "All",
      value: "All"
    },
    EC2Instance: {
      id: "EC2Instance",
      name: "EC2 Instance",
      description: "EC2 Instance",
      value: "EC2Instance"
    },
    Subnet: {
      id: "Subnet",
      name: "Subnet",
      description: "Subnet",
      value: "Subnet"
    }
  };

  const [selected, setSelected] = useState<string | undefined>(
    Object.values(items)[0].value
  );

  return (
    <ReactSelectDropdown
      {...props}
      items={items}
      name="type"
      onChange={(value) => setSelected(value)}
      value={selected}
      className="w-auto max-w-[400px]"
      dropDownClassNames="w-auto max-w-[400px] left-0"
      hideControlBorder
      prefix={
        <div className="text-xs text-gray-500 mr-2 whitespace-nowrap">
          Type:
        </div>
      }
    />
  );
}
