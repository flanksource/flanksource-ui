import { ChartData } from "../../HelmInstallationSnippets";

export const mockInput: ChartData = {
  chart: "mission-control-agent",
  namespace: "mission-control-agent",
  repoName: "flanksource",
  createRepo: true,
  releaseName: "mc-agent",
  createNamespace: true,
  values: {
    upstream: {
      createSecret: "true",
      host: "http://localhost:3000",
      username: "token",
      password: "password",
      agentName: "test-new-agent-instructions"
    },
    pushTelemetry: {
      enabled: "true",
      topologyName:
        "incident-commander.demo.aws.flanksource.com-test-new-agent-instructions"
    }
  }
};

export const mockInputWithKubOptions: ChartData[] = [
  {
    chart: "mission-control-agent",
    namespace: "mission-control-agent",
    repoName: "flanksource",
    createRepo: true,
    createNamespace: true,
    releaseName: "mc-agent",
    values: {
      upstream: {
        createSecret: "true",
        host: "http://localhost:3000",
        username: "token",
        password: "password",
        agentName: "test-new-agent-instructions"
      },
      pushTelemetry: {
        enabled: "true",
        topologyName:
          "incident-commander.demo.aws.flanksource.com-test-new-agent-instructions"
      }
    }
  },
  {
    chart: "mission-control-kubernetes",
    namespace: "mission-control-agent",
    repoName: "flanksource",
    releaseName: "mc-agent-kubernetes",
    values: {
      clusterName: "test-new-agent-instructions2",
      scraper: {
        schedule: "@every 31m"
      }
    }
  }
];

export const mockInputWithValueFile: ChartData[] = [
  {
    chart: "mission-control-kubernetes",
    namespace: "mission-control-agent",
    repoName: "flanksource",
    releaseName: "mc-agent-kubernetes",
    values: {
      clusterName: "test-new-agent-instructions2",
      scraper: {
        schedule: "@every 31m"
      }
    },
    valueFile: "a: b"
  }
];
