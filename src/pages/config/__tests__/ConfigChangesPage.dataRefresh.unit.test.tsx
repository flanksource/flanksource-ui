import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, useSearchParams } from "react-router-dom";

jest.mock("jotai", () => ({
  atom: jest.fn((value) => ({ value })),
  useAtom: () => [0, jest.fn()],
  useAtomValue: (atomValue: { value?: unknown }) => atomValue?.value
}));

jest.mock("../../../api/query-hooks/useConfigChangesHooks", () => {
  const refetch = jest.fn();
  const unfilteredResponse = {
    total: 1,
    summary: {},
    changes: [
      {
        id: "created-change",
        config_id: "created-config",
        type: "Kubernetes::Pod",
        name: "Created config",
        change_type: "Created",
        summary: "stale unfiltered response",
        created_at: "2026-04-29T00:00:00Z",
        inserted_at: "2026-04-29T00:00:00Z"
      }
    ]
  };
  const filteredResponse = {
    total: 1,
    summary: {},
    changes: [
      {
        id: "updated-change",
        config_id: "updated-config",
        type: "Kubernetes::Pod",
        name: "Updated config",
        change_type: "Updated",
        summary: "filtered updated response",
        created_at: "2026-04-29T00:00:00Z",
        inserted_at: "2026-04-29T00:00:00Z"
      }
    ]
  };

  return {
    useGetAllConfigsChangesQuery: () => {
      const [params] = useSearchParams();
      const filtered = params.get("changeType") === "Updated:1";
      return {
        data: filtered ? filteredResponse : unfilteredResponse,
        isLoading: false,
        isRefetching: false,
        error: null,
        refetch
      };
    }
  };
});

jest.mock(
  "../../../components/Configs/Changes/ConfigChangesFilters/ConfigChangesFilters",
  () => ({
    ConfigChangeFilters: () => {
      const [, setParams] = useSearchParams();
      return (
        <button
          type="button"
          onClick={() => setParams({ changeType: "Updated:1" })}
        >
          Filter Updated changes
        </button>
      );
    }
  })
);

jest.mock(
  "../../../api/query-hooks/useGetConfigChangesByConfigChangeIdQuery",
  () => ({
    useGetConfigChangesById: () => ({ data: undefined, isLoading: false })
  })
);

jest.mock(
  "../../../components/Configs/Changes/ConfigDetailsChanges/ConfigDetailsChanges",
  () => ({
    ConfigDetailChangeModal: () => null
  })
);

jest.mock("../../../components/Configs/ConfigLink/ConfigLink", () => ({
  __esModule: true,
  default: ({ config }: { config?: { name?: string } }) => (
    <span>{config?.name}</span>
  )
}));

jest.mock("../../../components/Users/GetUserAvatar", () => ({
  __esModule: true,
  default: ({ userID }: { userID: string }) => <span>{userID}</span>
}));

jest.mock("../../../ui/Age", () => ({
  Age: ({ from }: { from?: string }) => <span>{from}</span>
}));

jest.mock("../../../ui/Icons/ChangeIcon", () => ({
  ChangeIcon: () => null
}));

jest.mock("../../../components/Configs/ConfigPageTabs", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  )
}));

jest.mock("../../../components/Configs/ConfigsTypeIcon", () => ({
  __esModule: true,
  default: () => null
}));

jest.mock("../../../components/InfoMessage", () => ({
  InfoMessage: ({ message }: { message: string }) => <div>{message}</div>
}));

jest.mock("../../../ui/BreadcrumbNav", () => ({
  BreadcrumbNav: () => null,
  BreadcrumbRoot: ({ children }: { children: React.ReactNode }) => (
    <span>{children}</span>
  ),
  BreadcrumbChild: ({ children }: { children: React.ReactNode }) => (
    <span>{children}</span>
  )
}));

jest.mock("../../../ui/Head", () => ({
  Head: () => null
}));

jest.mock("../../../ui/Layout/SearchLayout", () => ({
  SearchLayout: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  )
}));

jest.mock("../../../ui/SlidingSideBar/SlidingSideBar", () => ({
  refreshButtonClickedTrigger: {}
}));

jest.mock("../../../ui/FormControls/Toggle", () => ({
  Toggle: () => null
}));

const { ConfigChangesPage } = require("../ConfigChangesPage");

describe("ConfigChangesPage", () => {
  it("refreshes the rendered changes when the change type filter changes", async () => {
    render(
      <MemoryRouter initialEntries={["/catalog/changes"]}>
        <ConfigChangesPage />
      </MemoryRouter>
    );

    expect(
      await screen.findByText("stale unfiltered response")
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "Filter Updated changes" })
    );

    await waitFor(() => {
      expect(screen.getByText("filtered updated response")).toBeInTheDocument();
    });
    expect(
      screen.queryByText("stale unfiltered response")
    ).not.toBeInTheDocument();
  });
});
