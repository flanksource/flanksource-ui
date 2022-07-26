import { useState } from "react";
import { ConfigItem } from "./index";

const ConfigItemDropDown = ({ type }: { type: string }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [dependentSelectedItem, setDependentSelectedItem] = useState(null);
  return (
    <div className="flex flex-col">
      <ConfigItem
        className="w-96"
        type={type}
        value={selectedItem}
        autoFetch={true}
        onSelect={(item) => setSelectedItem(item)}
        dependentConfigItems={[
          {
            className: "w-96 mt-2",
            type: "esb",
            value: dependentSelectedItem,
            autoFetch: false,
            itemsPath: "$..block_device_mappings",
            namePath: "$.DeviceName",
            valuePath: "$.Ebs.VolumeId",
            onSelect: (item: any) => {
              setDependentSelectedItem(item);
            }
          }
        ]}
      />
    </div>
  );
};

export default {
  title: "ConfigItem",
  component: ConfigItem
};

const EC2InstanceTemplate = ({ ...props }) => (
  <ConfigItemDropDown {...{ ...props, type: "EC2Instance" }} />
);

export const EC2Instance = EC2InstanceTemplate.bind({});
EC2Instance.args = {};

const SubnetTemplate = ({ ...props }) => (
  <ConfigItemDropDown {...{ ...props, type: "Subnet" }} />
);
export const Subnet = SubnetTemplate.bind({});
Subnet.args = {};
