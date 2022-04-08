import { IncidentCommander } from "./axios";

// export const getUser = async () =>
//   IncidentCommander.get(`/person?limit=1`).then((res) => res.data[0]);
export const getUser = async () => ({
  id: 1,
  name: "Test test",
  avatar:
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=3&w=256&h=256&q=80"
});