import { render, screen } from "@testing-library/react";
import { AuthContext } from "../../../../context";
import InstallAgentModal from "../CLIInstallAgent";

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

describe("InstallAgentModal", () => {
  const generatedAgent = {
    id: "testid",
    username: "testuser",
    access_token: "testtoken"
  };

  it("renders the Helm repository installation command", () => {
    render(
      <AuthContext.Provider
        value={{
          user: testUser,
          backendUrl: "https://testurl.com"
        }}
      >
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

      helm install mc-agent flanksource/mission-control-agent -n "mission-control-agent" --set upstream.createSecret=true --set upstream.host=http://localhost --set upstream.username=token --set upstream.password=testtoken

      helm install mc-agent flanksource/mission-control-agent -n "mission-control-agent" --set upstream.createSecret=true --set upstream.host=http://localhost --set upstream.username=token --set upstream.password=testtoken

      "
    `);
  });
});
