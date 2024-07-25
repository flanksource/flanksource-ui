import { Story } from "@storybook/react";
import React, { ComponentProps } from "react";
import CheckboxCollapsibleGroup from "./CheckboxCollapsibleGroup";

export default {
  title: "CheckboxCollapsibleGroup",
  component: CheckboxCollapsibleGroup,
  decorators: [
    (Story: React.FC) => (
      <div className="h-screen w-screen overflow-y-auto p-1">
        <Story />
      </div>
    )
  ]
};

const Template = (args: ComponentProps<typeof CheckboxCollapsibleGroup>) => (
  <CheckboxCollapsibleGroup {...args} />
);

export const CheckboxCollapsibleGroupDefault: Story<
  ComponentProps<typeof CheckboxCollapsibleGroup>
> = Template.bind({});

CheckboxCollapsibleGroupDefault.args = {
  label: "Show Field Groups",
  children: <div>Children</div>
};

export const CheckboxCollapsibleGroupDefaultChecked: Story<
  ComponentProps<typeof CheckboxCollapsibleGroup>
> = Template.bind({});

CheckboxCollapsibleGroupDefaultChecked.args = {
  label: "Show Field Groups",
  children: <div>Children</div>,
  isChecked: true
};
