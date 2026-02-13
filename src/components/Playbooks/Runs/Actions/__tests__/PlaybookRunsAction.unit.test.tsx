import {
  PlaybookRunAction,
  PlaybookRunWithActions
} from "@flanksource-ui/api/types/playbooks";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PlaybookRunDetailView from "./../PlaybookRunsActions";
import * as playbooksApi from "../../../../../api/services/playbooks";
import { AiFeatureLoaderProvider } from "@flanksource-ui/ui/Layout/AiFeatureLoader";

const mockAction: PlaybookRunAction = {
  playbook_run_id: "1",
  id: "1",
  name: "Test Action",
  status: "completed",
  start_time: "2022-01-01T00:00:00Z",
  end_time: "2022-01-01T01:00:00Z",
  result: {
    stderr: "some text from the response"
  }
};

// Mock the API functions directly
jest.mock("../../../../../api/services/playbooks", () => ({
  ...jest.requireActual("../../../../../api/services/playbooks"),
  getPlaybookRunActionById: jest.fn()
}));

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false
      }
    }
  });

beforeEach(() => {
  (playbooksApi.getPlaybookRunActionById as jest.Mock).mockResolvedValue(
    mockAction
  );
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("PlaybookRunDetailView", () => {
  it("should have playbook metadaba", () => {
    const queryClient = createQueryClient();
    const mockData: PlaybookRunWithActions = {
      id: "1",
      playbook_id: "1",
      spec: {
        actions: []
      },
      playbooks: {
        name: "Test Playbook",
        id: "1",
        title: "Test Playbook",
        source: "UI",
        created_at: "2022-01-01T00:00:00Z",
        spec: {
          actions: []
        },
        updated_at: "2022-01-01T00:00:00Z"
      },
      status: "completed",
      start_time: "2022-01-01T00:00:00Z",
      end_time: "2022-01-01T01:00:00Z",
      created_at: "2022-01-01T00:00:00Z",
      actions: []
      // other fields as needed
    };

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AiFeatureLoaderProvider>
            <PlaybookRunDetailView data={mockData} />
          </AiFeatureLoaderProvider>
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(screen.getByText("Test Playbook")).toBeInTheDocument();
    // status
    expect(screen.getByText("completed")).toBeInTheDocument();
    // duration
    expect(screen.getByText("1h")).toBeInTheDocument();
  });

  it("renders correctly", async () => {
    const queryClient = createQueryClient();
    const mockData: PlaybookRunWithActions = {
      id: "1",
      playbook_id: "1",
      spec: {
        actions: []
      },
      playbooks: {
        name: "Test Playbook",
        id: "1",
        title: "Test Playbook",
        source: "UI",
        created_at: "2022-01-01T00:00:00Z",
        spec: {
          actions: []
        },
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

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AiFeatureLoaderProvider>
            <PlaybookRunDetailView data={mockData} />
          </AiFeatureLoaderProvider>
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(screen.getByText("Test Playbook")).toBeInTheDocument();
    expect(screen.getByText("Test Action 1")).toBeInTheDocument();
    expect(screen.getByText("Test Action 2")).toBeInTheDocument();

    // Click on an action to trigger the network request
    fireEvent.click(screen.getByText("Test Action 1"));

    // Wait for the request to complete and show the action result
    expect(
      await screen.findByText(/some text from the response/i)
    ).toBeInTheDocument();
  });

  it("renders correctly if playbook fails prematurely", async () => {
    const queryClient = createQueryClient();
    const mockData: PlaybookRunWithActions = {
      id: "1",
      playbook_id: "1",
      spec: {
        actions: []
      },
      playbooks: {
        name: "Test Playbook",
        id: "1",
        title: "Test Playbook",
        source: "UI",
        created_at: "2022-01-01T00:00:00Z",
        spec: {
          actions: []
        },
        updated_at: "2022-01-01T00:00:00Z"
      },
      error: "some error",
      status: "failed",
      start_time: "2022-01-01T00:00:00Z",
      end_time: "2022-01-01T01:00:00Z",
      created_at: "2022-01-01T00:00:00Z",
      actions: []
    };

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AiFeatureLoaderProvider>
            <PlaybookRunDetailView data={mockData} />
          </AiFeatureLoaderProvider>
        </MemoryRouter>
      </QueryClientProvider>
    );

    fireEvent.click(screen.getByText("Initialization"));

    expect(screen.getByText(/some error/i)).toBeInTheDocument();
  });
});
