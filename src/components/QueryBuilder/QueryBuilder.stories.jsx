import { MemoryRouter } from "react-router-dom";
import { QueryBuilder } from "./index";

export default {
  title: "QueryBuilder",
  component: QueryBuilder,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    )
  ]
};

const Template = (arg) => <QueryBuilder {...arg} />;

export const Variant1 = Template.bind({});
Variant1.args = {};
