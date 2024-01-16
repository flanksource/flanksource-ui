import React, { ComponentProps } from "react";
import { Story, Meta } from "@storybook/react";
import DateTimeRangerPicker from "./DateTimeRangerPicker";

export default {
  title: "DateTimeRangerPicker",
  component: DateTimeRangerPicker
} as Meta;

const Template: Story<ComponentProps<typeof DateTimeRangerPicker>> = (args) => (
  <div className="flex flex-col space-y-4">
    <DateTimeRangerPicker {...args} />
  </div>
);

export const DefaultPicker = Template.bind({});

DefaultPicker.args = {
  label: "Date Range"
};
