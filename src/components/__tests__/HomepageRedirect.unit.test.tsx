// ABOUTME: Tests for HomepageRedirect component that resolves the homepage
// ABOUTME: destination based on properties and view lookups.

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HomepageRedirect } from "../HomepageRedirect";
import { FeatureFlagsContext } from "../../context/FeatureFlagsContext";
import type { FeatureFlagsState } from "../../context/FeatureFlagsContext";
import type { FeatureFlag } from "../../services/permissions/permissionsService";
import { DASHBOARD_VIEW_PROPERTY } from "../dashboardViewConstants";

import {
  getViewIdByName,
  getViewIdByNamespaceAndName
} from "../../api/services/views";

jest.mock("../../api/services/views", () => ({
  getViewIdByName: jest.fn(),
  getViewIdByNamespaceAndName: jest.fn()
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

const mockedGetViewIdByName = getViewIdByName as jest.MockedFunction<
  typeof getViewIdByName
>;
const mockedGetViewIdByNamespaceAndName =
  getViewIdByNamespaceAndName as jest.MockedFunction<
    typeof getViewIdByNamespaceAndName
  >;

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false }
    }
  });
}

function buildFeatureFlagsState(
  featureFlags: FeatureFlag[] = []
): FeatureFlagsState {
  return {
    featureFlags,
    featureFlagsLoaded: true,
    refreshFeatureFlags: () => {},
    isFeatureDisabled: () => false
  };
}

function renderWithProviders(featureFlags: FeatureFlag[] = []) {
  const queryClient = createQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <FeatureFlagsContext.Provider
        value={buildFeatureFlagsState(featureFlags)}
      >
        <MemoryRouter initialEntries={["/"]}>
          <HomepageRedirect />
        </MemoryRouter>
      </FeatureFlagsContext.Provider>
    </QueryClientProvider>
  );
}

function dashboardViewFlag(value: string): FeatureFlag {
  return {
    name: DASHBOARD_VIEW_PROPERTY,
    value,
    description: "",
    source: "",
    type: ""
  };
}

afterEach(() => {
  jest.clearAllMocks();
});

describe("HomepageRedirect", () => {
  it("renders view when property is a UUID", async () => {
    const uuid = "550e8400-e29b-41d4-a716-446655440000";
    renderWithProviders([dashboardViewFlag(uuid)]);

    await waitFor(() => {
      expect(screen.getByTestId("single-view")).toBeInTheDocument();
    });

    expect(screen.getByTestId("single-view")).toHaveAttribute(
      "data-view-id",
      uuid
    );
    expect(mockedGetViewIdByName).not.toHaveBeenCalled();
    expect(mockedGetViewIdByNamespaceAndName).not.toHaveBeenCalled();
  });

  it("looks up by namespace/name when property contains a slash", async () => {
    const viewId = "aaa-bbb-ccc";
    mockedGetViewIdByNamespaceAndName.mockResolvedValue(viewId);

    renderWithProviders([dashboardViewFlag("my-namespace/my-view")]);

    await waitFor(() => {
      expect(screen.getByTestId("single-view")).toBeInTheDocument();
    });

    expect(screen.getByTestId("single-view")).toHaveAttribute(
      "data-view-id",
      viewId
    );
    expect(mockedGetViewIdByNamespaceAndName).toHaveBeenCalledWith(
      "my-namespace",
      "my-view"
    );
  });

  it("looks up by name when property is a plain string", async () => {
    const viewId = "ddd-eee-fff";
    mockedGetViewIdByName.mockResolvedValue(viewId);

    renderWithProviders([dashboardViewFlag("my-dashboard")]);

    await waitFor(() => {
      expect(screen.getByTestId("single-view")).toBeInTheDocument();
    });

    expect(screen.getByTestId("single-view")).toHaveAttribute(
      "data-view-id",
      viewId
    );
    expect(mockedGetViewIdByName).toHaveBeenCalledWith("my-dashboard");
  });

  it("falls back to mission-control-dashboard view when no property is set", async () => {
    const viewId = "ggg-hhh-iii";
    mockedGetViewIdByName.mockResolvedValue(viewId);

    renderWithProviders([]);

    await waitFor(() => {
      expect(screen.getByTestId("single-view")).toBeInTheDocument();
    });

    expect(screen.getByTestId("single-view")).toHaveAttribute(
      "data-view-id",
      viewId
    );
    expect(mockedGetViewIdByName).toHaveBeenCalledWith(
      "mission-control-dashboard"
    );
  });

  it("falls back to health page when no property and no mission-control-dashboard view", async () => {
    mockedGetViewIdByName.mockResolvedValue(undefined);

    renderWithProviders([]);

    await waitFor(() => {
      expect(screen.getByTestId("health-page")).toBeInTheDocument();
    });

    expect(mockedGetViewIdByName).toHaveBeenCalledWith(
      "mission-control-dashboard"
    );
  });

  it("falls back to health page when property name lookup fails", async () => {
    mockedGetViewIdByName.mockResolvedValue(undefined);

    renderWithProviders([dashboardViewFlag("nonexistent-view")]);

    await waitFor(() => {
      expect(screen.getByTestId("health-page")).toBeInTheDocument();
    });
  });
});
