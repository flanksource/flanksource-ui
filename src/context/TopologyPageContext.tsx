import { CostsData } from "../components/CostDetails/CostDetails";
import { Severity, typeItems } from "../components/Incidents/data";

export type ValueType = number | string | Date;

export type TopologyProperty = {
  name: string;
  icon?: string;
  label?: string;
  type?: string;
  text?: string;
  max?: number;
  min?: number;
  headline?: boolean;
  value?: ValueType;
  unit?: string;
  color?: string;
};

export type Topology = {
  id: string;
  parent_id?: string;
  name: string;
  type?: string;
  created_at?: string;
  updated_at?: string;
  title?: string;
  properties?: TopologyProperty[];
  components?: Topology[];
  labels?: Record<string, string>;
  path?: string;
  icon?: string;
  text?: string;
  status?: string;
  hidden?: boolean;
  external_id?: string;
  agent_id?: string;
  topology_id?: string;
  summary?: {
    incidents?: Record<
      keyof typeof typeItems,
      Record<"High" | "Medium" | "Low", number>
    >;
    insights?: Record<
      keyof typeof typeItems,
      Record<Severity, number | undefined>
    >;
    [key: string]: any;
  };
  logs: {
    name: string;
  }[];
  parents: string[];
  children: string[];
} & CostsData;
