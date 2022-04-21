import { Table } from "./index";

export default {
  title: "Table",
  component: Table
};

const dataExample = [
  {
    id: 0,
    type: "tags",
    person: { name: "Hilary Mahy", href: "#" },
    tags: [
      { name: "Bug", href: "#", color: "bg-red-500" },
      { name: "Accessibility", href: "#", color: "bg-indigo-500" }
    ],
    date: "6h ago"
  },
  {
    id: 1,
    type: "assignment",
    person: { name: "Hilary Mahy", href: "#" },
    assigned: { name: "Kristin Watson", href: "#" },
    tags: [
      { name: "Bug", href: "#", color: "bg-red-500" },
      { name: "Accessibility", href: "#", color: "bg-indigo-500" }
    ],
    date: "2d ago"
  },
  {
    id: 1,
    type: "assignment",
    person: { name: "Hilary Mahy", href: "#" },
    assigned: { name: "Kristin Watson", href: "#" },
    date: "2d ago"
  },

  {
    id: 1,
    type: "comment",
    person: { name: "Eduardo Benz", href: "#" },
    imageUrl:
      "https://images.unsplash.com/photo-1520785643438-5bf77931f493?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80",
    comment:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tincidunt nunc ipsum tempor purus vitae id. Morbi in vestibulum nec varius. Et diam cursus quis sed purus nam. ",
    date: "6d ago"
  },
  {
    id: -1,
    type: "comment",
    person: { name: "Eduardo Benz", href: "#" },
    imageUrl:
      "https://images.unsplash.com/photo-1520785643438-5bf77931f493?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80",
    comment:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tincidunt nunc ipsum tempor purus vitae id. Morbi in vestibulum nec varius. Et diam cursus quis sed purus nam. ",
    date: "6d ago"
  },

  {
    id: 3,
    type: "tags",
    person: { name: "Hilary Mahy", href: "#" },
    tags: [
      { name: "Bug", href: "#", color: "bg-red-500" },
      { name: "Accessibility", href: "#", color: "bg-indigo-500" }
    ],
    date: "6h ago"
  }
];

const Template = (arg) => <Table {...arg} />;

export const Variant1 = Template.bind({});
Variant1.args = {
  data: dataExample,
  columns: ["Type", "Comment", "Role"],
  id: "12"
};
