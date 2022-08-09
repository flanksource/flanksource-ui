import { ComponentMeta, ComponentStory } from "@storybook/react";
import { SchemaResource } from "./SchemaResource";

export default {
  title: "SchemaResource",
  component: SchemaResource,
  parameters: { actions: { argTypesRegex: "^on.*" } }
} as ComponentMeta<typeof SchemaResource>;

const Template: ComponentStory<typeof SchemaResource> = (arg: any) => (
  <SchemaResource {...arg} />
);

export const Base = Template.bind({});
Base.args = {
  spec: '{ test: "some" }',
  name: "test resource"
};
