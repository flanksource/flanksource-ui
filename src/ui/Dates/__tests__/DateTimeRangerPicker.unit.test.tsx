import { fireEvent, render, screen } from "@testing-library/react";
import DateTimeRangerPicker from "./../DateTimeRangerPicker";

describe("DateTimeRangerPicker", () => {
  const mockOnChange = jest.fn();

  it("renders correctly", () => {
    render(<DateTimeRangerPicker label="Test Label" onChange={mockOnChange} />);

    expect(screen.getByText("Test Label")).toBeInTheDocument();
  });

  it("calls onChange when the From input is changed", () => {
    render(<DateTimeRangerPicker label="Test Label" onChange={mockOnChange} />);

    fireEvent.change(screen.getByLabelText("From:"), {
      target: { value: "2022-01-01T00:00" }
    });

    fireEvent.change(screen.getByLabelText("To:"), {
      target: { value: "2022-01-02T01:00" }
    });

    expect(mockOnChange).toHaveBeenCalled();
  });

  it("calls onChange when the To input is changed", () => {
    render(
      <DateTimeRangerPicker
        label="Test Label"
        onChange={mockOnChange}
        value={{ from: "2022-01-01T00:00:00", to: "2022-01-01T01:00:00" }}
      />
    );

    fireEvent.change(screen.getByLabelText("To:"), {
      target: { value: "2022-01-02T01:00" }
    });

    expect(mockOnChange).toHaveBeenCalled();
  });
});
