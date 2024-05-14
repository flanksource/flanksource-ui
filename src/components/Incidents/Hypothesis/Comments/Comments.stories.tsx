import { ComponentMeta, ComponentStory } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import dayjs from "dayjs";
import { CommentsSection } from "./index";

const defaultQueryClient = new QueryClient();

export default {
  title: "CommentsSection",
  component: CommentsSection,
  parameters: { actions: { argTypesRegex: "^on.*" } }
} as ComponentMeta<typeof CommentsSection>;

const Template: ComponentStory<typeof CommentsSection> = (arg: any) => (
  <QueryClientProvider client={defaultQueryClient}>
    <CommentsSection {...arg} />
  </QueryClientProvider>
);

export const Base = Template.bind({});
Base.args = {
  comments: []
};

export const FewComments = Template.bind({});
FewComments.args = {
  comments: [0, 1, 2, 3, 4].map((i) => ({
    id: `id-${i}`,
    comment: `Test comment ${i}`,
    name: `User ${i}`,
    created_by: {
      id: `id-${i}`,
      name: `User ${i}`,
      email: `user${i}@test.com`,
      avatar: `https://i.pravatar.cc/150?u=${i}`
    },
    incident_id: "i-124",
    hypothesis_id: "h-123",
    updated_at: dayjs().toString(),
    created_at: dayjs()
      .subtract(Math.max(i - 1, 0), "day")
      .toString()
  }))
};
