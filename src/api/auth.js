import ory from "../components/ory/sdk";
import { getPerson } from "./services/users";

export const getUser = async () => {
  const {
    data: {
      identity: { id: userId }
    }
  } = await ory.toSession();
  const res = await getPerson(userId);
  return res.data[0];
};
