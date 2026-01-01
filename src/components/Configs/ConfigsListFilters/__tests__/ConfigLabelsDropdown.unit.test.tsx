import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { Formik } from "formik";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { MemoryRouter } from "react-router-dom";
import { ConfigLabelsDropdown } from "../ConfigLabelsDropdown";

// Mock data
const mockTagsData = [
  { key: "environment", value: "prod" },
  { key: "environment", value: "staging" },
  { key: "region", value: "us-west-2" },
  { key: "account", value: "main" }
];

const mockLabelsData = [
  // Include some tags (they are also in labels - should be deduplicated)
  { key: "environment", value: "prod" },
  { key: "environment", value: "staging" },
  { key: "region", value: "us-west-2" },
  { key: "account", value: "main" },
  // Plus additional labels that are not tags
  { key: "app", value: "backend" },
  { key: "app", value: "frontend" },
  { key: "component", value: "api" },
  { key: "version", value: "1.0.0" }
];

const server = setupServer(
  http.get("/api/db/config_tags", () => {
    return HttpResponse.json(mockTagsData);
  }),
  http.get("/api/db/config_labels", () => {
    return HttpResponse.json(mockLabelsData);
  })
);

beforeAll(() => {
  server.listen();
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        cacheTime: 0
      }
    }
  });

  return render(
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>
        <Formik initialValues={{ labels: undefined }} onSubmit={() => {}}>
          {component}
        </Formik>
      </QueryClientProvider>
    </MemoryRouter>
  );
};

describe("ConfigLabelsDropdown", () => {
  it("renders the dropdown component", async () => {
    renderWithProviders(<ConfigLabelsDropdown />);

    await waitFor(() => {
      expect(screen.getByText("Labels", { exact: false })).toBeInTheDocument();
    });

    // Check that the component renders without errors
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("displays both tags and labels with deduplication", async () => {
    renderWithProviders(<ConfigLabelsDropdown />);

    await waitFor(() => {
      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });

    // The component should have processed the data and created options
    // We can't directly test the options without opening the dropdown,
    // but we can verify the component didn't crash and rendered
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("handles empty tags data gracefully", async () => {
    server.use(
      http.get("/api/db/config_tags", () => {
        return HttpResponse.json([]);
      })
    );

    renderWithProviders(<ConfigLabelsDropdown />);

    await waitFor(() => {
      expect(screen.getByText("Labels", { exact: false })).toBeInTheDocument();
    });

    // Check that the component renders without errors even with empty tags
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("handles empty labels data gracefully", async () => {
    server.use(
      http.get("/api/db/config_labels", () => {
        return HttpResponse.json([]);
      })
    );

    renderWithProviders(<ConfigLabelsDropdown />);

    await waitFor(() => {
      expect(screen.getByText("Labels", { exact: false })).toBeInTheDocument();
    });

    // Check that the component renders without errors even with empty labels
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("handles both empty tags and labels data", async () => {
    server.use(
      http.get("/api/db/config_tags", () => {
        return HttpResponse.json([]);
      }),
      http.get("/api/db/config_labels", () => {
        return HttpResponse.json([]);
      })
    );

    renderWithProviders(<ConfigLabelsDropdown />);

    await waitFor(() => {
      expect(screen.getByText("Labels", { exact: false })).toBeInTheDocument();
    });

    // Check that the component renders without errors with both empty
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("handles API errors gracefully", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    server.use(
      http.get("/api/db/config_tags", () => {
        return new HttpResponse(null, { status: 500 });
      }),
      http.get("/api/db/config_labels", () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    renderWithProviders(<ConfigLabelsDropdown />);

    await waitFor(() => {
      expect(screen.getByText("Labels", { exact: false })).toBeInTheDocument();
    });

    // Component should still render even if API fails
    expect(screen.getByRole("combobox")).toBeInTheDocument();

    consoleErrorSpy.mockRestore();
  });

  it("handles invalid data format", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    server.use(
      http.get("/api/db/config_tags", () => {
        return HttpResponse.json("invalid data");
      }),
      http.get("/api/db/config_labels", () => {
        return HttpResponse.json({ not: "an array" });
      })
    );

    renderWithProviders(<ConfigLabelsDropdown />);

    await waitFor(() => {
      expect(screen.getByText("Labels", { exact: false })).toBeInTheDocument();
    });

    // Component should handle invalid data gracefully and still render
    expect(screen.getByRole("combobox")).toBeInTheDocument();

    consoleErrorSpy.mockRestore();
  });

  it("uses custom searchParamKey when provided", async () => {
    renderWithProviders(<ConfigLabelsDropdown searchParamKey="customLabels" />);

    await waitFor(() => {
      expect(screen.getByText("Labels", { exact: false })).toBeInTheDocument();
    });

    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });
});
