import { ConfigDB } from "../../axios";
import {
  addExternalUserAlias,
  mergeExternalUsers,
  searchExternalUsers
} from "../configAccess";

jest.mock("../../axios", () => ({
  ConfigDB: {
    get: jest.fn(),
    post: jest.fn()
  }
}));

const mockedGet = ConfigDB.get as jest.MockedFunction<typeof ConfigDB.get>;
const mockedPost = ConfigDB.post as jest.MockedFunction<typeof ConfigDB.post>;

describe("external user mapping API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("searches active external users on the server and excludes the primary", async () => {
    mockedGet.mockResolvedValue({
      data: [{ id: "20000000-0000-4000-8000-000000000002", name: "Duplicate" }]
    });

    const result = await searchExternalUsers({
      query: "dup",
      excludeId: "10000000-0000-4000-8000-000000000001"
    });

    expect(result).toHaveLength(1);
    const requestURL = mockedGet.mock.calls[0][0] as string;
    const params = new URLSearchParams(requestURL.split("?")[1]);
    expect(requestURL.startsWith("/external_users?")).toBe(true);
    expect(params.get("select")).toBe("id,name,email,aliases,user_type");
    expect(params.get("deleted_at")).toBe("is.null");
    expect(params.get("id")).toBe("neq.10000000-0000-4000-8000-000000000001");
    expect(params.get("or")).toBe(
      "(name.ilike.*dup*,email.ilike.*dup*,aliases.cs.{dup})"
    );
    expect(params.get("limit")).toBe("20");
  });

  it("normalizes alias searches while preserving case-insensitive text search", async () => {
    mockedGet.mockResolvedValue({ data: [] });

    await searchExternalUsers({ query: "GitHub://SomeUser" });

    const requestURL = mockedGet.mock.calls[0][0] as string;
    const params = new URLSearchParams(requestURL.split("?")[1]);
    expect(params.get("or")).toBe(
      "(name.ilike.*GitHub://SomeUser*,email.ilike.*GitHub://SomeUser*,aliases.cs.{github://someuser})"
    );
  });

  it("searches any PostgreSQL UUID, including UUIDv7", async () => {
    mockedGet.mockResolvedValue({ data: [] });
    const uuidV7 = "019f1234-5678-7abc-8def-0123456789ab";

    await searchExternalUsers({ query: uuidV7 });

    const requestURL = mockedGet.mock.calls[0][0] as string;
    const params = new URLSearchParams(requestURL.split("?")[1]);
    expect(params.get("or")).toContain(`id.eq.${uuidV7}`);
  });

  it("posts a normalized alias mapping payload", async () => {
    mockedPost.mockResolvedValue({ data: { alias: "github://user" } });

    await addExternalUserAlias({
      externalUserId: "10000000-0000-4000-8000-000000000001",
      alias: "github://user",
      createdBy: "30000000-0000-4000-8000-000000000003"
    });

    expect(mockedPost).toHaveBeenCalledWith("/rpc/add_external_user_alias", {
      p_external_user_id: "10000000-0000-4000-8000-000000000001",
      p_alias: "github://user",
      p_created_by: "30000000-0000-4000-8000-000000000003"
    });
  });

  it("posts the selected row as the merge primary", async () => {
    mockedPost.mockResolvedValue({
      data: "10000000-0000-4000-8000-000000000001"
    });

    await mergeExternalUsers({
      primaryId: "10000000-0000-4000-8000-000000000001",
      duplicateId: "20000000-0000-4000-8000-000000000002"
    });

    expect(mockedPost).toHaveBeenCalledWith("/rpc/merge_external_users", {
      p_primary_id: "10000000-0000-4000-8000-000000000001",
      p_duplicate_id: "20000000-0000-4000-8000-000000000002"
    });
  });
});
