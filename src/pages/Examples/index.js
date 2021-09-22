import {
  MailIcon,
  PlusCircleIcon,
  QuestionMarkCircleIcon,
  PlusIcon as PlusIconSolid
} from "@heroicons/react/solid";
import { Badge } from "../../components/Badge";
import { Button } from "../../components/Button";

import { Card, HorizontalCard } from "../../components/Card";
import { DescriptionCard } from "../../components/DescriptionCard";
import { Status } from "../../components/Status";
import { Feed } from "../../components/Feed";
import { Icon, Avatar } from "../../components/Icon";
import { Table } from "../../components/Table";
import { Input } from "../../components/Input";
import { Icons } from "../../icons";

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

/* This example requires Tailwind CSS v2.0+ */
const data = [
  {
    name: "Jane Cooper",
    title: "Regional Paradigm Technician",
    department: "Optimization",
    role: "Admin",
    email: "jane.cooper@example.com",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60"
  },
  // More people...

  {
    name: "Jane Cooper",
    title: "Regional Paradigm Technician",
    department: "Optimization",
    role: "Admin",
    email: "jane.cooper@example.com",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60"
  }
  // More people...
];

const cards = [
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
    bgColor: "bg-purple-600",
    icon: MailIcon
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

const items = [
  { name: "Name", value: "John DOe" },
  { name: "Age", value: 12 },

  {
    name: "Parent",
    value: <Input label="Leading" type="email" leadingIcon={MailIcon} />
  },
  {
    name: "Parent",
    value: (
      <Input
        label="Name"
        help="just your name for now"
        trailingIcon={QuestionMarkCircleIcon}
      />
    )
  },
  {
    name: "Parent",
    value: (
      <Input
        label="Email"
        error="just your name for now"
        type="email"
        leadingIcon={PlusCircleIcon}
      />
    )
  },
  { name: "Parent", value: <Input label="Website" prefix="https://" /> },

  {
    colspan: 2,
    name: "Adrdress",
    value: `
123 President City
Main City
  `
  }
];

export function Examples() {
  return (
    <div className="flex justify-center">
      <main className="flex flex-col max-w-7xl">
        <h1 className="py-12">Components</h1>
        <section className="p-8 rounded-md shadow-md mb-12 border border-gray-200">
          <h4>Icon</h4>
          <div className="mt-4 bg-gray-50 p-8 rounded-md">
            <Icon icon={Icons.s3} />
            <Icon name="s3" />
            <Icon name="mongo" />
            <Status good />
            <Status good={false} className="h-16 w-16" />
            <Status mixed className="h-16 w-16" />
          </div>
        </section>

        <section className="p-8 rounded-md shadow-md mb-12 border border-gray-200">
          <h4>Badge</h4>
          <div className="mt-4 bg-gray-50 p-8 rounded-md">
            <Badge text="small" size="xs" />
            <Badge text="large" size="sm" />
            <Badge text="small" size="xs" dot="#green" />
            <Badge text="large" size="sm" dot="#ff0000" />
            <Badge text="large" size="sm" dot="currentColor" />
          </div>
        </section>
        <section className="p-8 rounded-md shadow-md mb-12 border border-gray-200">
          <h4>Button</h4>
          <div className="mt-4 bg-gray-50 p-8 rounded-md">
            <Button text="small" size="xs" />
            <Button text="large" size="sm" />
            <Button text="medium" size="md" />
            <Button text="large" size="lg" />
            <Button text="x-large" size="xl" />

            <Button text="small" size="xs" icon={MailIcon} />
            <Button text="large" size="sm" leadingIcon={MailIcon} />
            <Button text="medium" size="md" icon={PlusIconSolid} />

            <Button text="medium" size="lg" icon={PlusIconSolid} />
          </div>
        </section>

        <section className="p-8 rounded-md shadow-md mb-12 border border-gray-200">
          <h4>Card</h4>
          <div className="mt-4 bg-gray-50 p-8 rounded-md">
            <Card cards={cards} className="grid-cols-2" />
          </div>
        </section>

        <section className="p-8 rounded-md shadow-md mb-12 border border-gray-200">
          <h4>Horizontal Card</h4>
          <div className="mt-4 bg-gray-50 p-8 rounded-md">
            <HorizontalCard cards={cards} />
          </div>
        </section>

        <section className="p-8 rounded-md shadow-md mb-12 border border-gray-200">
          <h4>Description</h4>
          <div className="mt-4 bg-gray-50 p-8 rounded-md">
            <DescriptionCard
              items={items}
              title="Canary Checker"
              subtitle="Namespace xyz"
            />
          </div>
        </section>

        <section className="p-8 rounded-md shadow-md mb-12 border border-gray-200">
          <h4>Table</h4>
          <div className="mt-4 bg-gray-50 p-8 rounded-md">
            <Table
              data={data}
              columns={["Name", "Title", "Department", "Role"]}
            />
            <Table data={activity} columns={["Type", "Comment", "Role"]} />
          </div>
        </section>

        <section className="p-8 rounded-md shadow-md mb-12 border border-gray-200">
          <h4>Feed</h4>
          <div className="mt-4 bg-gray-50 p-8 rounded-md">
            <Feed items={activity} />
          </div>
        </section>
      </main>
    </div>
  );
}
