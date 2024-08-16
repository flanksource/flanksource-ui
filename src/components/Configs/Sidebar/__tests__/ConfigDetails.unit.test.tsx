import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { MemoryRouter } from "react-router-dom";
import { ConfigDetails } from "./../ConfigDetails";

const server = setupServer(
  rest.get("/api/db/config_detail", (req, res, ctx) => {
    return res(
      ctx.json([
        {
          name: "Test Config",
          type: "Test Type",
          created_at: "2022-01-01T00:00:00.000Z",
          updated_at: "2022-01-02T00:00:00.000Z",
          config_scrapers: {
            id: "config_scraper_id",
            name: "Test Scraper"
          },
          labels: {
            "Tag 1": "Value 1",
            "Tag 2/Subtag 1": "Value 2",
            "Tag 2/Subtag 2": "Value 3"
          }
        }
      ])
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const queryClient = new QueryClient({});

describe("ConfigDetails", () => {
  const configId = "123";

  it("renders the config name", async () => {
    render(
      <MemoryRouter>
        <QueryClientProvider client={queryClient}>
          <ConfigDetails configId={configId} />
        </QueryClientProvider>
      </MemoryRouter>
    );
    expect(await screen.findByText("Test Config")).toBeInTheDocument();
  });

  it("renders the tags", async () => {
    render(
      <MemoryRouter>
        <QueryClientProvider client={queryClient}>
          <ConfigDetails configId={configId} />
        </QueryClientProvider>
      </MemoryRouter>
    );
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
