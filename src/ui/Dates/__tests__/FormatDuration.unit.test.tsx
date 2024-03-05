import { render, screen } from "@testing-library/react";
import dayjs from "dayjs";
import FormatDuration from "./../FormatDuration";

describe("FormatDuration", () => {
  it("renders correctly when startTime and endTime are provided", () => {
    const startTime = dayjs().toISOString();
    const endTime = dayjs().add(1, "hour").toISOString();

    render(<FormatDuration startTime={startTime} endTime={endTime} />);

    // Assuming formatDuration function returns duration in 'HH:mm:ss' format
    expect(screen.getByText("1h")).toBeInTheDocument();
  });

  it("renders nothing when startTime or endTime is not provided", () => {
    const { container } = render(
      <FormatDuration startTime={undefined} endTime={undefined} />
    );

    expect(container).toBeEmptyDOMElement();
  });
});
