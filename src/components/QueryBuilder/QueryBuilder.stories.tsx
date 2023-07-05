import { MemoryRouter } from "react-router-dom";
import { QueryBuilder } from "./index";
import { ComponentMeta, ComponentStory } from "@storybook/react";

export default {
  title: "QueryBuilder",
  component: QueryBuilder,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    )
  ]
} as ComponentMeta<typeof QueryBuilder>;

const Template: ComponentStory<typeof QueryBuilder> = (arg) => (
  <QueryBuilder {...arg} />
);

export const Variant1 = Template.bind({});
Variant1.args = {};
