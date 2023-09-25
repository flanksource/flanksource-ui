import { render, screen } from "@testing-library/react";
import CodeBlock from "./../CodeBlock";

describe("CopyBlock", () => {
  const code = "console.log('Hello, world!');";

  it("renders the code block with the provided code", () => {
    render(<CodeBlock code={code} />);
    expect(screen.getByText(code)).toBeInTheDocument();
  });

  it("renders the copy button", () => {
    render(<CodeBlock code={code} />);
    expect(screen.getByTitle("Copy to clipboard")).toBeInTheDocument();
  });
});
