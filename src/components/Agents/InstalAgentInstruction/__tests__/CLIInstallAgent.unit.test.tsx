import { render, screen } from "@testing-library/react";
import { AuthContext, FakeUser, Roles } from "../../../../context";
import InstallAgentModal from "../CLIInstallAgent";

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
}));

describe("InstallAgentModal", () => {
  const generatedAgent = {
    id: "testid",
    username: "testuser",
    access_token: "testtoken"
  };

  it("renders the Helm repository installation command", () => {
    render(
      <AuthContext.Provider value={FakeUser([Roles.admin])}>
        <InstallAgentModal generatedAgent={generatedAgent} />
      </AuthContext.Provider>
    );
    expect(
      screen.getByText(
        "helm repo add flanksource https://flanksource.github.io/charts",
        {
          exact: false
        }
      ).textContent
    ).toMatchInlineSnapshot(`
      "helm repo add flanksource https://flanksource.github.io/charts

      helm repo update

      helm install mc-agent flanksource/mission-control-agent -n "mission-control-agent" \\
        --set upstream.createSecret=true \\
        --set upstream.host=http://localhost \\
        --set upstream.username=token \\
        --set upstream.password=testtoken \\
        --set upstream.agentName= \\
        --create-namespace

      "
    `);
  });

  it("renders the Helm repository installation command with kube command", () => {
    render(
      <AuthContext.Provider value={FakeUser([Roles.admin])}>
        <InstallAgentModal
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
    expect(
      screen.getByText(
        "helm repo add flanksource https://flanksource.github.io/charts",
        {
          exact: false
        }
      ).textContent
    ).toMatchInlineSnapshot(`
      "helm repo add flanksource https://flanksource.github.io/charts

      helm repo update

      helm install mc-agent flanksource/mission-control-agent -n "mission-control-agent" \\
        --set upstream.createSecret=true \\
        --set upstream.host=http://localhost \\
        --set upstream.username=token \\
        --set upstream.password=testtoken \\
        --set upstream.agentName=testname \\
        --create-namespace

      helm install mc-agent-kubernetes flanksource/mission-control-kubernetes -n "mission-control-agent"  \\
        --set scraper.clusterName="testname" \\
        --set scraper.interval="1m"
      "
    `);
  });
});
