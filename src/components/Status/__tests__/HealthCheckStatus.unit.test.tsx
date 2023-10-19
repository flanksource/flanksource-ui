import { render, screen } from "@testing-library/react";
import { HealthCheckStatus } from "./../HealthCheckStatus";

describe("HealthCheckStatus", () => {
  const testCases = [
    {
      check: {
        status: "healthy"
      },
      isMixed: false,
      className: "",
      expectedColor: "bg-green-400"
    },
    {
      check: {
        status: "unhealthy"
      },
      isMixed: false,
      className: "",
      expectedColor: "bg-red-400"
    },
    {
      check: {
        status: "unhealthy"
      },
      isMixed: true,
      className: "",
      expectedColor: "bg-light-orange"
    },
    {
      check: undefined,
      isMixed: false,
      className: "bg-red-400",
      expectedColor: "bg-red-400"
    }
  ];

  test.each(testCases)(
    "renders with check=%o, isMixed=%p, className=%p",
    ({ check, isMixed, className, expectedColor }) => {
      render(
        <HealthCheckStatus
          check={check as any}
          isMixed={isMixed}
          className={className}
        />
      );
      const statusElement = screen.getByTestId("health-check-status");
      expect(statusElement).toHaveClass(`${expectedColor}`);
    }
  );
});
