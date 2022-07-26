import { useState } from "react";
import { ConfigItem } from "./index";
import { ConfigDB } from "../../api/axios";
import { MOCK_DATA } from "./storybook-mock";

ConfigDB.get = (url: string) => {
  if (url.indexOf("Subnet") > -1) {
    return Promise.resolve({
      data: MOCK_DATA.filter((v) => v.config_type === "Subnet")
    });
  } else if (url.indexOf("EC2Instance") > -1) {
    return Promise.resolve({
      data: MOCK_DATA.filter((v) => v.config_type === "EC2Instance")
    });
  } else if (url.indexOf("/config_item?id=eq.") > -1) {
    const id = url.replace("/config_item?id=eq.", "");
    return Promise.resolve({
      data: [MOCK_DATA.find((item) => item.id === id)]
    });
  }
};

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
        onSelect={(item) => {
          setSelectedItem(item);
          setDependentSelectedItem(null);
        }}
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
