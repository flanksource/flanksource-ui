import { ComponentMeta, ComponentStory } from "@storybook/react";
import { MemoryRouter } from "react-router-dom";
import { SchemaResourceI } from "../../api/schemaResources";
import { SchemaResourceList } from "./SchemaResourceList";

export default {
  title: "SchemaResourceList",
  component: SchemaResourceList,
  parameters: { actions: { argTypesRegex: "^on.*" } },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    )
  ]
} as ComponentMeta<typeof SchemaResourceList>;

const Template: ComponentStory<typeof SchemaResourceList> = (arg: any) => (
  <SchemaResourceList {...arg} />
);

const genItem = (suffix: string): SchemaResourceI => ({
  name: `item ${suffix}`,
  spec: JSON.stringify({ a: suffix, b: 2 }),
  created_at: "asd",
  updated_at: "ass",
  namespace: "default",
  labels: {},
  source: "",
  id: "asdas"
});

export const Base = Template.bind({});
Base.args = {
  items: [genItem("1"), genItem("two"), genItem("another")]
};
