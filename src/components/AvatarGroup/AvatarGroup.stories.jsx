import { AvatarGroup } from "./index";

export default {
  title: "AvatarGroup",
  component: AvatarGroup
};

const Template = (arg) => <AvatarGroup {...arg} />;

export const Variant1 = Template.bind({});
Variant1.args = {
  size: "md",
  users: [
    {
      id: 1,
      name: "Falcon",
      avatar:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=3&w=256&h=256&q=80"
    },
    {
      id: 2,
      name: "Spider",
      avatar: null
    }
  ],
  maxCount: 2
};
