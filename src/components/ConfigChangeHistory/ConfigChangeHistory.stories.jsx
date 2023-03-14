import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ConfigChangeHistory } from "./index";

export default {
  title: "ConfigChangeHistory",
  component: ConfigChangeHistory,
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
};

const Template = (args) => <ConfigChangeHistory {...args} />;

export const Default = Template.bind({});

const codeSample = (x) => ({
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
    change_type: "diff",
    summary: `Summary - ${i}`,
    created_at: new Date(),
    config_id: `id-${i}`,
    patches: codeSample(i)
  }));

Default.args = { data: Array.from(data), isLoading: false };

export const WithConfigLink = Template.bind({});

WithConfigLink.args = {
  data: Array.from(data),
  isLoading: false,
  linkConfig: true
};
