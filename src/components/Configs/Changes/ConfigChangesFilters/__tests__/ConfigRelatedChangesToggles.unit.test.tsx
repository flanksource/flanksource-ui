import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import { ConfigRelatedChangesToggles } from "../ConfigRelatedChangesToggles";

function SearchParams() {
  return <div data-testid="search">{useLocation().search}</div>;
}

describe("ConfigRelatedChangesToggles", () => {
  it("stores the soft relationship selection in the URL", () => {
    render(
      <MemoryRouter
        initialEntries={["/catalog/config-1/changes"]}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <ConfigRelatedChangesToggles />
        <SearchParams />
      </MemoryRouter>
    );

    const softToggle = screen.getByRole("switch", { name: "Soft" });
    expect(softToggle).not.toBeChecked();

    fireEvent.click(softToggle);

    expect(softToggle).toBeChecked();
    expect(
      new URLSearchParams(screen.getByTestId("search").textContent ?? "").get(
        "soft"
      )
    ).toBe("true");
  });
});
