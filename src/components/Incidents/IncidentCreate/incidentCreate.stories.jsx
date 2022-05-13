import React from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { IncidentCreate } from "./index";

export default {
  title: "IncidentCreate",
  component: IncidentCreate
};

const Template = (arg) => (
  <MemoryRouter initialEntries={["/incidents"]}>
    <Routes>
      <Route element={<IncidentCreate {...arg} />} path="/incidents" />
    </Routes>
  </MemoryRouter>
);

export const Variant1 = Template.bind({});
Variant1.args = {};
