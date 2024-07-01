import { ComponentMeta, ComponentStory } from "@storybook/react";
import { MemoryRouter } from "react-router-dom";
import { SchemaResourceWithJobStatus } from "../../api/schemaResources";
import { SchemaResourceList } from "./SchemaResourceList";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default {
  title: "SchemaResourceList",
  component: SchemaResourceList,
  parameters: { actions: { argTypesRegex: "^on.*" } },
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <Story />
        </MemoryRouter>
      </QueryClientProvider>
    )
  ]
} as ComponentMeta<typeof SchemaResourceList>;

const Template: ComponentStory<typeof SchemaResourceList> = (arg: any) => (
  <SchemaResourceList {...arg} />
);

const genItem = (suffix: string): SchemaResourceWithJobStatus => ({
  integration_type: "scrapers",
  name: `item ${suffix}`,
  spec: { a: suffix, b: 2 },
  created_at: "asd",
  updated_at: "ass",
  namespace: "default",
  labels: {},
  source: "",
  id: "asdas"
});

export const Base = Template.bind({});
Base.args = {
  items: [genItem("1"), genItem("two"), genItem("another")]
};
