import { MemoryRouter } from "react-router-dom";
import { Canary } from "./index";

export default {
  title: "Canary",
  component: Canary,
  argTypes: {},
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    )
  ]
};

const Template = (arg) => <Canary {...arg} />;

export const Variant1 = Template.bind({});
Variant1.args = {
  url: "/api/canary/api",
  refreshInterval: 15 * 1000,
  topLayoutOffset: 0,
  hideSearch: false,
  hideTimeRange: false
};
