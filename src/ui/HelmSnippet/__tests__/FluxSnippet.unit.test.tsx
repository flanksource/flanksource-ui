import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import FluxSnippet from "../FluxSnippet";
import { mockInput, mockInputWithKubOptions } from "./mocks/mocks";

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
  it("renders the Helm repository installation command", async () => {
    render(<FluxSnippet data={[mockInput]} />);

    const btn = screen.getByTitle(/Copy to clipboard/i);

    fireEvent.click(btn);

    await waitFor(() => {
      expect(writeText).toHaveBeenCalled();
    });
    expect(writeText.mock["calls"][0][0]).toMatchSnapshot();
  });

  it("renders the Helm repository installation command with kube command", async () => {
    render(<FluxSnippet data={mockInputWithKubOptions} />);
    const btn = screen.getByTitle(/Copy to clipboard/i);

    fireEvent.click(btn);

    await waitFor(() => {
      expect(writeText).toHaveBeenCalled();
    });
    expect(writeText.mock["calls"][0][0]).toMatchSnapshot();
  });
});
