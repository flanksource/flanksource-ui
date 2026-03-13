// ABOUTME: Tests for HomepageRedirect component that resolves the homepage
// ABOUTME: destination based on the /api/dashboard endpoint.

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HomepageRedirect } from "../HomepageRedirect";
import { getDashboard } from "../../api/services/views";
import type { DashboardResponse } from "../../api/services/views";

jest.mock("../../api/services/views", () => ({
  ...jest.requireActual("../../api/services/views"),
  getDashboard: jest.fn()
}));

jest.mock("../../pages/views/components/ViewContainer", () => ({
  __esModule: true,
  default: ({ id }: { id: string }) => (
    <div data-testid="single-view" data-view-id={id}>
      View
    </div>
  )
}));

jest.mock("../../pages/health", () => ({
  HealthPage: () => <div data-testid="health-page">Health</div>
}));

const mockedGetDashboard = getDashboard as jest.MockedFunction<
  typeof getDashboard
>;

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false }
    }
  });
}

function renderWithProviders() {
  const queryClient = createQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={["/"]}>
        <HomepageRedirect />
      </MemoryRouter>
    </QueryClientProvider>
  );
}

afterEach(() => {
  jest.clearAllMocks();
});

const fakeDashboard: DashboardResponse = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  name: "mission-control-dashboard",
  namespace: "mc",
  title: "Dashboard",
  icon: "dashboard-line",
  requestFingerprint: "abc123",
  sections: [
    {
      title: "Unhealthy Configs",
      viewRef: { namespace: "mc", name: "unhealthy-configs" }
    }
  ],
  sectionResults: {
    "mc/unhealthy-configs": {
      name: "unhealthy-configs",
      namespace: "mc",
      title: "Configs",
      requestFingerprint: "def456"
    }
  }
};

describe("HomepageRedirect", () => {
  it("renders view when dashboard endpoint returns a view", async () => {
    mockedGetDashboard.mockResolvedValue(fakeDashboard);

    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByTestId("single-view")).toBeInTheDocument();
    });

    expect(screen.getByTestId("single-view")).toHaveAttribute(
      "data-view-id",
      fakeDashboard.id
    );
  });

  it("falls back to health page when dashboard returns null (404)", async () => {
    mockedGetDashboard.mockResolvedValue(null);

    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByTestId("health-page")).toBeInTheDocument();
    });
  });

  it("falls back to health page when dashboard fetch errors", async () => {
    mockedGetDashboard.mockRejectedValue(new Error("Server error"));

    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByTestId("health-page")).toBeInTheDocument();
    });
  });

  it("pre-seeds section cache from sectionResults", async () => {
    const queryClient = createQueryClient();
    mockedGetDashboard.mockResolvedValue(fakeDashboard);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={["/"]}>
          <HomepageRedirect />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("single-view")).toBeInTheDocument();
    });

    // Check that the section result was seeded in the cache
    const cachedSection = queryClient.getQueryData([
      "view-section-result",
      "mc",
      "unhealthy-configs",
      ""
    ]);
    expect(cachedSection).toEqual(
      fakeDashboard.sectionResults!["mc/unhealthy-configs"]
    );

    // Check that the top-level view was seeded
    const cachedView = queryClient.getQueryData([
      "view-metadata",
      fakeDashboard.id
    ]);
    expect(cachedView).toEqual(fakeDashboard);
  });
});
