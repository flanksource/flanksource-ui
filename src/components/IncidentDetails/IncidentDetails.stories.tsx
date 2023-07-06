import { ComponentMeta, ComponentStory } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import {
  Incident,
  IncidentSeverity,
  IncidentStatus
} from "../../api/services/incident";
import { IncidentSidebar } from "./IncidentSidebar";

export default {
  title: "IncidentSidebar",
  component: IncidentSidebar,
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
  ],
  parameters: { actions: { argTypesRegex: "^on.*" } }
} as ComponentMeta<typeof IncidentSidebar>;

const incident: Incident = {
  id: "1aa1a99a-b487-495c-9cd9-a13cf717bc10",
  incident_id: "incident_id",
  title: "Test incident 3",
  created_by: "017fb74a-9c90-2074-6b29-61d71507c231",
  commander: {
    id: "",
    email: "",
    name: "System",
    avatar: undefined
  },
  commander_id: {
    name: "System",
    avatar: undefined
  },
  communicator_id: "",
  severity: IncidentSeverity.Low,
  description: "test",
  type: "cost",
  status: IncidentStatus.Open,
  created_at: "2022-04-05T07:19:03.546871",
  parent_id: "",
  hypotheses: [],
  involved: []
};

const Template: ComponentStory<typeof IncidentSidebar> = (arg: any) => (
  <IncidentSidebar {...arg} />
);

export const Variant1 = Template.bind({});
Variant1.args = {
  incident,
  updateStatusHandler: () => {},
  updateIncidentHandler: () => {},
  textButton: "button"
};
