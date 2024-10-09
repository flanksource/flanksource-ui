import { render, screen } from "@testing-library/react";
import InstallAgentModal from "../CLISnippet";
import { mockInput, mockInputWithKubOptions } from "./mocks/mocks";

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
}));

describe("InstallAgentModal", () => {
  it("renders the Helm repository installation command", () => {
    render(<InstallAgentModal data={[mockInput]} />);
    expect(
      screen.getByText("helm repo add flanksource", {
        exact: false
      }).textContent
    ).toMatchSnapshot();
  });

  it("renders the Helm repository installation command with kube command", () => {
    render(<InstallAgentModal data={mockInputWithKubOptions} />);
    expect(
      screen.getByText("helm repo add flanksource", {
        exact: false
      }).textContent
    ).toMatchSnapshot();
  });
});
