import { fireEvent, render, screen } from "@testing-library/react";
import { PlaybookRunAction } from "../../../../../api/types/playbooks";
import PlaybookRunsActionItem from "./../PlaybookRunsActionItem";

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
        stepNumber={1}
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
        stepNumber={1}
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
        stepNumber={1}
      />
    );

    expect(screen.getByRole("button")).toHaveClass("bg-gray-200");
  });

  it("shows 'in X' for sleeping actions with scheduled_time", () => {
    const futureTime = new Date(Date.now() + 5 * 60 * 1000).toISOString();
    const sleepingAction: PlaybookRunAction = {
      playbook_run_id: "1",
      id: "2",
      name: "Sleeping Action",
      status: "sleeping",
      start_time: "2022-01-01T00:00:00Z",
      scheduled_time: futureTime
    };

    render(
      <PlaybookRunsActionItem
        action={sleepingAction}
        onClick={mockOnClick}
        isSelected={false}
        stepNumber={2}
      />
    );

    // The sleeping action should show "in X" instead of "-"
    const sleepText = screen.getByText(/^in /);
    expect(sleepText).toBeInTheDocument();
  });

  it("does not call onClick for skipped actions", () => {
    const skippedAction: PlaybookRunAction = {
      ...mockAction,
      id: "3",
      status: "skipped"
    };
    const onClickForSkipped = jest.fn();

    render(
      <PlaybookRunsActionItem
        action={skippedAction}
        onClick={onClickForSkipped}
        isSelected={false}
        stepNumber={3}
      />
    );

    fireEvent.click(screen.getByRole("button"));
    expect(onClickForSkipped).not.toHaveBeenCalled();
  });
});
