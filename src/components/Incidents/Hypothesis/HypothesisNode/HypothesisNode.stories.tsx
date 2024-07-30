import { ComponentMeta, ComponentStory } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { sampleIncidentNode } from "../../../../data/sampleIncident";
import { HypothesisNode } from "./index";

const defaultQueryClient = new QueryClient();

export default {
  title: "HypothesisNode",
  component: HypothesisNode,
  parameters: { actions: { argTypesRegex: "^on.*" } },
  decorators: [(Story) => <Story />]
} as ComponentMeta<typeof HypothesisNode>;

const Template: ComponentStory<typeof HypothesisNode> = (arg: any) => (
  <QueryClientProvider client={defaultQueryClient}>
    <HypothesisNode {...arg} />
  </QueryClientProvider>
);

export const Base = Template.bind({});
Base.args = {
  node: sampleIncidentNode,
  setSelectedNode: () => {},
  setCreateHypothesisModalIsOpen: () => {}
};
