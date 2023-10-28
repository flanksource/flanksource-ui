import React from "react";
import { render, screen } from "@testing-library/react";
import DisplayDetailsRow from "./../DisplayDetailsRow";

describe("DisplayDetailsRow", () => {
  const items = [
    { label: "Label 1", value: "Value 1" },
    { label: "Label 2", value: "Value 2" },
    { label: "Label 3", value: "Value 3" }
  ];

  it("renders the correct number of items", () => {
    render(<DisplayDetailsRow items={items} />);
    expect(screen.getAllByTestId("display-item-row")).toHaveLength(
      items.length
    );
  });

  it("renders the correct labels and values", () => {
    render(<DisplayDetailsRow items={items} />);

    items.forEach(({ label, value }) => {
      expect(screen.getByText(label)).toBeInTheDocument();
      expect(screen.getByText(value)).toBeInTheDocument();
    });
  });

  it("renders with the correct className", () => {
    const className = "test-class-name";
    render(<DisplayDetailsRow items={items} className={className} />);
    expect(screen.getAllByTestId("display-item-row")[0]).toHaveClass(className);
  });
});
