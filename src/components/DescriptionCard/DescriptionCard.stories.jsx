import { DescriptionCard } from "./index";

export default {
  title: "DescriptionCard",
  component: DescriptionCard
};

const Template = (arg) => <DescriptionCard {...arg} />;

export const Variant1 = Template.bind({});
Variant1.args = {
  title: "title",
  subtitle: "subtitle",
  items: [
    { key: "1", colspan: "1", name: "name1", value: 22 },
    { key: "2", colspan: "1", name: "name2", value: 24 },
    { key: "3", colspan: "1", name: "name3", value: 232 }
  ]
};
