import { stringify } from "qs";
import { CanaryChecker } from "../axios";

interface IParam {
  id: string;
  [key: string]: string;
}

const arrangeTopologyParams = (params: IParam) => {
  ["type", "team", "labels", "status"].forEach((param) => {
    if (params[param] === "All") {
      delete params[param];
    }
  });
  return params;
};

export const getTopology = async (
  params: IParam
): Promise<Record<string, any>> => {
  params = arrangeTopologyParams(params);
  const query = stringify(params);
  let { data } = await CanaryChecker.get(`/api/topology?${query}`);

  return { data: data || [] };
};

export const getTopologyWithoutUnroll = async (params: IParam) => {
  params = arrangeTopologyParams(params);
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
  return CanaryChecker.get(`/db/component_names`);
};

export const getTopologyComponentLabels = () => {
  return CanaryChecker.get(`/db/component_labels`);
};

export const getTopologyComponent = (id: string) => {
  return CanaryChecker.get(`/db/components?id=eq.${id}`);
};
