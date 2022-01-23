import { IncidentCommander } from "./axios";
import { resolve } from "./resolve";

export let User = null;

export const getUser = async () =>
  resolve(
    IncidentCommander.get(`/person?limit=1`).then((res) => {
      console.log("user", res.data[0]);
      return res.data[0];
    })
  );

getUser().then((user) => {
  User = user;
});
