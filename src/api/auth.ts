import ory from "../components/ory/sdk";
import { isAuthEnabled } from "../context/Environment";
import { getPerson, getPersons } from "./services/users";

export const getUser = async () => {
  if (!isAuthEnabled()) {
    let people = (await getPersons()).data;
    return people?.[0] ?? null;
  }

  const {
    data: {
      identity: { id: userId }
    }
  } = await ory.toSession();

  const res = await getPerson(userId);
  return res.data?.[0] ?? null;
};
