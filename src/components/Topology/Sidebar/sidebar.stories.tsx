import TopologyDetails from "./TopologyDetails";
import topology from "../../../data/topology.json";
import { StoryObj } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";

export default {
  title: "TopologySidebar",
  component: TopologyDetails
};

const queryClient = new QueryClient();

type Story = StoryObj<typeof TopologyDetails>;

export const Default: Story = {
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <Story />
        </MemoryRouter>
      </QueryClientProvider>
    )
  ],
  render: () => <TopologyDetails topology={topology} isCollapsed={false} />
};
