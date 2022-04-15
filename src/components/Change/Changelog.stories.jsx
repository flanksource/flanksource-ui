import { Changelog } from "./index";

// export default required by storybook
// eslint-disable-next-line import/no-default-export
export default {
  title: "Change",
  component: Changelog
};

const Template = (arg) => <Changelog {...arg} />;

export const Variant1 = Template.bind({});
