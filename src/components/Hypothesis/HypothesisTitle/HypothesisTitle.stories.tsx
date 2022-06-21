import { ComponentMeta, ComponentStory } from "@storybook/react";
import { HypothesisTitle } from "./index";
import { sampleIncidentNode } from "../../../data/sampleIncident";

export default {
  title: "HypothesisTitle",
  component: HypothesisTitle,
  parameters: { actions: { argTypesRegex: "^on.*" } }
} as ComponentMeta<typeof HypothesisTitle>;

const Template: ComponentStory<typeof HypothesisTitle> = (arg: any) => (
  <HypothesisTitle {...arg} />
);

export const Base = Template.bind({});

Base.args = {
  node: sampleIncidentNode
};

export const Variant1 = Template.bind({});

Variant1.args = {
  node: sampleIncidentNode.children[1]
};

export const MinimalNode = Template.bind({});
MinimalNode.args = {
  node: {
    title: "Minimal Node",
    created_by: {
      id: "123",
      name: "Test User",
      avatar: "https://i.pravatar.cc/150?u=newton@flanksource.com"
    }
  }
};
