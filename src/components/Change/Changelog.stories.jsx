import { Changelog } from "./index";

export default {
  title: "Change",
  component: Changelog
};

const Template = (arg) => <Changelog {...arg} />;

export const Variant1 = Template.bind({});
