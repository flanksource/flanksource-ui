import { isAuthEnabled } from "../context/Environment";
import { getPerson, getPersons } from "./services/users";

export const getUser = async (userId: string) => {
  if (!isAuthEnabled()) {
    let people = (await getPersons()).data;
    return people?.[0] ?? null;
  }
  const res = await getPerson(userId);
  return res.data?.[0] ?? null;
};
