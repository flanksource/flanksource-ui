import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, useLocation } from "react-router-dom";
import TagsFilterCell from "../TagsFilterCell";

function SearchParams() {
  return <div data-testid="search">{useLocation().search}</div>;
}

describe("TagsFilterCell", () => {
  it("keeps hidden tags filterable in a popover", async () => {
    const onRowClick = jest.fn();
    const user = userEvent.setup();

    render(
      <MemoryRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <div onClick={onRowClick}>
          <TagsFilterCell
            tags={{
              cluster: "homelab",
              namespace: "mission-control",
              environment: "production"
            }}
            maxVisibleTags={1}
          />
        </div>
        <SearchParams />
      </MemoryRouter>
    );

    expect(screen.getByText("cluster: homelab")).toBeVisible();
    expect(screen.getByText("+2 more")).toBeVisible();
    expect(
      screen.queryByText("namespace: mission-control")
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "2 more tags" }));

    expect(screen.getByText("namespace: mission-control")).toBeVisible();
    expect(screen.getByText("environment: production")).toBeVisible();
    expect(onRowClick).not.toHaveBeenCalled();

    await user.click(
      screen.getByRole("button", {
        name: "Include namespace: mission-control"
      })
    );

    expect(
      new URLSearchParams(screen.getByTestId("search").textContent ?? "").get(
        "labels"
      )
    ).toBe("namespace____mission-control:1");
    expect(screen.getByText("namespace: mission-control")).toBeVisible();
    expect(onRowClick).not.toHaveBeenCalled();
  });
});
