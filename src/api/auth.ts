import { isAuthEnabled } from "../context/Environment";
import { getPerson, getPersons } from "./services/users";

export const getUser = async (userId: string) => {
  const isClerkAuthSystem = !!process.env.NEXT_PUBLIC_AUTH_IS_CLERK === true;
  if (!isAuthEnabled() || isClerkAuthSystem) {
    let people = (await getPersons()).data;
    return people?.[0] ?? null;
  }
  const res = await getPerson(userId);
  return res.data?.[0] ?? null;
};
