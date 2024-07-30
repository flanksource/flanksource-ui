import { ComponentStory } from "@storybook/react";
import { Route, Routes } from "react-router-dom";
import {
  IncidentSeverity,
  IncidentStatus,
  IncidentSummary
} from "../../../api/types/incident";
import { IncidentList } from "./index";

export default {
  title: "IncidentList",
  component: IncidentList
};

const incidents: IncidentSummary[] = [
  {
    incident_id: "b398da27-7047-407f-a07d-80d0ba168bd0",
    id: "b398da27-7047-407f-a07d-80d0ba168bd0",
    title: "Incident from config",
    severity: IncidentSeverity.Low,
    type: "security",
    status: IncidentStatus.Open,
    created_at: "2022-04-10T11:32:37.285341",
    updated_at: "2022-04-10T11:32:37.285341",
    responders: [
      {
        id: "017fb74a-9c90-2074-6b29-61d71507c231",
        email: "johndoe@example.org",
        name: "Responder 1"
      }
    ]
  },
  {
    incident_id: "749f6387-11a2-4b67-b6dd-625987e6dc60",
    id: "749f6387-11a2-4b67-b6dd-625987e6dc60",
    title: "Test Incident 4",
    severity: IncidentSeverity.Low,
    type: "security",
    status: IncidentStatus.Open,
    created_at: "2022-04-05T07:55:30.479768",
    updated_at: "2022-04-05T07:55:30.479768",
    responders: [
      {
        id: "017fb74a-9c90-2074-6b29-61d71507c231",
        email: "johndoe@example.org",
        name: "Responder 2"
      }
    ]
  },
  {
    incident_id: "9419252b-aea4-4a49-8fff-e2d022fff588",
    id: "9419252b-aea4-4a49-8fff-e2d022fff588",
    title: "Test Incident with hunks",
    severity: IncidentSeverity.Low,
    type: "security",
    status: IncidentStatus.Open,
    created_at: "2022-04-05T07:23:11.288297",
    updated_at: "2022-04-05T07:23:11.288297",
    responders: [
      {
        id: "017fb74a-9c90-2074-6b29-61d71507c231",
        email: "johndoe@example.org",
        name: "Responder 3"
      }
    ]
  },
  {
    incident_id: "1aa1a99a-b487-495c-9cd9-a13cf717bc10",
    id: "1aa1a99a-b487-495c-9cd9-a13cf717bc10",
    title: "Test incident 3",
    severity: IncidentSeverity.Low,
    type: "cost",
    status: IncidentStatus.Open,
    created_at: "2022-04-05T07:19:03.546871",
    updated_at: "2022-04-05T07:19:03.546871",
    responders: [
      {
        id: "017fb74a-9c90-2074-6b29-61d71507c231",
        email: "johndoe@example.org",
        name: "Responder 3"
      },
      {
        id: "017fb74a-9c90-2074-6b29-61d71507c231",
        email: "",
        name: "Responder 5",
        avatar:
          "https://avatars.dicebear.com/v2/female/8e24031284dae52f5e21bc4b3310340b.svg"
      }
    ]
  }
];

const Template: ComponentStory<typeof IncidentList> = (arg) => (
  <Routes>
    <Route element={<IncidentList {...arg} />} path="/incidents" />
  </Routes>
);

export const Variant1 = Template.bind({});
Variant1.args = {
  incidents: incidents
};
