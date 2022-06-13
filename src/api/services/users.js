import { IncidentCommander } from "../axios";
import { resolve } from "../resolve";

export const getPerson = async (id) =>
  resolve(IncidentCommander.get(`/person?id=eq.${id}`));

export const getPersons = () => resolve(IncidentCommander.get(`/person`));

export const getPersonWithEmail = (email) =>
  resolve(IncidentCommander.get(`/person?email=eq.${email}`));

export const createPerson = ({ name, email, avatar, googleId }) =>
  resolve(
    IncidentCommander.post("/person", {
      name,
      email,
      avatar,
      properties: { google_id: googleId }
    })
  );
