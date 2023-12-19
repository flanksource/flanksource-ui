import { useState } from "react";
import { ConfigItem } from "./index";
import { ConfigDB } from "../../../api/axios";
import { MOCK_DATA } from "./storybook-mock";
import { ComponentStory } from "@storybook/react";

// @ts-expect-error
ConfigDB.get = (url: string) => {
  if (url.indexOf("JIRA") > -1) {
    return Promise.resolve({
      data: MOCK_DATA.filter((v) => v.type === "JIRA")
    });
  } else if (url.indexOf("EC2Instance") > -1) {
    return Promise.resolve({
      data: MOCK_DATA.filter((v) => v.type === "EC2Instance")
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
        name="type"
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
          name="type"
          className="w-96"
          type="esb"
          value={dependentSelectedItem}
          autoFetch={false}
          itemsPath="$..block_device_mappings[*]"
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

const JiraConfigItemDropDown = ({ type }: { type: string }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedIssue, setSelectedIssue] = useState(null);
  return (
    <div className="flex flex-col">
      <ConfigItem
        name="type"
        className="w-96"
        type={type}
        value={selectedItem}
        autoFetch={true}
        label={
          <label className="block text-sm font-light">Jira Config Types</label>
        }
        description={
          <div className="px-2 bg-white text-gray-700 text-xs">
            list of jira config types
          </div>
        }
        onSelect={(item) => {
          setSelectedItem(item);
          setSelectedProject(null);
        }}
      >
        <ConfigItem
          name="project"
          className="w-96 mt-1"
          type="JIRA"
          value={selectedProject}
          autoFetch={false}
          itemsPath="$..projects[*]"
          namePath="$.name"
          valuePath="$.name"
          label={
            <label className="block font-light text-sm mt-2">Project</label>
          }
          description={
            <div className="px-2 bg-white text-gray-700 text-xs">
              Jira project name
            </div>
          }
          onSelect={(item: any) => {
            setSelectedProject(item);
            setSelectedIssue(null);
          }}
          isDisabled={!selectedItem}
        >
          <ConfigItem
            name="issueType"
            className="w-96 mt-1"
            type="JIRA"
            value={selectedIssue}
            autoFetch={false}
            itemsPath="$..task.status[*]"
            namePath="$"
            valuePath="$"
            label={
              <label className="block font-light text-sm mt-2">
                Issue Type
              </label>
            }
            description={
              <div className="px-2 bg-white text-gray-700 text-xs">
                Issue Type
              </div>
            }
            onSelect={(item: any) => {
              setSelectedIssue(item);
            }}
            isDisabled={!selectedProject}
          />
        </ConfigItem>
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
        name="item"
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
          name="deviceName"
          className="w-96 mt-1"
          type="esb"
          value={dependentSelectedItem}
          autoFetch={false}
          itemsPath="$..block_device_mappings[*]"
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

const LabelDescDefaultStyleTemplate: ComponentStory<
  typeof EC2ConfigItemDropDown
> = ({ ...props }) => (
  <EC2ConfigItemDropDown {...{ ...props, type: "EC2Instance" }} />
);

export const LabelDescpritionDefaultStyle = LabelDescDefaultStyleTemplate.bind(
  {}
);
LabelDescpritionDefaultStyle.args = {};

const LabelDescCustomStyleTemplate: ComponentStory<
  typeof JiraConfigItemDropDown
> = ({ ...props }) => (
  <JiraConfigItemDropDown {...{ ...props, type: "JIRA" }} />
);
export const LabelDescriptionCustomStyle = LabelDescCustomStyleTemplate.bind(
  {}
);
LabelDescriptionCustomStyle.args = {};

const InlineLabelDescriptionTemplate: ComponentStory<
  typeof ConfigItemDropDown
> = ({ ...props }) => (
  <ConfigItemDropDown {...{ ...props, type: "EC2Instance" }} />
);
export const InlineLabelDescription = InlineLabelDescriptionTemplate.bind({});
InlineLabelDescription.args = {};
