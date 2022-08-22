import { MemoryRouter } from "react-router-dom";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { SchemaResource } from "./SchemaResource";

export default {
  title: "SchemaResource",
  component: SchemaResource,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    )
  ],
  parameters: { actions: { argTypesRegex: "^on.*" } }
} as ComponentMeta<typeof SchemaResource>;

const Template: ComponentStory<typeof SchemaResource> = (arg: any) => (
  <SchemaResource {...arg} />
);

export const Base = Template.bind({});
Base.args = {
  resourceInfo: {
    spec: '{ test: "some" }',
    name: "test resource"
  }
};
