import { Logs } from "../axios";
import { resolve } from "../resolve";

export const getLogs = async () =>
  resolve(
    Logs.post("", {
      type: "KubernetesDeployment",
      id: "canary-checker",
      labels: {
        namespace: "demo"
      }
    })
  );
