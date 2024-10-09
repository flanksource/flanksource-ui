import { render, screen } from "@testing-library/react";
import InstallAgentModal from "../CLIInstallAgent";

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
}));

const mockInput = {
  chart: "mission-control-agent",
  namespace: "mission-control-agent",
  repoName: "flanksource",
  values: [
    "upstream.createSecret=true",
    "upstream.host=http://localhost:3000",
    "upstream.username=token",
    "upstream.password=password",
    "upstream.agentName=test-new-agent-instructions",
    "pushTelemetry.enabled=true",
    "pushTelemetry.topologyName=https://incident-commander.demo.aws.flanksource.com-test-new-agent-instructions"
  ]
};

const mockInputWithKubOptions = {
  chart: "mission-control-agent",
  namespace: "mission-control-agent",
  repoName: "flanksource",
  values: [
    "upstream.createSecret=true",
    "upstream.host=http://localhost:3000",
    "upstream.username=token",
    "upstream.password=password",
    "upstream.agentName=test-new-agent-instructions",
    "pushTelemetry.enabled=true",
    "pushTelemetry.topologyName=https://incident-commander.demo.aws.flanksource.com-test-new-agent-instructions"
  ],
  kubeValues: [
    'clusterName: "test-new-agent-instructions"',
    'scraper.schedule: "30m"'
  ]
};

describe("InstallAgentModal", () => {
  it("renders the Helm repository installation command", () => {
    render(<InstallAgentModal data={mockInput} />);
    expect(
      screen.getByText(
        "helm repo add mission-control-agent flanksource/mission-control-agent",
        {
          exact: false
        }
      ).textContent
    ).toMatchSnapshot();
  });

  it("renders the Helm repository installation command with kube command", () => {
    render(<InstallAgentModal data={mockInputWithKubOptions} />);
    expect(
      screen.getByText(
        "helm repo add mission-control-agent flanksource/mission-control-agent",
        {
          exact: false
        }
      ).textContent
    ).toMatchSnapshot();
  });
});
