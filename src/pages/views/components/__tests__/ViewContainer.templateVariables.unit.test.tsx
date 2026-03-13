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

  it("loads primary view via metadata endpoint", async () => {
    renderWithProviders("/");

    await waitFor(() => {
      expect(screen.getByTestId("view-fingerprint")).toHaveTextContent(
        "primary:none"
      );
    });

    expect(mockedGetViewMetadataById).toHaveBeenCalledWith("view-1", undefined);
    expect(mockedGetViewDataById).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "Set namespace ns-a" }));

    await waitFor(() => {
      expect(screen.getByTestId("view-fingerprint")).toHaveTextContent(
        "primary:none"
      );
    });

    expect(mockedGetViewDataById).not.toHaveBeenCalled();
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

  it("does not refetch sections when URL vars match defaults", async () => {
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

    renderWithProviders("/?viewvar__namespace=ns-a");

    await waitFor(() => {
      expect(screen.getByText("prefetched-section")).toBeInTheDocument();
    });

    expect(mockedGetViewDataByNamespace).not.toHaveBeenCalled();
  });
});
