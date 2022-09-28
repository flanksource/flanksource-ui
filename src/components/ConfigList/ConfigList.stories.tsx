import { ComponentMeta, ComponentStory } from "@storybook/react";
import { MemoryRouter } from "react-router-dom";
import sampleConfigList from "../../data/sampleConfigList";
import ConfigList from "./index";

export default {
  title: "ConfigList",
  component: ConfigList,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    )
  ]
} as ComponentMeta<typeof ConfigList>;

const Template: ComponentStory<typeof ConfigList> = (args) => (
  <ConfigList {...args} />
);

export const Default = Template.bind({});
Default.args = {
  data: sampleConfigList
};
