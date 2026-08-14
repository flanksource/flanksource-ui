import { Meta, StoryFn } from "@storybook/react";
import { useSearchParams } from "react-router-dom";
import { ConfigChange } from "../../../api/types/configs";
import { ConfigChangeTable } from "./ConfigChangeTable";

export default {
  title: "Catalog/Changes/ConfigChangeTable",
  component: ConfigChangeTable,
  parameters: {
    layout: "fullscreen"
  },
  decorators: [
    (Story) => {
      return (
        <div className="flex h-screen min-h-[500px] w-full p-4">
          <Story />
        </div>
      );
    }
  ]
} satisfies Meta<typeof ConfigChangeTable>;

const Template: StoryFn<typeof ConfigChangeTable> = (args) => {
  const [params] = useSearchParams();
  const tagFilters = (params.get("tags")?.split(",") ?? []).map((filter) => {
    const [tag, action] = filter.split(":");
    const [key, value] = tag.split("____");
    return { key, value, exclude: action === "-1" };
  });
  const filteredData = args.data.filter((change) =>
    tagFilters.every(({ key, value, exclude }) => {
      const matches = String(change.tags?.[key]) === value;
      return exclude ? !matches : matches;
    })
  );

  return (
    <ConfigChangeTable
      {...args}
      data={filteredData}
      totalRecords={filteredData.length}
    />
  );
};

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
    details: "",
    external_change_id: `id-${i}`,
    source: "source",
    external_created_by: i % 2 === 0 ? "kubernetes/" : "source-controller",
    config_type: "config_type",
    severity: "severity",
    change_type: i % 3 === 0 ? "PolicyViolation" : "diff",
    summary:
      i % 3 === 0
        ? "Policy require-run-as-nonroot failed: validation error: running as root is not allowed"
        : `status.history changed for catalog item ${i}`,
    created_at: `2026-08-14T15:34:${String(i).padStart(2, "0")}.000Z`,
    first_observed: "2026-08-14T13:34:00.000Z",
    count: i % 2 === 0 ? 12 : 1,
    config_id: `config-${i}`,
    config: {
      id: `config-${i}`,
      name: i % 2 === 0 ? "config-db-6db85d9c9-k5m2r" : "immich",
      type: i % 3 === 0 ? "Kubernetes::Pod" : "Kubernetes::Kustomization"
    },
    tags: {
      cluster: "homelab",
      namespace: i % 3 === 0 ? "mission-control" : "flux-system",
      environment: "production",
      team: i % 2 === 0 ? "platform" : "applications"
    },
    patches: JSON.stringify(codeSample(i))
  })) satisfies ConfigChange[];

Default.args = {
  data: Array.from(data),
  isLoading: false,
  totalRecords: data.length,
  numberOfPages: 1
};

export const WithConfigLink = Template.bind({});

WithConfigLink.args = {
  data: Array.from(data),
  isLoading: false,
  totalRecords: data.length,
  numberOfPages: 1
};
