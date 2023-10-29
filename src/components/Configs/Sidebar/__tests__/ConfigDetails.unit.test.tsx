import React from "react";
import { render, screen } from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { ConfigDetails } from "./../ConfigDetails";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";

const server = setupServer(
  rest.get("/api/db/config_items", (req, res, ctx) => {
    return res(
      ctx.json([
        {
          name: "Test Config",
          type: "Test Type",
          created_at: "2022-01-01T00:00:00.000Z",
          updated_at: "2022-01-02T00:00:00.000Z",
          tags: {
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
          <ConfigDetails configId={configId} isCollapsed={false} />
        </QueryClientProvider>
      </MemoryRouter>
    );
    expect(await screen.findByText("Test Config")).toBeInTheDocument();
  });

  it("renders the tags", async () => {
    render(
      <MemoryRouter>
        <QueryClientProvider client={queryClient}>
          <ConfigDetails configId={configId} isCollapsed={false} />
        </QueryClientProvider>
      </MemoryRouter>
    );
    expect(await screen.findByText("Tag 1")).toBeInTheDocument();
    expect(await screen.findByText("Subtag 1")).toBeInTheDocument();
    expect(await screen.findByText("Subtag 2")).toBeInTheDocument();
  });
});
