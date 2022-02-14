import axios from "axios";
import { IncidentCommander } from "../axios";
import { resolve } from "../resolve";

export const getPerson = async (id) => resolve(axios.get(`/users/${id}`));

export const getPersons = async () => resolve(IncidentCommander.get(`/person`));
