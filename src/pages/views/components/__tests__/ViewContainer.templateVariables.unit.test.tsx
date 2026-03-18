import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, useSearchParams } from "react-router-dom";
import ViewContainer from "../ViewContainer";
import * as viewsApi from "../../../../api/services/views";

jest.mock("../../../../api/services/views", () => ({
  ...jest.requireActual("../../../../api/services/views"),
  getViewDataById: jest.fn(),
  getViewMetadataById: jest.fn(),
  getViewDataByNamespace: jest.fn(),
  getViewDisplayPluginVariables: jest.fn()
}));

jest.mock("../../../audit-report/components/View/View", () => ({
  __esModule: true,
  default: ({ requestFingerprint }: { requestFingerprint: string }) => (
    <div data-testid="view-fingerprint">{requestFingerprint}</div>
  )
}));

// Mock incidental child components to isolate ViewContainer's data-fetching logic.
jest.mock("../../../audit-report/components/View/GlobalFiltersForm", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => children
}));

jest.mock("../../../audit-report/components/View/GlobalFilters", () => ({
  __esModule: true,
  default: () => <div data-testid="global-filters" />
}));

const mockedGetViewDataById = viewsApi.getViewDataById as jest.MockedFunction<
  typeof viewsApi.getViewDataById
>;
const mockedGetViewMetadataById =
  viewsApi.getViewMetadataById as jest.MockedFunction<
    typeof viewsApi.getViewMetadataById
  >;
const mockedGetViewDataByNamespace =
  viewsApi.getViewDataByNamespace as jest.MockedFunction<
    typeof viewsApi.getViewDataByNamespace
  >;

function TestHarness() {
  const [, setSearchParams] = useSearchParams();

  return (
    <>
      <button
        onClick={() =>
          setSearchParams(new URLSearchParams("viewvar__namespace=ns-a"))
        }
      >
        Set namespace ns-a
      </button>
      <ViewContainer id="view-1" />
    </>
  );
}

function renderWithProviders(initialPath = "/") {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false
      }
    }
  });

  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <QueryClientProvider client={queryClient}>
        <TestHarness />
      </QueryClientProvider>
    </MemoryRouter>
  );
}

describe("ViewContainer metadata loading", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockedGetViewMetadataById.mockResolvedValue({
      id: "view-1",
      namespace: "mission-control",
      name: "cluster-view",
      requestFingerprint: "primary:none"
    });

    mockedGetViewDataById.mockImplementation(async (_viewId, variables) => {
      return {
        namespace: "mission-control",
        name: "cluster-view",
        requestFingerprint: `primary:${variables?.namespace ?? "none"}`
      };
    });

    mockedGetViewDataByNamespace.mockImplementation(
      async (namespace, name, variables) => {
        return {
          namespace,
          name,
          requestFingerprint: `section:${variables?.namespace ?? "none"}`
        };
      }
    );
  });

  it("loads primary view via metadata endpoint, switches to data endpoint when URL vars appear", async () => {
    renderWithProviders("/");

    await waitFor(() => {
      expect(screen.getByTestId("view-fingerprint")).toHaveTextContent(
        "primary:none"
      );
    });

    expect(mockedGetViewMetadataById).toHaveBeenCalledWith("view-1", undefined);
    expect(mockedGetViewDataById).not.toHaveBeenCalled();

    // Setting URL vars switches from metadata endpoint to data endpoint
    // so that the primary view re-fetches with the new variables.
    fireEvent.click(screen.getByRole("button", { name: "Set namespace ns-a" }));

    await waitFor(() => {
      expect(mockedGetViewDataById).toHaveBeenCalledWith(
        "view-1",
        expect.objectContaining({ namespace: "ns-a" }),
        undefined
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId("view-fingerprint")).toHaveTextContent(
        "primary:ns-a"
      );
    });
  });

  it("uses prefetched sectionResults without per-section fetches", async () => {
    mockedGetViewMetadataById.mockResolvedValueOnce({
      id: "view-1",
      namespace: "mission-control",
      name: "cluster-view",
      requestFingerprint: "primary:none",
      sections: [
        {
          title: "Section A",
          viewRef: {
            namespace: "mission-control",
            name: "section-a"
          }
        }
      ],
      sectionResults: {
        "mission-control/section-a": {
          namespace: "mission-control",
          name: "section-a",
          requestFingerprint: "prefetched-section"
        }
      }
    });

    renderWithProviders("/");

    await waitFor(() => {
      expect(screen.getByText("prefetched-section")).toBeInTheDocument();
    });

    expect(mockedGetViewDataByNamespace).not.toHaveBeenCalled();
  });

  it("fetches only sections missing from prefetched sectionResults", async () => {
    mockedGetViewMetadataById.mockResolvedValueOnce({
      id: "view-1",
      namespace: "mission-control",
      name: "cluster-view",
      requestFingerprint: "primary:none",
      sections: [
        {
          title: "Section A",
          viewRef: {
            namespace: "mission-control",
            name: "section-a"
          }
        },
        {
          title: "Section B",
          viewRef: {
            namespace: "mission-control",
            name: "section-b"
          }
        }
      ],
      sectionResults: {
        "mission-control/section-a": {
          namespace: "mission-control",
          name: "section-a",
          requestFingerprint: "prefetched-section-a"
        }
      }
    });

    renderWithProviders("/");

    await waitFor(() => {
      expect(screen.getByText("prefetched-section-a")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(mockedGetViewDataByNamespace).toHaveBeenCalledTimes(1);
    });

    expect(mockedGetViewDataByNamespace).toHaveBeenCalledWith(
      "mission-control",
      "section-b",
      {}
    );
  });

  it("supports sectionResults keys for same-namespace refs", async () => {
    mockedGetViewMetadataById.mockResolvedValueOnce({
      id: "view-1",
      namespace: "mission-control",
      name: "cluster-view",
      requestFingerprint: "primary:none",
      sections: [
        {
          title: "Section A",
          viewRef: {
            name: "section-a"
          }
        }
      ],
      sectionResults: {
        "/section-a": {
          namespace: "mission-control",
          name: "section-a",
          requestFingerprint: "prefetched-section"
        }
      }
    });

    renderWithProviders("/");

    await waitFor(() => {
      expect(screen.getByText("prefetched-section")).toBeInTheDocument();
    });

    expect(mockedGetViewDataByNamespace).not.toHaveBeenCalled();
  });

  it("fetches primary view with variables when URL vars are present", async () => {
    mockedGetViewMetadataById.mockResolvedValueOnce({
      id: "view-1",
      namespace: "mission-control",
      name: "cluster-view",
      requestFingerprint: "primary:none",
      variables: [
        {
          key: "namespace",
          value: "",
          type: "select",
          options: ["ns-a"],
          default: "ns-a"
        }
      ],
      sections: [
        {
          title: "Section A",
          viewRef: {
            namespace: "mission-control",
            name: "section-a"
          }
        }
      ],
      sectionResults: {
        "mission-control/section-a": {
          namespace: "mission-control",
          name: "section-a",
          requestFingerprint: "prefetched-section"
        }
      }
    });

    // When URL vars are present, the data endpoint is used instead of
    // metadata so the primary view panels/table reflect the variables.
    renderWithProviders("/?viewvar__namespace=ns-a");

    await waitFor(() => {
      expect(mockedGetViewDataById).toHaveBeenCalledWith(
        "view-1",
        expect.objectContaining({ namespace: "ns-a" }),
        undefined
      );
    });
  });
});

describe("ViewContainer global filter changes", () => {
  // resetAllMocks (not clearAllMocks) is needed to wipe mockResolvedValue /
  // mockImplementation set by the metadata-loading beforeEach above.
  afterEach(() => jest.resetAllMocks());

  function GlobalFilterTestHarness() {
    const [, setSearchParams] = useSearchParams();

    return (
      <>
        <button
          data-testid="set-ns-b"
          onClick={() =>
            setSearchParams(new URLSearchParams("viewvar__namespace=ns-b"))
          }
        >
          Set namespace ns-b
        </button>
        <button
          data-testid="set-ns-a"
          onClick={() =>
            setSearchParams(new URLSearchParams("viewvar__namespace=ns-a"))
          }
        >
          Set namespace ns-a
        </button>
        <ViewContainer id="view-1" />
      </>
    );
  }

  function renderGlobalFilterTest(initialPath = "/") {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false
        }
      }
    });

    return render(
      <MemoryRouter initialEntries={[initialPath]}>
        <QueryClientProvider client={queryClient}>
          <GlobalFilterTestHarness />
        </QueryClientProvider>
      </MemoryRouter>
    );
  }

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("updates section content when global filter changes to non-default value", async () => {
    const sectionsDef = [
      {
        title: "Section A",
        viewRef: { namespace: "mission-control", name: "section-a" }
      }
    ];
    const variablesDef = [
      {
        key: "namespace",
        value: "",
        type: "select",
        options: ["ns-a", "ns-b"],
        default: "ns-a"
      }
    ];

    // Metadata — returned on initial load (no URL vars)
    mockedGetViewMetadataById.mockResolvedValue({
      id: "view-1",
      namespace: "mission-control",
      name: "cluster-view",
      requestFingerprint: "primary:none",
      variables: variablesDef,
      sections: sectionsDef,
      sectionResults: {
        "mission-control/section-a": {
          namespace: "mission-control",
          name: "section-a",
          requestFingerprint: "section:ns-a"
        }
      }
    });

    // Primary data endpoint — called once URL vars appear
    mockedGetViewDataById.mockImplementation(async (_viewId, variables) => ({
      namespace: "mission-control",
      name: "cluster-view",
      requestFingerprint: `primary:${variables?.namespace ?? "none"}`,
      variables: variablesDef,
      sections: sectionsDef
    }));

    // Section fetches return fingerprint reflecting the variable value
    mockedGetViewDataByNamespace.mockImplementation(
      async (namespace, name, variables) => ({
        namespace,
        name,
        requestFingerprint: `section:${variables?.namespace ?? "none"}`
      })
    );

    renderGlobalFilterTest("/");

    // Initially shows prefetched section data (metadata endpoint, no URL vars)
    await waitFor(() => {
      expect(screen.getByText("section:ns-a")).toBeInTheDocument();
    });

    // Change global filter to non-default value
    fireEvent.click(screen.getByTestId("set-ns-b"));

    // Section should re-fetch and UI should update with new data
    await waitFor(() => {
      expect(screen.getByText("section:ns-b")).toBeInTheDocument();
    });

    expect(mockedGetViewDataByNamespace).toHaveBeenCalledWith(
      "mission-control",
      "section-a",
      expect.objectContaining({ namespace: "ns-b" })
    );
  });

  it("updates section content when switching between non-default values", async () => {
    mockedGetViewMetadataById.mockResolvedValue({
      id: "view-1",
      namespace: "mission-control",
      name: "cluster-view",
      requestFingerprint: "primary:none",
      sections: [
        {
          title: "Section A",
          viewRef: { namespace: "mission-control", name: "section-a" }
        }
      ],
      sectionResults: {
        "mission-control/section-a": {
          namespace: "mission-control",
          name: "section-a",
          requestFingerprint: "section:ns-a"
        }
      }
    });

    mockedGetViewDataById.mockImplementation(async (_viewId, variables) => ({
      namespace: "mission-control",
      name: "cluster-view",
      requestFingerprint: `primary:${variables?.namespace ?? "none"}`,
      variables: [
        {
          key: "namespace",
          value: "",
          type: "select",
          options: ["ns-a", "ns-b", "ns-c"],
          default: "ns-a"
        }
      ],
      sections: [
        {
          title: "Section A",
          viewRef: { namespace: "mission-control", name: "section-a" }
        }
      ]
    }));

    mockedGetViewDataByNamespace.mockImplementation(
      async (namespace, name, variables) => ({
        namespace,
        name,
        requestFingerprint: `section:${variables?.namespace ?? "none"}`
      })
    );

    renderGlobalFilterTest("/");

    // Initial: prefetched data
    await waitFor(() => {
      expect(screen.getByText("section:ns-a")).toBeInTheDocument();
    });

    // Switch to ns-b
    fireEvent.click(screen.getByTestId("set-ns-b"));

    await waitFor(() => {
      expect(screen.getByText("section:ns-b")).toBeInTheDocument();
    });

    // Switch back to ns-a — should revert
    fireEvent.click(screen.getByTestId("set-ns-a"));

    await waitFor(() => {
      expect(screen.getByText("section:ns-a")).toBeInTheDocument();
    });
  });

  it("updates multiple sections when global filter changes", async () => {
    mockedGetViewMetadataById.mockResolvedValue({
      id: "view-1",
      namespace: "mission-control",
      name: "cluster-view",
      requestFingerprint: "primary:none",
      sections: [
        {
          title: "Section A",
          viewRef: { namespace: "mission-control", name: "section-a" }
        },
        {
          title: "Section B",
          viewRef: { namespace: "mission-control", name: "section-b" }
        }
      ],
      sectionResults: {
        "mission-control/section-a": {
          namespace: "mission-control",
          name: "section-a",
          requestFingerprint: "section-a:ns-a"
        },
        "mission-control/section-b": {
          namespace: "mission-control",
          name: "section-b",
          requestFingerprint: "section-b:ns-a"
        }
      }
    });

    mockedGetViewDataById.mockImplementation(async (_viewId, variables) => ({
      namespace: "mission-control",
      name: "cluster-view",
      requestFingerprint: `primary:${variables?.namespace ?? "none"}`,
      variables: [
        {
          key: "namespace",
          value: "",
          type: "select",
          options: ["ns-a", "ns-b"],
          default: "ns-a"
        }
      ],
      sections: [
        {
          title: "Section A",
          viewRef: { namespace: "mission-control", name: "section-a" }
        },
        {
          title: "Section B",
          viewRef: { namespace: "mission-control", name: "section-b" }
        }
      ]
    }));

    mockedGetViewDataByNamespace.mockImplementation(
      async (namespace, name, variables) => ({
        namespace,
        name,
        requestFingerprint: `${name}:${variables?.namespace ?? "none"}`
      })
    );

    renderGlobalFilterTest("/");

    // Both sections show prefetched data
    await waitFor(() => {
      expect(screen.getByText("section-a:ns-a")).toBeInTheDocument();
    });
    expect(screen.getByText("section-b:ns-a")).toBeInTheDocument();

    // Change global filter
    fireEvent.click(screen.getByTestId("set-ns-b"));

    // Both sections should update
    await waitFor(() => {
      expect(screen.getByText("section-a:ns-b")).toBeInTheDocument();
    });
    expect(screen.getByText("section-b:ns-b")).toBeInTheDocument();
  });
});
