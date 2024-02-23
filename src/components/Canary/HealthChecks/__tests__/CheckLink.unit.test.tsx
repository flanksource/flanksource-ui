import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HealthCheckSummary } from "../../../../api/types/health";
import { CheckLink } from "../CheckLink";

let queryClient = new QueryClient({});
describe("CheckLink", () => {
  const check: HealthCheckSummary = {
    id: "1",
    name: "Example Check",
    type: "example",
    status: "healthy",
    severity: "critical",
    last_runtime: new Date().toISOString()
  };

  it("renders with healthy status", async () => {
    render(
      <MemoryRouter>
        <QueryClientProvider client={queryClient}>
          <CheckLink check={check} />
        </QueryClientProvider>
      </MemoryRouter>
    );

    const linkElement = await screen.findByRole("link");
    expect(linkElement).toHaveAttribute(
      "href",
      "/health?checkId=1&timeRange=1h"
    );

    const statusElement = screen.getByTestId("health-check-status");

    expect(statusElement).toHaveClass("bg-green-400");

    const nameElement = screen.getByText("Example Check");
    expect(nameElement).toBeInTheDocument();
  });

  it("renders with unhealthy status", async () => {
    const unhealthyCheck: HealthCheckSummary = {
      id: "1",
      name: "Example Check",
      type: "example",
      status: "unhealthy",
      severity: "critical",
      last_runtime: new Date().toISOString()
    };

    render(
      <MemoryRouter>
        <QueryClientProvider client={queryClient}>
          <CheckLink check={unhealthyCheck} />
        </QueryClientProvider>
      </MemoryRouter>
    );

    const statusElement = await screen.findByTestId("health-check-status");
    expect(statusElement).toHaveClass("bg-red-400");
  });
});
