import { ComponentMeta, ComponentStory } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "react-query";
import {
  HypothesisNodeType,
  HypothesisStatus
} from "../../../api/services/hypothesis";
import { HypothesisBarMenu } from "./index";

const defaultQueryClient = new QueryClient();

export default {
  title: "HypothesisBar/HypothesisBarMenu",
  component: HypothesisBarMenu,
  parameters: { actions: { argTypesRegex: "^on.*" } }
} as ComponentMeta<typeof HypothesisBarMenu>;

const Template: ComponentStory<typeof HypothesisBarMenu> = (arg: any) => (
  <QueryClientProvider client={defaultQueryClient}>
    <div className="w-96 border rounded p-2 flex justify-between">
      <span>A menu item</span>
      <HypothesisBarMenu {...arg} />
    </div>
  </QueryClientProvider>
);

export const Base = Template.bind({});
Base.args = {
  hypothesis: {
    title: "hypothesis",
    status: HypothesisStatus.Likely,
    type: HypothesisNodeType.Factor,
    id: "123",
    incident_id: "1234"
  },
  onDisprove: () => {}
};
