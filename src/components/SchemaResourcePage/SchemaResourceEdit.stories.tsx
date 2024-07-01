import { Meta, StoryFn } from "@storybook/react";
import { MemoryRouter } from "react-router-dom";
import { SchemaResourceEdit } from "./SchemaResourceEdit";
import { schemaResourceTypes } from "./resourceTypes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default {
  title: "SchemaResourceEdit",
  component: SchemaResourceEdit,
  parameters: { actions: { argTypesRegex: "^on.*" } }
} as Meta<typeof SchemaResourceEdit>;

const Template: StoryFn<typeof SchemaResourceEdit> = (arg: any) => (
  <QueryClientProvider client={queryClient}>
    <MemoryRouter>
      <SchemaResourceEdit {...arg} />
    </MemoryRouter>
  </QueryClientProvider>
);

export const Base = Template.bind({});
Base.args = {
  resourceInfo: schemaResourceTypes[0]
};
