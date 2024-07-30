import { ComponentMeta, ComponentStory } from "@storybook/react";
import { schemaResourceTypes } from "./resourceTypes";
import { SchemaResource } from "./SchemaResource";

export default {
  title: "SchemaResource",
  component: SchemaResource,
  decorators: [(Story) => <Story />],
  parameters: { actions: { argTypesRegex: "^on.*" } }
} as ComponentMeta<typeof SchemaResource>;

const Template: ComponentStory<typeof SchemaResource> = (arg: any) => (
  <SchemaResource {...arg} />
);

export const Base = Template.bind({});
Base.args = {
  resourceInfo: schemaResourceTypes[0]
};
