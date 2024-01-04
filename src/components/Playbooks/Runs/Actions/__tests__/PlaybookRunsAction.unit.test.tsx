import { fireEvent, render, screen } from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import {
  PlaybookRunAction,
  PlaybookRunWithActions
} from "../../../../../api/types/playbooks";
import PlaybookRunsActions from "./../PlaybookRunsActions";

const mockAction: PlaybookRunAction = {
  playbook_run_id: "1",
  id: "1",
  name: "Test Action",
  status: "completed",
  start_time: "2022-01-01T00:00:00Z",
  end_time: "2022-01-01T01:00:00Z"
};

const server = setupServer(
  rest.get("/api/db/playbook_run_actions", (req, res, ctx) => {
    return res(ctx.json([mockAction]));
  })
);

describe.skip("PlaybookRunsActions", () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it("renders correctly", async () => {
    const mockData: PlaybookRunWithActions = {
      id: "1",
      playbook_id: "1",
      playbooks: {
        name: "Test Playbook",
        id: "1",
        source: "UI",
        created_at: "2022-01-01T00:00:00Z",
        spec: {},
        updated_at: "2022-01-01T00:00:00Z"
      },
      status: "completed",
      start_time: "2022-01-01T00:00:00Z",
      end_time: "2022-01-01T01:00:00Z",
      created_at: "2022-01-01T00:00:00Z",
      actions: [
        {
          playbook_run_id: "1",
          id: "1",
          name: "Test Action 1",
          status: "completed",
          start_time: "2022-01-01T00:00:00Z",
          end_time: "2022-01-01T01:00:00Z"
        },
        {
          playbook_run_id: "1",
          id: "2",
          name: "Test Action 2",
          status: "completed",
          start_time: "2022-01-01T00:00:00Z",
          end_time: "2022-01-01T01:00:00Z"
        }
      ]
      // other fields as needed
    };

    render(<PlaybookRunsActions data={mockData} />);

    expect(screen.getByText("Test Playbook")).toBeInTheDocument();
    expect(screen.getByText("Test Action 1")).toBeInTheDocument();
    expect(screen.getByText("Test Action 2")).toBeInTheDocument();

    // Click on an action to trigger the network request
    fireEvent.click(screen.getByText("Test Action 1"));

    // Wait for the request to complete
    await screen.findByText(/some text from the response/i);
  });
});
