import { Card } from "./index";

export default {
  title: "Card",
  component: Card
};

const cardsExample = [
  {
    title: "Graph API",
    initials: "GA",
    href: "#",
    subtitle: "Soething else",
    bgColor: "bg-pink-600"
  },
  {
    title: "Component Design",
    initials: "CD",
    href: "#",
    bgColor: "bg-purple-600"
  },
  {
    title: "Templates",
    initials: "T",
    href: "#",
    bgColor: "bg-yellow-500",
    icon: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  {
    title: "React Components",
    initials: "RC",
    href: "#",
    bgColor: "bg-green-500"
  }
];

const Template = (arg) => <Card {...arg} />;

export const Variant1 = Template.bind({});
Variant1.args = {
  cards: cardsExample
};
