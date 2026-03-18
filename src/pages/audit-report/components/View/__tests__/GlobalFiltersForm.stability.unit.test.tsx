import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import GlobalFiltersForm from "../GlobalFiltersForm";
import type { ViewVariable } from "../../../types";

const testVariables: ViewVariable[] = [
  {
    key: "namespace",
    value: "",
    type: "select",
    options: ["ns-a", "ns-b"],
    default: "ns-a"
  }
];

function renderWithRouter(ui: React.ReactElement, { initialPath = "/" } = {}) {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>{ui}</MemoryRouter>
  );
}

describe("GlobalFiltersForm — update stability (bug #2948)", () => {
  let maxDepthErrors: string[];
  const originalConsoleError = console.error;

  beforeEach(() => {
    maxDepthErrors = [];
    console.error = (...args: unknown[]) => {
      const msg = String(args[0]);
      if (msg.includes("Maximum update depth exceeded")) {
        maxDepthErrors.push(msg);
        return;
      }
      originalConsoleError(...args);
    };
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  /**
   * GlobalFiltersListener has two useEffects that sync Formik ↔ URL.
   *
   * Effect 2 depends on `currentVariables` which previously defaulted to
   * a **new `{}` on every render** via the destructuring default. Each
   * render created a fresh object → React saw a changed dependency →
   * Effect 2 fired → called setFieldValue → triggered a Formik re-render
   * → new `{}` again → infinite loop.
   *
   * The fix replaces the inline `{}` with a module-level constant so the
   * reference is stable across renders.
   */
  it("does not trigger an infinite update loop on mount", () => {
    renderWithRouter(
      <GlobalFiltersForm variables={testVariables} globalVarPrefix="viewvar">
        <div data-testid="child">hello</div>
      </GlobalFiltersForm>
    );

    expect(screen.getByTestId("child")).toBeInTheDocument();
    expect(maxDepthErrors).toHaveLength(0);
  });
});
