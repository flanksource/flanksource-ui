import { ComponentMeta, ComponentStory } from "@storybook/react";
import { CommentsSection } from "./index";

export default {
  title: "CommentsSection",
  component: CommentsSection,
  parameters: { actions: { argTypesRegex: "^on.*" } }
} as ComponentMeta<typeof CommentsSection>;

const Template: ComponentStory<typeof CommentsSection> = (arg: any) => (
  <CommentsSection {...arg} />
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
      avatar: `https://i.pravatar.cc/150?u=${i}`
    },
    created_at: new Date(Date.now()).toISOString()
  }))
};
