import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { AuthContext, FakeUser, Roles } from "../../../../context";
import FluxInstallAgent from "../FluxInstallAgent";

const testUser = {
  id: "testid",
  name: "testuser",
  email: "testemail"
};

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
}));

const writeText = jest.fn();

Object.assign(navigator, {
  clipboard: {
    writeText
  }
});

describe("InstallAgentModal", () => {
  const generatedAgent = {
    id: "testid",
    username: "testuser",
    access_token: "testtoken"
  };

  it("renders the Helm repository installation command", async () => {
    render(
      <AuthContext.Provider value={FakeUser([Roles.admin])}>
        <FluxInstallAgent
          agentFormValues={{
            name: "testname",
            kubernetes: {},
            properties: {}
          }}
          generatedAgent={generatedAgent}
        />
      </AuthContext.Provider>
    );

    const btn = screen.getByTitle(/Copy to clipboard/i);

    fireEvent.click(btn);

    await waitFor(() => {
      expect(writeText).toHaveBeenCalled();
    });
    expect(writeText.mock["calls"][0][0]).toMatchInlineSnapshot(`
      "apiVersion: v1
      kind: Namespace
      metadata:
        name:  mission-control-agent
      ---
      apiVersion: source.toolkit.fluxcd.io/v1beta1
      kind: HelmRepository
      metadata:
        name: flanksource
        namespace: mission-control-agent
      spec:
        interval: 5m0s
        url: https://flanksource.github.io/charts
      ---
      apiVersion: helm.toolkit.fluxcd.io/v2beta1
      kind: HelmRelease
      metadata:
        name: mission-control
        namespace: mission-control-agent
      spec:
        chart:
          spec:
            chart: mission-control-agent
            sourceRef:
              kind: HelmRepository
              name: flanksource
              namespace: mission-control-agent
            interval: 1m
        values:
          upstream:
            createSecret: true
            host:  http://localhost
            username: token
            agentName: testname
            password: testtoken
      ---
      apiVersion: helm.toolkit.fluxcd.io/v2beta1
      kind: HelmRelease
      metadata:
        name: mission-control-kubernetes
        namespace: mission-control-agent
      spec:
        chart:
          spec:
            chart: mission-control-kubernetes
            sourceRef:
              kind: HelmRepository
              name: flanksource
              namespace: mission-control-agent
        values:
          clusterName: "testname"
          interval: ""
        "
    `);
  });

  it("renders the Helm repository installation command with kube command", async () => {
    render(
      <AuthContext.Provider value={FakeUser([Roles.admin])}>
        <FluxInstallAgent
          generatedAgent={generatedAgent}
          agentFormValues={{
            name: "testname",
            properties: {},
            kubernetes: {
              interval: "1m",
              exclusions: ["testexclusion1", "testexclusion2"]
            }
          }}
        />
      </AuthContext.Provider>
    );
    const btn = screen.getByTitle(/Copy to clipboard/i);

    fireEvent.click(btn);

    await waitFor(() => {
      expect(writeText).toHaveBeenCalled();
    });
    expect(writeText.mock["calls"][0][0]).toMatchInlineSnapshot(`
      "apiVersion: v1
      kind: Namespace
      metadata:
        name:  mission-control-agent
      ---
      apiVersion: source.toolkit.fluxcd.io/v1beta1
      kind: HelmRepository
      metadata:
        name: flanksource
        namespace: mission-control-agent
      spec:
        interval: 5m0s
        url: https://flanksource.github.io/charts
      ---
      apiVersion: helm.toolkit.fluxcd.io/v2beta1
      kind: HelmRelease
      metadata:
        name: mission-control
        namespace: mission-control-agent
      spec:
        chart:
          spec:
            chart: mission-control-agent
            sourceRef:
              kind: HelmRepository
              name: flanksource
              namespace: mission-control-agent
            interval: 1m
        values:
          upstream:
            createSecret: true
            host:  http://localhost
            username: token
            agentName: testname
            password: testtoken
      ---
      apiVersion: helm.toolkit.fluxcd.io/v2beta1
      kind: HelmRelease
      metadata:
        name: mission-control-kubernetes
        namespace: mission-control-agent
      spec:
        chart:
          spec:
            chart: mission-control-kubernetes
            sourceRef:
              kind: HelmRepository
              name: flanksource
              namespace: mission-control-agent
        values:
          clusterName: "testname"
          interval: ""
        "
    `);
  });
});
