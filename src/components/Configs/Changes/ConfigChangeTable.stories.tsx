import { Meta, StoryFn } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import { ConfigChange } from "../../../api/types/configs";
import { ConfigChangeTable } from "./ConfigChangeTable";

export default {
  title: "ConfigChangeHistory",
  component: ConfigChangeTable,
  decorators: [
    (Story) => {
      const queryClient = new QueryClient();
      return (
        <MemoryRouter>
          <QueryClientProvider client={queryClient}>
            <Story />
          </QueryClientProvider>
        </MemoryRouter>
      );
    }
  ]
} satisfies Meta<typeof ConfigChangeTable>;

const Template: StoryFn<typeof ConfigChangeTable> = (args) => (
  <ConfigChangeTable {...args} />
);

export const Default = Template.bind({});

const codeSample = (x: number) => ({
  sample: `${x}`,
  key: "value",
  another_key: "another_value",
  nested: {
    nk: "nested_val"
  },
  arr: [1, 2, 3],
  num_val: 2
});

const data = Array(10)
  .fill(0)
  .map((_, i) => ({
    id: `id-${i}`,
    created_by: {
      id: `id-${i}`,
      email: `email-${i}`,
      name: `name-${i}`
    },
    details: "",
    external_change_id: `id-${i}`,
    source: "source",
    external_created_by: "external_created_by",
    config_type: "config_type",
    severity: "severity",
    change_type: "diff",
    summary: `Summary - ${i}`,
    created_at: new Date(),
    config_id: `id-${i}`,
    patches: codeSample(i)
  })) as unknown as ConfigChange[];

Default.args = { data: Array.from(data), isLoading: false };

export const WithConfigLink = Template.bind({});

WithConfigLink.args = {
  data: Array.from(data),
  isLoading: false,
  linkConfig: true
};
