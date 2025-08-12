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
    const element = screen.getByText((content, element) => {
      return (
        element?.tagName.toLowerCase() === "pre" &&
        element?.textContent?.includes("helm repo add flanksource") === true
      );
    });
    expect(element.textContent).toMatchSnapshot();
  });

  it("renders the Helm repository installation command with kube command", () => {
    render(<InstallAgentModal data={mockInputWithKubOptions} />);
    const element = screen.getByText((content, element) => {
      return (
        element?.tagName.toLowerCase() === "pre" &&
        element?.textContent?.includes("helm repo add flanksource") === true
      );
    });
    expect(element.textContent).toMatchSnapshot();
  });
});
