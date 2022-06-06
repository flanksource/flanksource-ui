import { ComponentMeta, ComponentStory } from "@storybook/react";
import sampleConfigList from "../../data/sampleConfigList";
import ConfigList from "./index";

export default {
  title: "ConfigList",
  component: ConfigList
} as ComponentMeta<typeof ConfigList>;

const Template: ComponentStory<typeof ConfigList> = (args) => (
  <ConfigList {...args} />
);

export const Default = Template.bind({});
Default.args = {
  data: sampleConfigList
};
