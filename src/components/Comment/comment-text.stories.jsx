import { CommentText } from "./index";

export default {
  title: "CommentText",
  component: CommentText
};

const Template = (arg) => <CommentText {...arg} />;

export const Variant1 = Template.bind({});
Variant1.args = {
  text: "text",
  onClickTag: () => alert("hello!")
};
