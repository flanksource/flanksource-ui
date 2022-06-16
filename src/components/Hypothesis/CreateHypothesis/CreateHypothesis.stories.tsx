import { ComponentMeta, ComponentStory } from "@storybook/react";
import { CreateHypothesis } from "./index";

export default {
  title: "CreateHypothesis",
  component: CreateHypothesis,
  parameters: { actions: { argTypesRegex: "^on.*" } }
} as ComponentMeta<typeof CreateHypothesis>;

const Template: ComponentStory<typeof CreateHypothesis> = (arg: any) => (
  <CreateHypothesis {...arg} />
);

export const Base = Template.bind({});

Base.args = {
  node: {
    incident_id: "i-123"
  },
  api: {}
};
