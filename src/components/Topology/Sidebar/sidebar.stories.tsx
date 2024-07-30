import { StoryObj } from "@storybook/react";
import topology from "../../../data/topology.json";
import TopologyDetails from "./TopologyDetails";

export default {
  title: "TopologySidebar",
  component: TopologyDetails
};

type Story = StoryObj<typeof TopologyDetails>;

export const Default: Story = {
  decorators: [(Story) => <Story />],
  render: () => <TopologyDetails topology={topology} isCollapsed={false} />
};
