import { Meta, StoryFn } from "@storybook/react";
import { SchemaResourceEdit } from "./SchemaResourceEdit";
import { schemaResourceTypes } from "./resourceTypes";

export default {
  title: "SchemaResourceEdit",
  component: SchemaResourceEdit,
  parameters: { actions: { argTypesRegex: "^on.*" } }
} as Meta<typeof SchemaResourceEdit>;

const Template: StoryFn<typeof SchemaResourceEdit> = (arg: any) => (
  <SchemaResourceEdit {...arg} />
);

export const Base = Template.bind({});
Base.args = {
  resourceInfo: schemaResourceTypes[0]
};
