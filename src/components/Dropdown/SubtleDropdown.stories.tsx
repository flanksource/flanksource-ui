import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { hypothesisStatuses } from "../HypothesisBuilder/data";
import { SubtleDropdown } from "./SubtleDropdown";

export default {
  title: "SubtleDropdown",
  component: SubtleDropdown,
  parameters: { actions: { argTypesRegex: "^on.*" } }
} as ComponentMeta<typeof SubtleDropdown>;

const Template: ComponentStory<typeof SubtleDropdown> = (arg: any) => (
  <SubtleDropdown {...arg} />
);

const statusItems = {
  ...Object.values(hypothesisStatuses).reduce((acc, obj) => {
    const title = obj.title.toLowerCase();
    acc[title] = {
      id: `dropdown-${title}`,
      name: title,
      icon: React.createElement(obj.icon.type, {
        color: obj.color,
        style: { width: "20px" }
      }),
      description: obj.title,
      value: title
    };
    return acc;
  }, {})
};

export const Base = Template.bind({});

Base.args = {
  items: statusItems,
  name: "status",
  value: "likely",
  className: "w-44",
  onChange: (...args) => console.log(args)
};
