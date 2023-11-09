import React, { ComponentProps } from "react";
import { Story, Meta } from "@storybook/react";
import ProgressBar from "./ProgressBar";

export default {
  title: "ProgressBar",
  component: ProgressBar
} as Meta;

const Template: Story<ComponentProps<typeof ProgressBar>> = (args) => (
  <div className="flex flex-col space-y-4">
    <ProgressBar {...args} />
  </div>
);

export const FivePercent = Template.bind({});
FivePercent.args = {
  value: 5
};

export const FiftyPercent = Template.bind({});
FiftyPercent.args = {
  value: 50
};

export const EightyPercent = Template.bind({});
EightyPercent.args = {
  value: 80
};
