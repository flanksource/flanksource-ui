import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import PlaybookRunsActionItem from "./../PlaybookRunsActionItem";
import { PlaybookRunAction } from "../../../../../api/types/playbooks";

describe("PlaybookRunsActionItem", () => {
  const mockAction: PlaybookRunAction = {
    playbook_run_id: "1",
    id: "1",
    name: "Test Action",
    status: "completed",
    start_time: "2022-01-01T00:00:00Z",
    end_time: "2022-01-01T01:00:00Z"
  };

  const mockOnClick = jest.fn();

  it("renders correctly", () => {
    render(
      <PlaybookRunsActionItem
        action={mockAction}
        onClick={mockOnClick}
        isSelected={false}
      />
    );

    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.getByText("Test Action")).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    render(
      <PlaybookRunsActionItem
        action={mockAction}
        onClick={mockOnClick}
        isSelected={false}
      />
    );

    fireEvent.click(screen.getByRole("button"));

    expect(mockOnClick).toHaveBeenCalled();
  });

  it("has correct style when selected", () => {
    render(
      <PlaybookRunsActionItem
        action={mockAction}
        onClick={mockOnClick}
        isSelected={true}
      />
    );

    expect(screen.getByRole("button")).toHaveClass("bg-gray-200");
  });
});
