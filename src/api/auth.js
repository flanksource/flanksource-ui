import { getPersons } from "./services/users";

export const getUser = async () => {
  const res = await getPersons();
  return res.data[0];
};
