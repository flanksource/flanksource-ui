import Badge from "../../components/Badge";
import Button from "../../components/Button";
import Toggle from "../../components/Toggle";

import {
  MailIcon,
  PlusCircleIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/solid";
import { PlusIcon as PlusIconSolid } from "@heroicons/react/solid";
import { Card, HorizontalCard } from "../../components/Card";
import Description from "../../components/DescriptionCard";
import Dropdown from "../../components/Dropdown";
import Status from "../../components/Status";
import Feed from "../../components/Feed";
import Icon, { Avatar } from "../../components/Icon";
import Table from "../../components/Table";
import Input from "../../components/Input";

import { ExclamationCircleIcon } from "@heroicons/react/solid";
import { Icons } from "../../icons";
import Canary from "../../components/Canary";

import canaries from "../../data/checks.json";
import { checkStream } from "ssri";
import Dialog from "../../components/Modal";
import Modal from "../../components/Modal";
import { CanaryDescription } from "../../components/Canary/description";
import { Title } from "../../components/Canary/data";

const activity = [
  {
    id: 0,
    type: "tags",
    person: { name: "Hilary Mahy", href: "#" },
    tags: [
      { name: "Bug", href: "#", color: "bg-red-500" },
      { name: "Accessibility", href: "#", color: "bg-indigo-500" },
    ],
    date: "6h ago",
  },
  {
    id: 1,
    type: "assignment",
    person: { name: "Hilary Mahy", href: "#" },
    assigned: { name: "Kristin Watson", href: "#" },
    person: { name: "Hilary Mahy", href: "#" },
    tags: [
      { name: "Bug", href: "#", color: "bg-red-500" },
      { name: "Accessibility", href: "#", color: "bg-indigo-500" },
    ],
    date: "2d ago",
  },
  {
    id: 1,
    type: "assignment",
    person: { name: "Hilary Mahy", href: "#" },
    assigned: { name: "Kristin Watson", href: "#" },
    date: "2d ago",
  },

  {
    id: 1,
    type: "comment",
    person: { name: "Eduardo Benz", href: "#" },
    imageUrl:
      "https://images.unsplash.com/photo-1520785643438-5bf77931f493?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80",
    comment:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tincidunt nunc ipsum tempor purus vitae id. Morbi in vestibulum nec varius. Et diam cursus quis sed purus nam. ",
    date: "6d ago",
  },
  {
    id: -1,
    type: "comment",
    person: { name: "Eduardo Benz", href: "#" },
    imageUrl:
      "https://images.unsplash.com/photo-1520785643438-5bf77931f493?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80",
    comment:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tincidunt nunc ipsum tempor purus vitae id. Morbi in vestibulum nec varius. Et diam cursus quis sed purus nam. ",
    date: "6d ago",
  },

  {
    id: 3,
    type: "tags",
    person: { name: "Hilary Mahy", href: "#" },
    tags: [
      { name: "Bug", href: "#", color: "bg-red-500" },
      { name: "Accessibility", href: "#", color: "bg-indigo-500" },
    ],
    date: "6h ago",
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
      { name: "Accessibility", href: "#", color: "bg-indigo-500" },
    ],
    date: "2h ago",
  },
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
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
  },
  // More people...

  {
    name: "Jane Cooper",
    title: "Regional Paradigm Technician",
    department: "Optimization",
    role: "Admin",
    email: "jane.cooper@example.com",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
  },
  // More people...
];

const cards = [
  {
    title: "Graph API",
    initials: "GA",
    href: "#",
    subtitle: "Soething else",
    bgColor: "bg-pink-600",
  },
  {
    title: "Component Design",
    initials: "CD",
    href: "#",
    bgColor: "bg-purple-600",
    icon: MailIcon,
  },
  {
    title: "Templates",
    initials: "T",
    href: "#",
    bgColor: "bg-yellow-500",
    icon: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    title: "React Components",
    initials: "RC",
    href: "#",
    bgColor: "bg-green-500",
  },
];

const people = [
  { id: 1, name: "Wade Cooper", icon: <Status state="ok" /> },
  { id: 2, name: "Arlene Mccoy", online: false },
  { id: 3, name: "Devon Webb", icon: <Status state="ok" /> },
  { id: 4, name: "Tom Cook", icon: <Status state="bad" /> },
  { id: 5, name: "Tanya Fox", icon: <Status /> },
  { id: 6, name: "Hellen Schmidt", online: true },
  { id: 7, name: "Caroline Schultz", online: true },
  { id: 8, name: "Mason Heaney", online: false },
  { id: 9, name: "Claudie Smitham", online: true },
  { id: 10, name: "Emil Schaefer", online: false },
];

const items = [
  { name: "Name", value: "John DOe" },
  { name: "Active", value: <Toggle enabled={true} /> },
  { name: "Age", value: 12 },

  { name: "Parent", value: <Dropdown items={people} /> },
  {
    name: "Parent",
    value: <Input label="Leading" type="email" leadingIcon={MailIcon} />,
  },
  {
    name: "Parent",
    value: (
      <Input
        label="Name"
        help="just your name for now"
        trailingIcon={QuestionMarkCircleIcon}
      />
    ),
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
    ),
  },
  { name: "Parent", value: <Input label="Website" prefix="https://" /> },
  { name: "Parent", value: <Dropdown items={people} /> },
  { name: "Parent", value: <Dropdown items={people} /> },

  {
    colspan: 2,
    name: "Adrdress",
    value: `
123 President City
Main City
  `,
  },
];

export default function Examples() {
  return (
    <div className="flex justify-center">
      <main className="flex flex-col max-w-7xl">
        <h1 className="py-12">Components</h1>
        <section className="p-8 rounded-md shadow-md mb-12 border border-gray-200">
          <h4>Icon</h4>
          <div className="mt-4 bg-gray-50 p-8 rounded-md">
            <Icon icon={Icons.s3} />
          </div>
        </section>
        <section className="p-8 rounded-md shadow-md mb-12 border border-gray-200">
          <h4 className="mb-4">Toggle</h4>
          <div className="mt-4 bg-gray-50 p-8 rounded-md">
            <Toggle label="toggle1" />
            <Toggle label="toggle2" help="lorem ipsum" />
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
          <h4>Canary</h4>
          <div className="mt-4 bg-gray-50 p-8 rounded-md">
            <Canary checks={canaries.checks} />
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
            <Description
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

        {/* <section className="p-8 rounded-md shadow-md mb-12 border border-gray-200">
          <h4>Modal</h4>
          <div className="mt-4 bg-gray-50 p-8 rounded-md">
            <Modal
              submitText=""
              title={<Title check={[]} />}
              body={<CanaryDescription check={[]} />}
              open={true}
            />
          </div>
        </section>

        <section className="p-8 rounded-md shadow-md mb-12 border border-gray-200">
          <h4>Canary Description</h4>
          <div className="mt-4 bg-gray-50 p-8 rounded-md">
            <CanaryDescription check={[]} />
          </div>
        </section> */}
      </main>
    </div>
  );
}
