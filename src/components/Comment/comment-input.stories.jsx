import { CommentInput } from "./index";

export default {
  title: "CommentInput",
  component: CommentInput
};

const Template = (arg) => <CommentInput {...arg} />;

export const Variant1 = Template.bind({});
