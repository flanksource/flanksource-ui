import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { ConfigAccessGroupByTabs } from "../ConfigAccessGroupByTabs";

type GroupedMode = "group-config" | "group-user" | "group-group";

function TabsHarness() {
  const [mode, setMode] = useState<GroupedMode>("group-config");

  return <ConfigAccessGroupByTabs mode={mode} onChange={setMode} />;
}

describe("ConfigAccessGroupByTabs", () => {
  it("switches between catalog, user, and group access", () => {
    render(<TabsHarness />);

    expect(screen.getByRole("tab", { name: "Catalogs" })).toHaveAttribute(
      "aria-selected",
      "true"
    );

    fireEvent.mouseDown(screen.getByRole("tab", { name: "Users" }), {
      button: 0,
      ctrlKey: false
    });

    expect(screen.getByRole("tab", { name: "Users" })).toHaveAttribute(
      "aria-selected",
      "true"
    );

    fireEvent.mouseDown(screen.getByRole("tab", { name: "Groups" }), {
      button: 0,
      ctrlKey: false
    });

    expect(screen.getByRole("tab", { name: "Groups" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
  });
});
