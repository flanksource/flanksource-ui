import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import AddTopologyOptionsList, {
  createTopologyOptions
} from "./../AddTopologyOptionsList";

describe("AddTopologyOptionsList", () => {
  const onSelectOption = jest.fn();

  it("renders correctly", () => {
    render(<AddTopologyOptionsList onSelectOption={onSelectOption} />);

    createTopologyOptions.forEach((option) => {
      expect(
        screen.getByRole("button", {
          name: option
        })
      ).toBeInTheDocument();
    });
  });

  it("calls onSelectOption when an option is clicked", () => {
    render(<AddTopologyOptionsList onSelectOption={onSelectOption} />);

    fireEvent.click(
      screen.getByRole("button", {
        name: createTopologyOptions[0]
      })
    );

    expect(onSelectOption).toHaveBeenCalledWith(createTopologyOptions[0]);
  });
});
