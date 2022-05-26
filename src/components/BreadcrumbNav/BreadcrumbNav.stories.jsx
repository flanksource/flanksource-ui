import { MemoryRouter } from "react-router-dom";

import { AiFillPlusCircle } from "react-icons/ai/";
import { BreadcrumbNav } from "./index";

export default {
  title: "BreadcrumbNav",
  component: BreadcrumbNav,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    )
  ]
};

const Template = (arg) => <BreadcrumbNav {...arg} />;

export const Default = Template.bind({});

Default.args = {
  list: ["Incidents", "124"]
};

export const WithComponentBreadcrumb = Template.bind({});

WithComponentBreadcrumb.args = {
  list: [
    "Incidents",
    <div key="comp" className="flex inline">
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
    <div key="comp" className="flex inline">
      <button type="button" className="" onClick={() => {}}>
        <AiFillPlusCircle size={36} color="#326CE5" />
      </button>
    </div>
  ]
};
