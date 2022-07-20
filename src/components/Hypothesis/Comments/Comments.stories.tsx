import { ComponentMeta, ComponentStory } from "@storybook/react";
import dayjs from "dayjs";
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
  comments: [0, 1, 2, 3, 4].map((i) => {
    return {
      id: `id-${i}`,
      comment: `Test comment ${i}`,
      name: `User ${i}`,
      created_by: {
        id: `id-${i}`,
        name: `User ${i}`,
        email: "test@gmail.com",
        avatar: `https://i.pravatar.cc/150?u=${i}`
      },
      incident_id: "11111",
      hypothesis_id: "11111",
      created_at: dayjs()
        .subtract(Math.max(i - 1, 0), "day")
        .toString(),
      updated_at: dayjs()
        .subtract(Math.max(i - 1, 0), "day")
        .toString()
    };
  })
};
