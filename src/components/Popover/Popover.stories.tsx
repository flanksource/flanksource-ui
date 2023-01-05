import { Story } from "@storybook/react";
import { template } from "lodash";
import { ComponentProps } from "react";
import { FaChevronCircleDown } from "react-icons/fa";
import Popover from "./Popover";

export default {
  title: "Popover",
  component: Popover
};

const Template = (args: ComponentProps<typeof Popover>) => (
  <Popover {...args} />
);

export const DefaultPopoverIcon: Story<ComponentProps<typeof Popover>> =
  Template.bind({});

DefaultPopoverIcon.args = {
  children: "Popover content",
  title: "Preferences"
};

export const CustomPopoverIcon: Story<ComponentProps<typeof Popover>> =
  Template.bind({});

CustomPopoverIcon.args = {
  children: "Popover content",
  title: "Preferences",
  popoverIcon: <FaChevronCircleDown />
};

export const NoTitle: Story<ComponentProps<typeof Popover>> = Template.bind({});

NoTitle.args = {
  children: "Popover content"
};
