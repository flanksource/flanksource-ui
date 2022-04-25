import { Avatar } from "../Icon";
import { Feed } from "./index";

export default {
  title: "Feed",
  component: Feed
};

const activity = [
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
  },
  {
    id: 4,
    type: "comment",
    person: { name: "Jason Meyers", href: "#" },
    icon: (
      <Avatar url="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80" />
    ),
    comment:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tincidunt nunc ipsum tempor purus vitae id. Morbi in vestibulum nec varius. Et diam cursus quis sed purus nam. Scelerisque amet elit non sit ut tincidunt condimentum. Nisl ultrices eu venenatis diam.",
    tags: [
      { name: "Bug", href: "#", color: "bg-red-500" },
      { name: "Accessibility", href: "#", color: "bg-indigo-500" }
    ],
    date: "2h ago"
  }
];

const Template = (arg) => <Feed {...arg} />;

export const Variant1 = Template.bind({});
Variant1.args = {
  items: activity
};
