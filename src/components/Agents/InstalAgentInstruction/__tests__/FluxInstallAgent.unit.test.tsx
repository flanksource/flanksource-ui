import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import FluxInstallAgent from "../FluxInstallAgent";

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
}));

const writeText = jest.fn();

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

Object.assign(navigator, {
  clipboard: {
    writeText
  }
});

describe("InstallAgentModal", () => {
  it("renders the Helm repository installation command", async () => {
    render(<FluxInstallAgent data={mockInput} />);

    const btn = screen.getByTitle(/Copy to clipboard/i);

    fireEvent.click(btn);

    await waitFor(() => {
      expect(writeText).toHaveBeenCalled();
    });
    expect(writeText.mock["calls"][0][0]).toMatchSnapshot();
  });

  it("renders the Helm repository installation command with kube command", async () => {
    render(<FluxInstallAgent data={mockInputWithKubOptions} />);
    const btn = screen.getByTitle(/Copy to clipboard/i);

    fireEvent.click(btn);

    await waitFor(() => {
      expect(writeText).toHaveBeenCalled();
    });
    expect(writeText.mock["calls"][0][0]).toMatchSnapshot();
  });
});
