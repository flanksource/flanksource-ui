import { ChartData } from "../../HelmInstallationSnippets";

export const mockInput: ChartData = {
  chart: "mission-control-agent",
  namespace: "mission-control-agent",
  repoName: "flanksource",
  createRepo: true,
  releaseName: "mc-agent",
  createNamespace: true,
  values: [
    {
      key: "upstream.createSecret",
      value: "true"
    },
    {
      key: "upstream.host",
      value: "http://localhost:3000"
    },
    {
      key: "upstream.username",
      value: "token"
    },
    {
      key: "upstream.password",
      value: "password"
    },
    {
      key: "upstream.agentName",
      value: "test-new-agent-instructions"
    },
    {
      key: "pushTelemetry.enabled",
      value: "true"
    },
    {
      key: "pushTelemetry.topologyName",
      value:
        "incident-commander.demo.aws.flanksource.com-test-new-agent-instructions"
    }
  ]
};

export const mockInputWithKubOptions: ChartData[] = [
  {
    chart: "mission-control-agent",
    namespace: "mission-control-agent",
    repoName: "flanksource",
    createRepo: true,
    createNamespace: true,
    releaseName: "mc-agent",
    values: [
      {
        key: "upstream.createSecret",
        value: "true"
      },
      {
        key: "upstream.host",
        value: "http://localhost:3000"
      },
      {
        key: "upstream.username",
        value: "token"
      },
      {
        key: "upstream.password",
        value: "password"
      },
      {
        key: "upstream.agentName",
        value: "test-new-agent-instructions"
      },
      {
        key: "pushTelemetry.enabled",
        value: "true"
      },
      {
        key: "pushTelemetry.topologyName",
        value:
          "incident-commander.demo.aws.flanksource.com-test-new-agent-instructions"
      }
    ]
  },
  {
    chart: "mc-agent-kubernetes",
    repoName: "flanksource",
    namespace: "mission-control-agent",
    releaseName: "mc-agent-kubernetes",
    values: [
      {
        key: "clusterName",
        value: "test-new-agent-instructions"
      },
      {
        key: "scraper.schedule",
        value: "30m"
      }
    ]
  }
];

export const mockInputWithValueFile: ChartData[] = [
  {
    chart: "mission-control-agent",
    namespace: "mission-control-agent",
    repoName: "flanksource",
    createRepo: true,
    releaseName: "mc-agent",
    createNamespace: true,
    values: [
      {
        key: "upstream.createSecret",
        value: "true"
      },
      {
        key: "upstream.host",
        value: "http://localhost:3000"
      },
      {
        key: "upstream.username",
        value: "token"
      },
      {
        key: "upstream.password",
        value: "password"
      },
      {
        key: "upstream.agentName",
        value: "test-new-agent-instructions"
      },
      {
        key: "pushTelemetry.enabled",
        value: "true"
      },
      {
        key: "pushTelemetry.topologyName",
        value:
          "incident-commander.demo.aws.flanksource.com-test-new-agent-instructions"
      }
    ],
    valueFile: `key: value
key2: value2
key3: value3
key4: value4`
  },
  {
    chart: "mc-agent-kubernetes",
    repoName: "flanksource",
    namespace: "mission-control-agent",
    releaseName: "mc-agent-kubernetes",
    valueFile: `key: value
key2: value2
key3: value3`
  }
];
