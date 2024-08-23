import { Topology } from "@flanksource-ui/api/types/topology";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { MemoryRouter } from "react-router-dom";
import TopologyDetails from "./../TopologyDetails";

const mockDataComponent = {
  id: "component_UUID",
  type: "mockType",
  topologies: {
    id: "topology_UUID",
    name: "topology_name"
  }
};

const server = setupServer(
  rest.get("/api/db/components", (req, res, ctx) => {
    return res(ctx.json([mockDataComponent]));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const queryClient = new QueryClient();

describe("TopologyDetails", () => {
  test("renders topology details correctly", async () => {
    const topology: Topology = {
      type: "mockType",
      id: "123",
      name: "Topology Name",
      properties: [
        {
          name: "cpu",
          value: 500,
          label: "cpu",
          headline: true,
          unit: "millicore"
        },
        { name: "group1:property1", namespace: "namespace1" },
        { name: "group1:property2" },
        { name: "group2:property3" },
        { name: "grp3/property4" },
        { name: "grp3/property5" },
        { name: "region" },
        { name: "zone" },
        { name: "os" },
        { name: "arch" }
      ],
      labels: {
        label1: "value1",
        label2: "value2"
      },
      created_at: "2021-06-03T12:00:00.000Z",
      updated_at: "2021-06-03T12:00:00.000Z"
    };

    const refererId = "456";
    const isCollapsed = false;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <TopologyDetails
            topology={topology}
            refererId={refererId}
            isCollapsed={isCollapsed}
          />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(await screen.findByTestId("type-link")).toHaveAttribute(
      "href",
      expect.stringContaining("/topology?type=mockType")
    );

    // assert for created_at, updated_at, deleted_at
    expect(screen.getByText(/Created/i)).toBeInTheDocument();
    expect(screen.getByText(/Updated/i)).toBeInTheDocument();
    expect(screen.queryByText(/Deleted/i)).not.toBeInTheDocument();

    // assert for labels
    expect(screen.getByText(/label1/i)).toBeInTheDocument();
    expect(screen.getByText(/value1/i)).toBeInTheDocument();
    expect(screen.getByText(/label2/i)).toBeInTheDocument();

    // assert for properties
    // expect(screen.getByText(/cpu/i)).toBeInTheDocument();
    // expect(screen.getByText("0.50")).toBeInTheDocument();
    expect(screen.getByText(/group1/i)).toBeInTheDocument();
    expect(screen.getByText(/property1/i)).toBeInTheDocument();
    expect(screen.getByText(/property2/i)).toBeInTheDocument();
    expect(screen.getByText(/group2/i)).toBeInTheDocument();
    expect(screen.getByText(/property3/i)).toBeInTheDocument();
    expect(screen.getByText(/grp3/i)).toBeInTheDocument();
    expect(screen.getByText(/property4/i)).toBeInTheDocument();
    expect(screen.getByText(/property5/i)).toBeInTheDocument();
    expect(screen.getByText(/region/i)).toBeInTheDocument();
    expect(screen.getByText(/zone/i)).toBeInTheDocument();
    expect(screen.getByText(/os/i)).toBeInTheDocument();
    expect(screen.getByText(/arch/i)).toBeInTheDocument();
  });
});
