import React from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { IncidentList } from "./index";

export default {
  title: "IncidentList",
  component: IncidentList
};

const incidents = [
  {
    id: "b398da27-7047-407f-a07d-80d0ba168bd0",
    title: "Incident from config",
    created_by: "017fb74a-9c90-2074-6b29-61d71507c231",
    commander_id: "017fb74a-9c90-2074-6b29-61d71507c231",
    communicator_id: "017fb74a-9c90-2074-6b29-61d71507c231",
    severity: 2,
    description: "",
    type: "issue",
    status: "open",
    created_at: "2022-04-10T11:32:37.285341",
    updated_at: "2022-04-10T11:32:37.285341",
    person: {
      name: "Responder 1"
    }
  },
  {
    id: "749f6387-11a2-4b67-b6dd-625987e6dc60",
    title: "Test Incident 4",
    created_by: "017fb74a-9c90-2074-6b29-61d71507c231",
    commander_id: "017fb74a-9c90-2074-6b29-61d71507c231",
    communicator_id: "017fb74a-9c90-2074-6b29-61d71507c231",
    severity: 0,
    description: "test",
    type: "issue",
    status: "open",
    created_at: "2022-04-05T07:55:30.479768",
    updated_at: "2022-04-05T07:55:30.479768",
    person: {
      name: "Responder 1"
    }
  },
  {
    id: "9419252b-aea4-4a49-8fff-e2d022fff588",
    title: "Test Incident with hunks",
    created_by: "017fb74a-9c90-2074-6b29-61d71507c231",
    commander_id: "017fb74a-9c90-2074-6b29-61d71507c231",
    communicator_id: "017fb74a-9c90-2074-6b29-61d71507c231",
    severity: 0,
    description: "test",
    type: "issue",
    status: "open",
    created_at: "2022-04-05T07:23:11.288297",
    updated_at: "2022-04-05T07:23:11.288297",
    person: {
      name: "Responder 1"
    }
  },
  {
    id: "1aa1a99a-b487-495c-9cd9-a13cf717bc10",
    title: "Test incident 3",
    created_by: "017fb74a-9c90-2074-6b29-61d71507c231",
    commander_id: "017fb74a-9c90-2074-6b29-61d71507c231",
    communicator_id: "017fb74a-9c90-2074-6b29-61d71507c231",
    severity: 0,
    description: "test",
    type: "issue",
    status: "open",
    created_at: "2022-04-05T07:19:03.546871",
    updated_at: "2022-04-05T07:19:03.546871",
    person: {
      name: "Responder 1",
      avatar:
        "https://avatars.dicebear.com/v2/female/8e24031284dae52f5e21bc4b3310340b.svg"
    }
  }
];

const Template = (arg) => (
  <MemoryRouter initialEntries={["/incidents"]}>
    <Routes>
      <Route element={<IncidentList {...arg} />} path="/incidents" />
    </Routes>
  </MemoryRouter>
);

export const Variant1 = Template.bind({});
Variant1.args = {
  list: incidents
};
