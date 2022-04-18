import { Avatar } from "./index";

export default {
  title: "Avatar",
  component: Avatar
};

const Template = (arg) => <Avatar {...arg} />;

export const Variant1 = Template.bind({});
Variant1.args = {
  size: "md",
  unload: undefined,
  user: {
    id: 1,
    name: "Test test",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=3&w=256&h=256&q=80"
  },
  alt: "",
  containerProps: {},
  imageProps: {}
};
