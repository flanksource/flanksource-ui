import { ComponentMeta, ComponentStory } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HypothesisStatus } from "../../../../api/types/hypothesis";
import { HypothesisBarMenu } from "./index";

const defaultQueryClient = new QueryClient();

export default {
  title: "HypothesisBar/HypothesisBarMenu",
  component: HypothesisBarMenu,
  parameters: { actions: { argTypesRegex: "^on.*" } }
} as ComponentMeta<typeof HypothesisBarMenu>;

const Template: ComponentStory<typeof HypothesisBarMenu> = (arg: any) => (
  <QueryClientProvider client={defaultQueryClient}>
    <div className="flex w-96 justify-between rounded border p-2">
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
    type: "factor",
    id: "123",
    incident_id: "1234"
  },
  onDisprove: () => {}
};
