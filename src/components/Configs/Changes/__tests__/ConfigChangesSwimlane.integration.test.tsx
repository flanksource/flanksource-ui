/* eslint-disable testing-library/no-container, testing-library/no-node-access */
import { ConfigChange } from "@flanksource-ui/api/types/configs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import fs from "fs";
import path from "path";
import { MemoryRouter } from "react-router-dom";
import ConfigChangesSwimlane from "../ConfigChangesSwimlane";

// ── Load real changes from HAR ──

function loadChangesFromHar(): ConfigChange[] {
  const harPath = path.join(__dirname, "changes.har");
  const har = JSON.parse(fs.readFileSync(harPath, "utf-8"));
  return har.log.entries
    .filter((e: any) => e.request.url.includes("catalog/changes"))
    .flatMap((e: any) => JSON.parse(e.response.content.text).changes)
    .map(
      (c: any): ConfigChange => ({
        ...c,
        config: { id: c.config_id, type: c.type, name: c.name }
      })
    );
}

const allChanges = loadChangesFromHar();

// ── Render helper ──

function renderSwimlane(
  props: Partial<Parameters<typeof ConfigChangesSwimlane>[0]> = {}
) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } }
  });
  return render(
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>
        <ConfigChangesSwimlane changes={[]} {...props} />
      </QueryClientProvider>
    </MemoryRouter>
  );
}

// ── Tests ──

describe("ConfigChangesSwimlane integration", () => {
  it("renders with real data without crashing", () => {
    const { container } = renderSwimlane({ changes: allChanges });
    expect(screen.queryByText("No changes to display")).not.toBeInTheDocument();
    expect(container.querySelector(".flex.h-full.w-full")).toBeInTheDocument();
  });

  it("legend shows all unique change types", () => {
    renderSwimlane({ changes: allChanges });

    const expectedTypes = new Set(allChanges.map((c) => c.change_type));
    expect(expectedTypes.size).toBe(34);

    for (const type of ["diff", "Pulling", "OOMKilled", "Healthy", "Sync"]) {
      expect(screen.getAllByText(type).length).toBeGreaterThan(0);
    }
  });

  it("hierarchical grouping creates group rows", () => {
    renderSwimlane({ changes: allChanges });

    const buttons = screen.getAllByRole("button");
    const groupButtons = buttons.filter((btn) => {
      const countBadge = btn.querySelector("span.text-xs.text-gray-400");
      return countBadge?.textContent?.match(/^\(\d+\)$/);
    });

    expect(groupButtons.length).toBeGreaterThan(0);

    const groupTexts = groupButtons.map((btn) => btn.textContent ?? "");
    const hasCanaryGroup = groupTexts.some((t) => t.includes("canary"));
    const hasMissionGroup = groupTexts.some((t) => t.includes("mission"));
    expect(hasCanaryGroup || hasMissionGroup).toBe(true);
  });

  it("collapse/expand toggles child visibility", () => {
    renderSwimlane({ changes: allChanges });

    const buttons = screen.getAllByRole("button");
    const groupButton = buttons.find((btn) => {
      const countBadge = btn.querySelector("span.text-xs.text-gray-400");
      return countBadge?.textContent?.match(/^\(\d+\)$/);
    });
    expect(groupButton).toBeDefined();

    const groupName = groupButton!.querySelector(
      "span.truncate.font-medium"
    )?.textContent;
    expect(groupName).toBeTruthy();

    const parentRow = groupButton!.closest(
      ".flex.flex-row.border-b"
    ) as HTMLElement;
    const groupContainer = parentRow?.parentElement as HTMLElement;

    const countChildRows = () =>
      groupContainer.querySelectorAll(":scope > .flex.flex-row.border-b")
        .length - 1;

    const childCountBefore = countChildRows();
    expect(childCountBefore).toBeGreaterThan(0);

    fireEvent.click(groupButton!);
    expect(countChildRows()).toBe(0);

    fireEvent.click(groupButton!);
    expect(countChildRows()).toBe(childCountBefore);
  });

  it("shows loading indicator when isFetchingNextPage is true", () => {
    renderSwimlane({
      changes: allChanges,
      isFetchingNextPage: true
    });
    expect(screen.getByText("Loading more changes...")).toBeInTheDocument();
  });

  it("calls fetchNextPage when sentinel becomes visible", () => {
    let observerCallback: IntersectionObserverCallback;
    const observeMock = jest.fn();
    const disconnectMock = jest.fn();

    const MockIntersectionObserver = jest.fn(
      (cb: IntersectionObserverCallback) => {
        observerCallback = cb;
        return {
          observe: observeMock,
          disconnect: disconnectMock,
          unobserve: jest.fn()
        };
      }
    );
    Object.defineProperty(window, "IntersectionObserver", {
      writable: true,
      value: MockIntersectionObserver
    });

    const fetchNextPage = jest.fn();
    renderSwimlane({
      changes: allChanges,
      fetchNextPage,
      hasNextPage: true,
      isFetchingNextPage: false
    });

    expect(observeMock).toHaveBeenCalled();

    observerCallback!(
      [{ isIntersecting: true } as IntersectionObserverEntry],
      {} as IntersectionObserver
    );

    expect(fetchNextPage).toHaveBeenCalled();
  });

  it("renders empty state for empty changes array", () => {
    renderSwimlane({ changes: [] });
    expect(screen.getByText("No changes to display")).toBeInTheDocument();
  });
});
