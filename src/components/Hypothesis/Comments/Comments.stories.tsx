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
