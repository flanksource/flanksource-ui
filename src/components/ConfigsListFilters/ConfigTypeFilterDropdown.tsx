import { ComponentProps } from "react";
import { useSearchParams } from "react-router-dom";
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

  const [params, setParams] = useSearchParams();

  return (
    <ReactSelectDropdown
      {...props}
      items={items}
      name="type"
      onChange={(value) =>
        setParams({ ...Object.fromEntries(params), type: value ?? "" })
      }
      value={params.get("type") ?? "All"}
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
