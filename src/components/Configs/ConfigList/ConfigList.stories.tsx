import { ComponentMeta, ComponentStory } from "@storybook/react";
import { ConfigItem } from "../../../api/types/configs";
import sampleConfigList from "../../../data/sampleConfigList";
import ConfigsTable from "./ConfigsTable";

export default {
  title: "ConfigList",
  component: ConfigsTable,
  decorators: [(Story) => <Story />]
} as ComponentMeta<typeof ConfigsTable>;

const Template: ComponentStory<typeof ConfigsTable> = (args) => (
  <ConfigsTable {...args} />
);

export const Default = Template.bind({});
Default.args = {
  data: sampleConfigList
};

const thirtyDayCostConfigs: ConfigItem[] = [
  {
    id: "production-postgres",
    name: "production-postgres",
    type: "Kubernetes::StatefulSet",
    health: "healthy",
    status: "Ready",
    changes: 3,
    cost_per_minute: 0.0083,
    cost_1d: 12,
    cost_30d: 360,
    created_at: "2026-07-18T10:00:00Z",
    updated_at: "2026-08-21T14:30:00Z"
  },
  {
    id: "payments-api",
    name: "payments-api",
    type: "Kubernetes::Deployment",
    health: "healthy",
    status: "Ready",
    changes: 1,
    cost_per_minute: 0.0042,
    cost_1d: 6,
    cost_30d: 180,
    created_at: "2026-07-24T08:00:00Z",
    updated_at: "2026-08-21T14:45:00Z"
  }
];

export const ThirtyDayCosts = Template.bind({});
ThirtyDayCosts.args = {
  data: thirtyDayCostConfigs,
  isLoading: false,
  columnsToHide: ["type", "tags", "analysis", "created_at", "updated_at"],
  totalRecords: thirtyDayCostConfigs.length,
  pageCount: 1
};
