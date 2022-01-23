import { CanaryChecker } from "../axios";
import { resolve } from "../resolve";

export const getTopology = async () =>
  resolve(CanaryChecker.get("/api/topology"));

export const getCanaries = async () => resolve(CanaryChecker.get("/api"));
