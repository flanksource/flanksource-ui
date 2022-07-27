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

const EC2ConfigItemDropDown = ({ type }: { type: string }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [dependentSelectedItem, setDependentSelectedItem] = useState(null);
  return (
    <div className="flex flex-col">
      <ConfigItem
        className="w-96"
        type={type}
        value={selectedItem}
        autoFetch={true}
        label="EC2Instances"
        description="list of ec2 instances"
        onSelect={(item) => {
          setSelectedItem(item);
          setDependentSelectedItem(null);
        }}
      >
        <ConfigItem
          className="w-96"
          type="esb"
          value={dependentSelectedItem}
          autoFetch={false}
          itemsPath="$..block_device_mappings"
          label="Device Name"
          description="list of device names"
          namePath="$.DeviceName"
          valuePath="$.Ebs.VolumeId"
          onSelect={(item: any) => {
            setDependentSelectedItem(item);
          }}
          isDisabled={!selectedItem}
        />
      </ConfigItem>
    </div>
  );
};

const SubnetConfigItemDropDown = ({ type }: { type: string }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [dependentSelectedItem, setDependentSelectedItem] = useState(null);
  return (
    <div className="flex flex-col">
      <ConfigItem
        className="w-96"
        type={type}
        value={selectedItem}
        autoFetch={true}
        label={<label className="block text-sm font-light">Subnet</label>}
        description={
          <div className="px-2 bg-white text-gray-700 text-xs">
            list of subnets
          </div>
        }
        onSelect={(item) => {
          setSelectedItem(item);
          setDependentSelectedItem(null);
        }}
      >
        <ConfigItem
          className="w-96 mt-1"
          type="esb"
          value={dependentSelectedItem}
          autoFetch={false}
          itemsPath="$..block_device_mappings"
          label={
            <label className="block font-light text-sm mt-2">Device Name</label>
          }
          description={
            <div className="px-2 bg-white text-gray-700 text-xs">
              list of device names
            </div>
          }
          namePath="$.DeviceName"
          valuePath="$.Ebs.VolumeId"
          onSelect={(item: any) => {
            setDependentSelectedItem(item);
          }}
          isDisabled={!selectedItem}
        />
      </ConfigItem>
    </div>
  );
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
        label={<label className="block text-sm font-light">Subnet</label>}
        description={
          <div className="px-2 bg-white text-gray-700 text-xs">
            list of subnets
          </div>
        }
        onSelect={(item) => {
          setSelectedItem(item);
          setDependentSelectedItem(null);
        }}
      >
        <label className="block font-light text-sm">Device Name</label>
        <ConfigItem
          className="w-96 mt-1"
          type="esb"
          value={dependentSelectedItem}
          autoFetch={false}
          itemsPath="$..block_device_mappings"
          namePath="$.DeviceName"
          valuePath="$.Ebs.VolumeId"
          onSelect={(item: any) => {
            setDependentSelectedItem(item);
          }}
          isDisabled={!selectedItem}
        />
        <div className="px-2 bg-white text-gray-700 text-xs">
          list of device names
        </div>
      </ConfigItem>
    </div>
  );
};

export default {
  title: "ConfigItem",
  component: ConfigItem
};

const LabelDescDefaultStyleTemplate = ({ ...props }) => (
  <EC2ConfigItemDropDown {...{ ...props, type: "EC2Instance" }} />
);

export const LabelDescpritionDefaultStyle = LabelDescDefaultStyleTemplate.bind(
  {}
);
LabelDescpritionDefaultStyle.args = {};

const LabelDescCustomStyleTemplate = ({ ...props }) => (
  <SubnetConfigItemDropDown {...{ ...props, type: "Subnet" }} />
);
export const LabelDescriptionCustomStyle = LabelDescCustomStyleTemplate.bind(
  {}
);
LabelDescriptionCustomStyle.args = {};

const InlineLabelDescriptionTemplate = ({ ...props }) => (
  <ConfigItemDropDown {...{ ...props, type: "EC2Instance" }} />
);
export const InlineLabelDescription = InlineLabelDescriptionTemplate.bind({});
InlineLabelDescription.args = {};
