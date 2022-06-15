import { ComponentMeta, ComponentStory } from "@storybook/react";
import { HypothesisNode } from "./index";
import { sampleIncidentNode } from "../../../data/sampleIncident";

export default {
  title: "HypothesisNode",
  component: HypothesisNode,
  parameters: { actions: { argTypesRegex: "^on.*" } }
} as ComponentMeta<typeof HypothesisNode>;

const Template: ComponentStory<typeof HypothesisNode> = (arg: any) => (
  <HypothesisNode {...arg} />
);

export const Base = Template.bind({});
Base.args = {
  node: sampleIncidentNode,
  setModalIsOpen: () => {},
  setSelectedNode: () => {},
  setCreateHypothesisModalIsOpen: () => {}
};
