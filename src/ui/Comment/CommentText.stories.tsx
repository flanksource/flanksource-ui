import { ComponentMeta, ComponentStory } from "@storybook/react";
import { CommentText } from "./index";

export default {
  title: "CommentText",
  component: CommentText,
  parameters: { actions: { argTypesRegex: "^on.*" } }
} as ComponentMeta<typeof CommentText>;

const Template: ComponentStory<typeof CommentText> = (arg: any) => (
  <CommentText {...arg} />
);

export const Base = Template.bind({});
Base.args = {
  text: "@[Marcus Aurelius Antoninus](user:marcus) was Roman emperor from 161 to 180 and a Stoic philosopher. He was the last of the rulers known as the Five Good Emperors, and the last emperor of the Pax Romana, an age of relative peace and stability for the Roman Empire lasting from 27 BC to 180 AD.",
  // eslint-disable-next-line no-alert
  onClickTag: (typ, user) => {
    console.log("tag clicked", typ, user);
  }
};

export const WithoutOnClick = Template.bind({});
WithoutOnClick.args = {
  text: "@[Marcus Aurelius Antoninus](user:marcus) was Roman emperor from 161 to 180 and a Stoic philosopher. He was the last of the rulers known as the Five Good Emperors, and the last emperor of the Pax Romana, an age of relative peace and stability for the Roman Empire lasting from 27 BC to 180 AD."
};
