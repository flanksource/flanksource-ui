import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ConfigDetails } from "./../ConfigDetails";
import { Provider as JotaiProvider } from "jotai";
import * as configsApi from "../../../../api/services/configs";

const mockConfigDetail = {
  id: "123",
  name: "Test Config",
  type: "Test Type",
  created_at: "2022-01-01T00:00:00.000Z",
  updated_at: "2022-01-02T00:00:00.000Z",
  scraper: {
    id: "config_scraper_id",
    name: "Test Scraper"
  },
  labels: {
    "Tag 1": "Value 1",
    "Tag 2/Subtag 1": "Value 2",
    "Tag 2/Subtag 2": "Value 3"
  }
};

// Mock the API functions directly
jest.mock("../../../../api/services/configs", () => ({
  ...jest.requireActual("../../../../api/services/configs"),
  getConfig: jest.fn(),
  getConfigParentsByLocation: jest.fn()
}));

beforeEach(() => {
  (configsApi.getConfig as jest.Mock).mockResolvedValue({
    data: [mockConfigDetail],
    error: null,
    totalEntries: 1
  });
  (configsApi.getConfigParentsByLocation as jest.Mock).mockResolvedValue([]);
});

afterEach(() => {
  jest.clearAllMocks();
});

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0
      }
    }
  });
  return render(
    <JotaiProvider>
      <MemoryRouter>
        <QueryClientProvider client={queryClient}>
          {component}
        </QueryClientProvider>
      </MemoryRouter>
    </JotaiProvider>
  );
};

describe("ConfigDetails", () => {
  const configId = "123";

  it("renders the config name", async () => {
    renderWithProviders(<ConfigDetails configId={configId} />);
    expect(await screen.findByText("Test Config")).toBeInTheDocument();
  });

  it("renders the tags", async () => {
    renderWithProviders(<ConfigDetails configId={configId} />);
    expect(await screen.findByText("Tag 1")).toBeInTheDocument();
    expect(await screen.findByText("Subtag 1")).toBeInTheDocument();
    expect(await screen.findByText("Subtag 2")).toBeInTheDocument();

    expect(await screen.findByText("Value 1")).toBeInTheDocument();
    expect(await screen.findByText("Value 2")).toBeInTheDocument();
    expect(await screen.findByText("Value 3")).toBeInTheDocument();

    expect(await screen.findByText("Tag 2")).toBeInTheDocument();

    // created at and updated at
    expect(screen.getByText("Created")).toBeInTheDocument();
    expect(screen.getByText("Updated")).toBeInTheDocument();

    expect(screen.queryByText("Created At")).not.toBeInTheDocument();
    expect(screen.queryByText("Updated At")).not.toBeInTheDocument();

    // expect the scraper name to be a link
    expect(
      screen.getByRole("link", {
        name: "Test Scraper"
      })
    ).toHaveAttribute(
      "href",
      expect.stringContaining("/catalog/scrapers/config_scraper_id")
    );
  });
});
