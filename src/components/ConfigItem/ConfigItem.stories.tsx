import { useState } from "react";
import { ConfigItem } from "./index";

const ConfigItemDropDown = ({ type }: { type: string }) => {
  console.log(type);
  const [selectedItem, setSelectedItem] = useState(null);
  return (
    <div className="flex">
      <ConfigItem
        className="w-96"
        type={type}
        value={selectedItem}
        onSelect={(item) => setSelectedItem(item)}
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
