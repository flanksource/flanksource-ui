import {
  addExternalUserAlias,
  mergeExternalUsers,
  searchExternalUsers
} from "../../../../api/services/configAccess";
import { ConfigAccessSummaryByUser } from "../../../../api/types/configs";
import { toastSuccess } from "../../../Toast/toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import {
  AddExternalUserAliasDialog,
  MergeExternalUserDialog
} from "../ExternalUserActions";

jest.mock("../../../../api/services/configAccess", () => ({
  addExternalUserAlias: jest.fn(),
  mergeExternalUsers: jest.fn(),
  searchExternalUsers: jest.fn()
}));

jest.mock(
  "../../../Authentication/useCurrentUser",
  () => () => "019f1234-5678-7abc-8def-0123456789ab"
);

jest.mock("../../../Toast/toast", () => ({
  toastError: jest.fn(),
  toastSuccess: jest.fn()
}));

jest.mock("../../../Dropdown/DropdownWithActions", () => ({
  DropdownWithActions: ({ onQuery, setValue, name }: any) => (
    <button
      type="button"
      onClick={async () => {
        const options = await onQuery("duplicate");
        const option = options[0];
        setValue(name, {
          ...option,
          value: option.value,
          description: option.description
        });
      }}
    >
      Select duplicate
    </button>
  )
}));

const mockedAddAlias = addExternalUserAlias as jest.MockedFunction<
  typeof addExternalUserAlias
>;
const mockedMerge = mergeExternalUsers as jest.MockedFunction<
  typeof mergeExternalUsers
>;
const mockedSearch = searchExternalUsers as jest.MockedFunction<
  typeof searchExternalUsers
>;

const primary: ConfigAccessSummaryByUser = {
  external_user_id: "10000000-0000-4000-8000-000000000001",
  user: "Primary User",
  email: "primary@example.com",
  access_count: 3,
  distinct_roles: 2,
  distinct_configs: 2
};

function renderWithQueryClient(component: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } }
  });
  const invalidate = jest
    .spyOn(queryClient, "invalidateQueries")
    .mockResolvedValue(undefined);

  render(
    <QueryClientProvider client={queryClient}>{component}</QueryClientProvider>
  );

  return { invalidate };
}

describe("external user actions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedAddAlias.mockResolvedValue({});
    mockedMerge.mockResolvedValue(primary.external_user_id);
    mockedSearch.mockResolvedValue([
      {
        id: "20000000-0000-4000-8000-000000000002",
        name: "Duplicate User",
        email: "duplicate@example.com"
      }
    ]);
  });

  it("normalizes and adds an alias to the selected user", async () => {
    const onOpenChange = jest.fn();
    const { invalidate } = renderWithQueryClient(
      <AddExternalUserAliasDialog
        user={primary}
        open
        onOpenChange={onOpenChange}
      />
    );

    fireEvent.change(screen.getByLabelText("Alias"), {
      target: { value: "  GitHub://SomeUser  " }
    });
    fireEvent.click(screen.getByRole("button", { name: "Add alias" }));

    await waitFor(() => {
      expect(mockedAddAlias).toHaveBeenCalledWith({
        externalUserId: primary.external_user_id,
        alias: "github://someuser",
        createdBy: "019f1234-5678-7abc-8def-0123456789ab"
      });
    });
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: ["config", "access-summary"]
    });
    expect(toastSuccess).toHaveBeenCalledWith(
      "Alias github://someuser was added"
    );
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("keeps the selected row as primary when merging", async () => {
    const onOpenChange = jest.fn();
    const { invalidate } = renderWithQueryClient(
      <MergeExternalUserDialog
        primary={primary}
        open
        onOpenChange={onOpenChange}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Select duplicate" }));

    await waitFor(() => {
      expect(mockedSearch).toHaveBeenCalledWith({
        query: "duplicate",
        excludeId: primary.external_user_id
      });
    });
    await screen.findByText(/soft-deleted/);

    fireEvent.click(screen.getByRole("button", { name: "Merge users" }));

    await waitFor(() => {
      expect(mockedMerge).toHaveBeenCalledWith({
        primaryId: primary.external_user_id,
        duplicateId: "20000000-0000-4000-8000-000000000002",
        createdBy: "019f1234-5678-7abc-8def-0123456789ab"
      });
    });
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: ["config", "access-summary"]
    });
    expect(toastSuccess).toHaveBeenCalledWith("External users were merged");
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
