import { stringify } from "qs";
import { CanaryChecker } from "../axios";

interface IParam {
  id: string;
  [key: string]: string;
}

export const getTopology = async (params: IParam) => {
  if (params.type === "All") {
    delete params.type;
  }
  if (params.owner === "All") {
    delete params.owner;
  }
  if (params.labels === "All") {
    delete params.labels;
  }
  const query = stringify(params);
  let { data } = await CanaryChecker.get(`/api/topology?${query}`);

  return { data: data || [] };
};

export const getTopologyWithoutUnroll = async (params: {
  [key: string]: string;
}) => {
  if (params.type === "All") {
    delete params.type;
  }
  if (params.owner === "All") {
    delete params.owner;
  }
  if (params.labels === "All") {
    delete params.labels;
  }
  const query = stringify(params);
  return await CanaryChecker.get(`/api/topology?${query}`).then((results) => {
    let { data } = results;
    if (data == null) {
      console.warn("returning empty");
      return { data: [] };
    }
    return { data };
  });
};

export const getCanaryGraph = async (params) => {
  const query = stringify(params);
  return CanaryChecker.get(`/api/graph?${query}`);
};

export const getCanaries = async (params) => {
  const query = stringify(params);
  return CanaryChecker.get(`/api?${query}`);
};

export const getTopologyComponents = () => {
  return CanaryChecker.get(`/db/components`);
};
