import { getPerson } from "./services/users";

export const getUser = async () => {
  const res = await getPerson("01814f6d-edba-8467-55ca-78974a2004f6");
  return res.data[0];
};
