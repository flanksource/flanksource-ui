import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { CheckLink } from "./../CheckLink";
import { ComponentHealthCheckView } from "../../../api/services/topology";

describe("CheckLink", () => {
  const check: ComponentHealthCheckView = {
    id: "1",
    name: "Example Check",
    type: "example",
    status: "healthy",
    component_id: "1",
    severity: "critical"
  };

  it("renders with healthy status", () => {
    render(
      <MemoryRouter>
        <CheckLink check={check} />
      </MemoryRouter>
    );

    const linkElement = screen.getByRole("link");
    expect(linkElement).toHaveAttribute(
      "href",
      "/health?checkId=1&timeRange=1h"
    );

    const statusElement = screen.getByTestId("health-check-status");
    expect(statusElement).toHaveClass("bg-green-400");

    const nameElement = screen.getByText("Example Check");
    expect(nameElement).toBeInTheDocument();
  });

  it("renders with unhealthy status", () => {
    const unhealthyCheck = { ...check, status: "unhealthy" };

    render(
      <MemoryRouter>
        <CheckLink check={unhealthyCheck} />
      </MemoryRouter>
    );

    const statusElement = screen.getByTestId("health-check-status");
    expect(statusElement).toHaveClass("bg-red-400");
  });
});
