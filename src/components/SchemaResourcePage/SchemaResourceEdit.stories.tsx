import { ComponentMeta, ComponentStory } from "@storybook/react";
import { SchemaResourceEdit } from "./SchemaResourceEdit";

export default {
  title: "SchemaResourceEdit",
  component: SchemaResourceEdit,
  parameters: { actions: { argTypesRegex: "^on.*" } }
} as ComponentMeta<typeof SchemaResourceEdit>;

const Template: ComponentStory<typeof SchemaResourceEdit> = (arg: any) => (
  <SchemaResourceEdit {...arg} />
);

export const Base = Template.bind({});
Base.args = {};
