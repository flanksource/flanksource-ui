import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import TopologyConfigsActionsDropdown from "./../TopologyConfigsActionsDropdown";

describe("TopologyConfigsActionsDropdown", () => {
  const mockOnUnlinkUser = jest.fn();

  it("renders correctly", () => {
    render(<TopologyConfigsActionsDropdown onUnlinkUser={mockOnUnlinkUser} />);

    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("calls onUnlinkUser when Unlink user is clicked", () => {
    render(<TopologyConfigsActionsDropdown onUnlinkUser={mockOnUnlinkUser} />);

    fireEvent.click(screen.getByRole("button"));

    fireEvent.click(screen.getByRole("menuitem", { name: /unlink catalog/i }));

    expect(mockOnUnlinkUser).toHaveBeenCalled();
  });
});
