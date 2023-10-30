import { ComponentMeta, ComponentStory } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HypothesisStatus } from "../../../api/types/hypothesis";
import { HypothesisBar } from "./index";

const defaultQueryClient = new QueryClient();

export default {
  title: "HypothesisBar",
  component: HypothesisBar
} as ComponentMeta<typeof HypothesisBar>;

const Template: ComponentStory<typeof HypothesisBar> = (arg: any) => (
  <QueryClientProvider client={defaultQueryClient}>
    <HypothesisBar {...arg} />
  </QueryClientProvider>
);

export const Basic = Template.bind({});

Basic.args = {
  hypothesis: {
    id: "h-123",
    incident_id: "i-1232",
    title: "Test Hypothesis",
    status: HypothesisStatus.Proven,
    type: "root",
    created_by: {
      id: "124",
      name: "Galileo Galilei",
      email: "galilei@flanksource.com",
      avatar: "https://i.pravatar.cc/300"
    },
    comment: [
      {
        id: "c-123",
        created_by: {
          id: "456",
          name: "Issac Newton",
          email: "issac@flanksource.com",
          avatar: "https://i.pravatar.cc/301"
        }
      }
    ]
  }
};
