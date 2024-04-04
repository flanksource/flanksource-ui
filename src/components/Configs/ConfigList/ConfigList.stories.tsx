import { ComponentMeta, ComponentStory } from "@storybook/react";
import { MemoryRouter } from "react-router-dom";
import sampleConfigList from "../../../data/sampleConfigList";
import ConfigsTable from "./ConfigsTable";

export default {
  title: "ConfigList",
  component: ConfigsTable,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    )
  ]
} as ComponentMeta<typeof ConfigsTable>;

const Template: ComponentStory<typeof ConfigsTable> = (args) => (
  <ConfigsTable {...args} />
);

export const Default = Template.bind({});
Default.args = {
  data: sampleConfigList
};
