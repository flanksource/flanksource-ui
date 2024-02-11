import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { MemoryRouter } from "react-router-dom";
import ConfigGroupByDropdown from "../ConfigGroupByDropdown";

const server = setupServer(
  rest.get("/api/db/configs", (req, res, ctx) => {
    return res(
      ctx.json([
        {
          id: "1",
          name: "Config 1",
          tags: {
            tag1: "value1",
            tag2: "value2"
          }
        },
        {
          id: "2",
          name: "Config 2",
          tags: {
            tag3: "value3",
            tag4: "value4"
          }
        }
      ])
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const queryClient = new QueryClient();

describe("GroupByDropdown", () => {
  it("renders the dropdown with the provided value", async () => {
    render(
      <MemoryRouter>
        <QueryClientProvider client={queryClient}>
          <ConfigGroupByDropdown value="name" />
        </QueryClientProvider>
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText("Group By:")).toBeInTheDocument();
    });
    expect(screen.getByText("Name")).toBeInTheDocument();
  });

  it("renders the dropdown with the tag options", async () => {
    render(
      <MemoryRouter>
        <QueryClientProvider client={queryClient}>
          <ConfigGroupByDropdown />
        </QueryClientProvider>
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText("Group By:")).toBeInTheDocument();
    });

    userEvent.click(screen.getByText("Group By:"));

    await expect(screen.findByText(/Tag1/i)).resolves.toBeInTheDocument();
    await expect(screen.findByText(/Tag2/i)).resolves.toBeInTheDocument();
    await expect(screen.findByText(/Tag3/i)).resolves.toBeInTheDocument();
    await expect(screen.findByText(/Tag4/i)).resolves.toBeInTheDocument();
  });

  it("calls the onChange function when a new option is selected", async () => {
    const onChange = jest.fn();
    render(
      <MemoryRouter>
        <QueryClientProvider client={queryClient}>
          <ConfigGroupByDropdown onChange={onChange} />
        </QueryClientProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Group By:")).toBeInTheDocument();
    });

    userEvent.click(screen.getByText("Group By:"));

    await expect(screen.findByText(/Tag1/i)).resolves.toBeInTheDocument();

    userEvent.click(screen.getByText(/Tag1/i));

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith("tag1");
    });
  });
});
