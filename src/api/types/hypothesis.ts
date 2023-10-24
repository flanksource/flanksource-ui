import { Evidence } from "./evidence";
import { User } from "./users";

export type HypothesisNodeType = "root" | "factor" | "solution";

export enum HypothesisStatus {
  Proven = "proven",
  Likely = "likely",
  Possible = "possible",
  Unlikely = "unlikely",
  Improbable = "improbable",
  Disproven = "disproven"
}

export interface Hypothesis {
  title: string;
  status: HypothesisStatus;
  created_by?: User;
  parent_id?: string;
  evidences?: Evidence[];
  comment?: any[];
  id: string;
  incident_id: string;
  type: HypothesisNodeType;
  children?: any[];
}

export interface HypothesisInfo {
  type: HypothesisNodeType;
  title: string;
  status: HypothesisStatus;
}

interface NewBaseHypothesis {
  user: User;
  incident_id: string;
  title?: string;
  status: HypothesisStatus;
}

export type NewRootNode = {
  type: "root";
} & NewBaseHypothesis;

export type NewChildNode = {
  type: "factor" | "solution";
  parent_id?: string;
} & NewBaseHypothesis;

export type NewHypothesis = NewRootNode | NewChildNode;

const hypothesisChildType = {
  default: "root",
  root: "factor",
  factor: "solution"
} as const;

export const getHypothesisChildType = (
  nodeType?: keyof typeof hypothesisChildType
) => hypothesisChildType[nodeType || "default"];
