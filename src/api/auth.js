import { IncidentCommander } from "./axios";
import { resolve } from "./resolve";

// eslint-disable-next-line import/no-mutable-exports
export let User = null;

export const getUser = async () => {
  if (User != null) {
    return User;
  }
  return resolve(
    IncidentCommander.get(`/person?limit=1`).then((res) => {
      // eslint-disable-next-line prefer-destructuring
      User = res.data[0];
      return User;
    })
  );
};

getUser().then((user) => {
  User = user;
});
