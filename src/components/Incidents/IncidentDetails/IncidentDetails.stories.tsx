import { ComponentMeta, ComponentStory } from "@storybook/react";
import { IncidentSeverity, IncidentStatus } from "../../../api/types/incident";
import { IncidentSidebar } from "./IncidentSidebar";

export default {
  title: "IncidentSidebar",
  component: IncidentSidebar,
  decorators: [
    (Story) => {
      return <Story />;
    }
  ],
  parameters: { actions: { argTypesRegex: "^on.*" } }
} as ComponentMeta<typeof IncidentSidebar>;

const incident = {
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
  type: "issue",
  status: IncidentStatus.Open,
  created_at: "2022-04-05T07:19:03.546871",
  updated_at: "2022-04-05T07:19:03.546871",
  hypothesis: [
    {
      id: "401cf26e-e941-4641-b6ab-1860a484b2a2",
      created_by: {
        name: "System",
        avatar: undefined
      },
      incident_id: "1aa1a99a-b487-495c-9cd9-a13cf717bc10",
      parent_id: null,
      type: "root",
      title: "Test incident 3",
      status: "proven",
      created_at: "2022-04-05T07:19:04.177198",
      updated_at: "2022-04-05T07:19:04.177198"
    }
  ],
  parent_id: "",
  hypotheses: [],
  involved: [],
  responder: []
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
