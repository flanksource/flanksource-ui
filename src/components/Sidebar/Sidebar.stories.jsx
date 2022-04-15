import { Sidebar } from "./index";

// export default required by storybook
// eslint-disable-next-line import/no-default-export
export default {
  title: "Sidebar",
  component: Sidebar
};

const Template = (arg) => <Sidebar {...arg} />;

export const Variant1 = Template.bind({});
Variant1.args = {
  animated: true
};
