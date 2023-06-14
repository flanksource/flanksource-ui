import { MemoryRouter } from "react-router-dom";
import { Canary } from "./index";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ComponentMeta, ComponentStory } from "@storybook/react";

const queryClient = new QueryClient();

export default {
  title: "Canary",
  component: Canary,
  argTypes: {},
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <Story />
        </MemoryRouter>
      </QueryClientProvider>
    )
  ]
} as ComponentMeta<typeof Canary>;

const Template: ComponentStory<typeof Canary> = (arg) => <Canary {...arg} />;

export const Variant1 = Template.bind({});

Variant1.args = {
  url: "/api/canary/api",
  topLayoutOffset: 0
};
