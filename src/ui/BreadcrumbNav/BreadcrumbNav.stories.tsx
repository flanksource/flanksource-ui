import { ComponentMeta, ComponentStory } from "@storybook/react";
import { AiFillPlusCircle } from "react-icons/ai";
import { BreadcrumbNav } from "./index";

export default {
  title: "BreadcrumbNav",
  component: BreadcrumbNav,
  decorators: [(Story) => <Story />]
} as ComponentMeta<typeof BreadcrumbNav>;

const Template: ComponentStory<typeof BreadcrumbNav> = (arg) => (
  <BreadcrumbNav {...arg} />
);

export const Default = Template.bind({});

Default.args = {
  list: ["Incidents", "124"]
};

export const WithComponentBreadcrumb = Template.bind({});

WithComponentBreadcrumb.args = {
  list: [
    "Incidents",
    <div key="comp" className="inline flex">
      <button type="button" className="" onClick={() => {}}>
        <AiFillPlusCircle size={36} color="#326CE5" />
      </button>
    </div>
  ]
};

export const WithCompAndLink = Template.bind({});

WithCompAndLink.args = {
  list: [
    "Home",
    { to: "/incidents", title: "Incidents" },
    <div key="comp" className="inline flex">
      <button type="button" className="" onClick={() => {}}>
        <AiFillPlusCircle size={36} color="#326CE5" />
      </button>
    </div>
  ]
};
