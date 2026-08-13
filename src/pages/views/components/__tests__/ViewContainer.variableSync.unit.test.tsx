// Reproduces duplicate view fetches on load and the variable dropdown
// reverting to its default when global filters change.
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, useLocation } from "react-router-dom";
import ViewContainer from "../ViewContainer";
import * as viewsApi from "../../../../api/services/views";

jest.mock("../../../../api/services/views", () => ({
  ...jest.requireActual("../../../../api/services/views"),
  getViewDataById: jest.fn(),
  getViewMetadataById: jest.fn(),
  getViewDataByNamespace: jest.fn(),
  getViewDisplayPluginVariables: jest.fn()
}));

// The audit-report View renders panels/tables and issues its own table query,
// neither of which participate in the variable ↔ URL sync under test.
jest.mock("../../../audit-report/components/View/View", () => ({
  __esModule: true,
  default: ({ requestFingerprint }: { requestFingerprint: string }) => (
    <div data-testid="view-fingerprint">{requestFingerprint}</div>
  )
}));

// Replace the react-windowed-select widget with a native <select> so the real
// GlobalFilters / GlobalFiltersForm logic stays under test but is drivable.
jest.mock("../../../../ui/Dropdowns/MultiSelectDropdown", () => ({
  __esModule: true,
  MultiSelectDropdown: ({ label, options, value, onChange }: any) => (
    <select
      aria-label={label}
      value={value?.value ?? ""}
      onChange={(e) =>
        onChange(options.find((o: any) => o.value === e.target.value))
      }
    >
      {options.map((o: any) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
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

const searchHistory: string[] = [];

function SearchRecorder() {
  const { search } = useLocation();
  if (searchHistory[searchHistory.length - 1] !== search) {
    searchHistory.push(search);
  }
  return null;
}

function renderView(initialPath = "/") {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } }
  });

  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <QueryClientProvider client={queryClient}>
        <SearchRecorder />
        <ViewContainer id="view-1" />
      </QueryClientProvider>
    </MemoryRouter>
  );
}

const namespaceVariable = {
  key: "namespace",
  value: "",
  type: "select",
  options: ["ns-a", "ns-b"],
  default: "ns-a"
};

const clusterVariable = {
  key: "cluster",
  value: "",
  type: "select",
  options: ["c1", "c2"],
  default: "c1"
};

const sections = [
  {
    title: "Section A",
    viewRef: { namespace: "mission-control", name: "section-a" }
  }
];

beforeEach(() => {
  jest.resetAllMocks();
  searchHistory.length = 0;
});

describe("view loading with variables", () => {
  it("does not re-fetch the view or its prefetched sections when the form writes default variables to the URL", async () => {
    mockedGetViewMetadataById.mockResolvedValue({
      id: "view-1",
      namespace: "mission-control",
      name: "cluster-view",
      requestFingerprint: "primary:none",
      variables: [namespaceVariable],
      sections,
      sectionResults: {
        "mission-control/section-a": {
          namespace: "mission-control",
          name: "section-a",
          requestFingerprint: "section:ns-a",
          variables: [namespaceVariable]
        }
      }
    });

    mockedGetViewDataById.mockImplementation(async (_id, variables) => ({
      namespace: "mission-control",
      name: "cluster-view",
      requestFingerprint: `primary:${variables?.namespace ?? "none"}`,
      variables: [namespaceVariable],
      sections
    }));

    mockedGetViewDataByNamespace.mockImplementation(
      async (namespace, name, variables) => ({
        namespace,
        name,
        requestFingerprint: `section:${variables?.namespace ?? "none"}`,
        variables: [namespaceVariable]
      })
    );

    renderView("/");

    await screen.findByLabelText("Namespace");
    // Let every knock-on fetch settle.
    await new Promise((resolve) => setTimeout(resolve, 100));

    // The default really was written to the URL — without this the request
    // counts below could pass simply because no sync happened at all.
    expect(searchHistory[searchHistory.length - 1]).toContain(
      "viewvar__namespace=ns-a"
    );

    expect({
      metadata: mockedGetViewMetadataById.mock.calls.length,
      viewData: mockedGetViewDataById.mock.calls.length,
      sectionData: mockedGetViewDataByNamespace.mock.calls.length
    }).toEqual({ metadata: 1, viewData: 0, sectionData: 0 });
  });
});

describe("changing a global filter", () => {
  it("keeps a section-provided variable selection instead of reverting to its default", async () => {
    // `cluster` is defined only by the top-level view; `namespace` only by the
    // section — the common aggregator-dashboard shape.
    mockedGetViewMetadataById.mockResolvedValue({
      id: "view-1",
      namespace: "mission-control",
      name: "cluster-view",
      requestFingerprint: "primary:none",
      variables: [clusterVariable],
      sections,
      sectionResults: {
        "mission-control/section-a": {
          namespace: "mission-control",
          name: "section-a",
          requestFingerprint: "section:ns-a",
          variables: [namespaceVariable]
        }
      }
    });

    mockedGetViewDataById.mockImplementation(async (_id, variables) => ({
      namespace: "mission-control",
      name: "cluster-view",
      requestFingerprint: `primary:${variables?.namespace ?? "none"}`,
      variables: [clusterVariable],
      sections
    }));

    mockedGetViewDataByNamespace.mockImplementation(
      async (namespace, name, variables) => ({
        namespace,
        name,
        requestFingerprint: `section:${variables?.namespace ?? "none"}`,
        variables: [namespaceVariable]
      })
    );

    renderView("/");

    const namespaceSelect = await screen.findByLabelText("Namespace");
    await screen.findByLabelText("Cluster");

    await userEvent.selectOptions(namespaceSelect, "ns-b");

    await waitFor(() => {
      expect(screen.getByLabelText("Namespace")).toHaveValue("ns-b");
    });

    // The selection must survive the refetch it triggers.
    await new Promise((resolve) => setTimeout(resolve, 300));

    expect(screen.getByLabelText("Namespace")).toHaveValue("ns-b");
    expect(searchHistory[searchHistory.length - 1]).toContain(
      "viewvar__namespace=ns-b"
    );

    // Changing a second variable must not clobber the first: each write
    // touches only its own key.
    await userEvent.selectOptions(screen.getByLabelText("Cluster"), "c2");
    await new Promise((resolve) => setTimeout(resolve, 300));

    expect(screen.getByLabelText("Cluster")).toHaveValue("c2");
    expect(screen.getByLabelText("Namespace")).toHaveValue("ns-b");
  });
});

describe("resetting a global filter to its default", () => {
  it("renders the metadata result rather than the retained non-default data", async () => {
    mockedGetViewMetadataById.mockResolvedValue({
      id: "view-1",
      namespace: "mission-control",
      name: "cluster-view",
      requestFingerprint: "primary:default",
      variables: [namespaceVariable]
    });

    mockedGetViewDataById.mockImplementation(async (_id, variables) => ({
      namespace: "mission-control",
      name: "cluster-view",
      requestFingerprint: `primary:${variables?.namespace ?? "none"}`,
      variables: [namespaceVariable]
    }));

    renderView("/");

    const namespaceSelect = await screen.findByLabelText("Namespace");
    await waitFor(() => {
      expect(screen.getByTestId("view-fingerprint")).toHaveTextContent(
        "primary:default"
      );
    });

    await userEvent.selectOptions(namespaceSelect, "ns-b");
    await waitFor(() => {
      expect(screen.getByTestId("view-fingerprint")).toHaveTextContent(
        "primary:ns-b"
      );
    });

    // Back to the default: the data query switches off, so the metadata
    // result — not the retained ns-b response — is what should render.
    await userEvent.selectOptions(screen.getByLabelText("Namespace"), "ns-a");

    await waitFor(() => {
      expect(screen.getByTestId("view-fingerprint")).toHaveTextContent(
        "primary:default"
      );
    });
  });
});
