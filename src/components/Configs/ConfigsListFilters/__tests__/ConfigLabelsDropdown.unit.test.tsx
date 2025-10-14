import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Formik } from "formik";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { MemoryRouter } from "react-router-dom";
import { ConfigLabelsDropdown } from "../ConfigLabelsDropdown";

const mockTagsData = [
  { key: "account", value: "prod" },
  { key: "environment", value: "staging" },
  { key: "region", value: "us-west-2" }
];

const mockLabelsData = [
  { key: "app", value: "web" },
  { key: "component", value: "frontend" },
  { key: "version", value: "1.0.0" }
];

const server = setupServer(
  rest.get("/api/db/config_tags", (req, res, ctx) => {
    return res(ctx.json(mockTagsData));
  }),
  rest.get("/api/db/config_labels", (req, res, ctx) => {
    return res(ctx.json(mockLabelsData));
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

    // Wait for the dropdown to be rendered
    await waitFor(() => {
      expect(screen.getByText("Labels", { exact: false })).toBeInTheDocument();
    });

    // Check that the component renders without errors
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("handles empty tags data gracefully", async () => {
    server.use(
      rest.get("/api/db/config_tags", (req, res, ctx) => {
        return res(ctx.json([]));
      })
    );

    renderWithProviders(<ConfigLabelsDropdown />);

    await waitFor(() => {
      expect(screen.getByText("Labels", { exact: false })).toBeInTheDocument();
    });

    // Check that the component renders without errors
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("handles empty labels data gracefully", async () => {
    server.use(
      rest.get("/api/db/config_labels", (req, res, ctx) => {
        return res(ctx.json([]));
      })
    );

    renderWithProviders(<ConfigLabelsDropdown />);

    await waitFor(() => {
      expect(screen.getByText("Labels", { exact: false })).toBeInTheDocument();
    });

    // Check that the component renders without errors
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });
});
