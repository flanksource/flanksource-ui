import { QueryBuilder } from "./index";

export default {
  title: "QueryBuilder",
  component: QueryBuilder
};

const Template = (arg) => <QueryBuilder {...arg} />;

export const Variant1 = Template.bind({});
Variant1.args = {};
