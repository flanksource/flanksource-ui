import { Card } from "./index";

export default {
  title: "Card",
  component: Card
};

const Template = (arg) => <Card {...arg} />;

export const Variant1 = Template.bind({});
Variant1.args = {
  cards: []
};
