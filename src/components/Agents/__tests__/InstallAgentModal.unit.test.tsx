import { fireEvent, render, screen } from "@testing-library/react";
import InstallAgentModal from "./../InstallAgentModal";
import { AuthContext } from "../../../context";

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

  it("renders the modal title", () => {
    render(
      <InstallAgentModal
        isOpen={true}
        onClose={() => {}}
        generatedAgent={generatedAgent}
      />
    );
    expect(screen.getByText("Installation Instructions")).toBeInTheDocument();
  });

  it("renders the Helm repository installation command", () => {
    render(
      <AuthContext.Provider
        value={{
          user: testUser,
          backendUrl: "https://testurl.com"
        }}
      >
        <InstallAgentModal
          isOpen={true}
          onClose={() => {}}
          generatedAgent={generatedAgent}
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
      helm install mc-agent flanksource/mission-control-agent -n "mission-control-agent" --create-namespace --set upstream.createSecret=true --set upstream.host=https://testurl.com --set upstream.username=testuser --set upstream.password=testtoken

      "
    `);
  });

  it("calls onClose when the Close button is clicked", () => {
    const onClose = jest.fn();
    render(
      <InstallAgentModal
        isOpen={true}
        onClose={onClose}
        generatedAgent={generatedAgent}
      />
    );
    const closeButton = screen.getAllByRole("button", {
      name: /close/i
    })[0];
    fireEvent.click(closeButton);
    expect(onClose).toHaveBeenCalled();
  });
});
