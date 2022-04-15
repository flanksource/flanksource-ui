import { CommentInput } from "./index";

// export default required by storybook
// eslint-disable-next-line import/no-default-export
export default {
  title: "CommentInput",
  component: CommentInput
};

const Template = (arg) => <CommentInput {...arg} />;

export const Variant1 = Template.bind({});
