import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { SubtleDropdown } from "./SubtleDropdown";
import { hypothesisStatusDropdownOptions } from "../../constants/hypothesisStatusOptions";

export default {
  title: "SubtleDropdown",
  component: SubtleDropdown,
  parameters: { actions: { argTypesRegex: "^on.*" } }
} as ComponentMeta<typeof SubtleDropdown>;

const Template: ComponentStory<typeof SubtleDropdown> = (arg: any) => (
  <SubtleDropdown {...arg} />
);

export const Base = Template.bind({});

Base.args = {
  items: hypothesisStatusDropdownOptions,
  name: "status",
  value: "likely",
  className: "w-44",
  onChange: (...args) => console.log(args)
};
