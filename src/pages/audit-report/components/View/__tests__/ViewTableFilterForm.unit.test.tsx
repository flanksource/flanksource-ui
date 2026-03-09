import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import ViewTableFilterForm from "../ViewTableFilterForm";
import { usePrefixedSearchParams } from "../../../../../hooks/usePrefixedSearchParams";

const tablePrefix = "view_default_components";
const filterField = "status";

function RawSearchProbe() {
  const location = useLocation();
  return <div data-testid="raw-search">{location.search}</div>;
}

function PrefixedTableParamsProbe() {
  const [params] = usePrefixedSearchParams(tablePrefix, false);
  return <div data-testid="prefixed-search">{params.toString()}</div>;
}

function TestPage() {
  return (
    <ViewTableFilterForm
      filterFields={[filterField]}
      tablePrefix={tablePrefix}
      defaultFieldValues={{ [filterField]: "healthy" }}
    >
      <>
        <RawSearchProbe />
        <PrefixedTableParamsProbe />
      </>
    </ViewTableFilterForm>
  );
}

describe("ViewTableFilterForm", () => {
  afterEach(() => {
    window.history.replaceState({}, "", "/");
  });

  it("preserves prefixed sorting params when default filters sync to the URL", async () => {
    window.history.replaceState(
      {},
      "",
      `/?${tablePrefix}__sortBy=name&${tablePrefix}__sortOrder=asc&${tablePrefix}__pageIndex=2&${tablePrefix}__pageSize=50`
    );

    render(
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<TestPage />} />
        </Routes>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("prefixed-search")).toHaveTextContent(
        "status=healthy"
      );
    });

    const rawSearch = screen.getByTestId("raw-search").textContent ?? "";
    const prefixedSearch =
      screen.getByTestId("prefixed-search").textContent ?? "";

    expect(rawSearch).toContain(`${tablePrefix}__sortBy=name`);
    expect(rawSearch).toContain(`${tablePrefix}__sortOrder=asc`);
    expect(rawSearch).not.toContain("?sortBy=name");
    expect(rawSearch).not.toContain("&sortBy=name");
    expect(rawSearch).not.toContain("?sortOrder=asc");
    expect(rawSearch).not.toContain("&sortOrder=asc");

    expect(prefixedSearch).toContain("sortBy=name");
    expect(prefixedSearch).toContain("sortOrder=asc");
    expect(prefixedSearch).toContain("pageSize=50");
    expect(prefixedSearch).toContain("status=healthy");
    expect(prefixedSearch).not.toContain("pageIndex=2");
  });
});
