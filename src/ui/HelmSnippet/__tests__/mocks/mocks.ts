import { TemplateContextData } from "../../HelmInstallationSnippets";

export const mockInput: TemplateContextData = {
  chart: "mission-control-agent",
  namespace: "mission-control-agent",
  repoName: "flanksource",
  createRepo: true,
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
        "https://incident-commander.demo.aws.flanksource.com-test-new-agent-instructions"
    }
  ]
};

export const mockInputWithKubOptions: TemplateContextData = {
  chart: "mission-control-agent",
  namespace: "mission-control-agent",
  repoName: "flanksource",
  createRepo: true,
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
        "https://incident-commander.demo.aws.flanksource.com-test-new-agent-instructions"
    }
  ],
  kubeValues: [
    {
      key: "clusterName",
      value: "test-new-agent-instructions"
    },
    {
      key: "scraper.schedule",
      value: "30m"
    }
  ]
};

export const mockInputWithValueFile: TemplateContextData = {
  chart: "mission-control-agent",
  namespace: "mission-control-agent",
  repoName: "flanksource",
  createRepo: true,
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
        "https://incident-commander.demo.aws.flanksource.com-test-new-agent-instructions"
    }
  ],
  kubeValues: [
    {
      key: "clusterName",
      value: "test-new-agent-instructions"
    },
    {
      key: "scraper.schedule",
      value: "30m"
    }
  ],
  valueFile: `key: value
key2: value2
key3: value3
key4: value4`
};
