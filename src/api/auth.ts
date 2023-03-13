import ory from "../components/ory/sdk";
import { getPerson, getPersons } from "./services/users";

export const getUser = async () => {
  const isAuthDisabled = process.env.NEXT_PUBLIC_WITHOUT_SESSION === "true";

  if (isAuthDisabled) {
    let people = (await getPersons()).data;
    return people?.[0];
  }

  const {
    data: {
      identity: { id: userId }
    }
  } = await ory.toSession();
  const res = await getPerson(userId);
  return res.data?.[0];
};
