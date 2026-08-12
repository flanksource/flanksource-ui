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
    expect(params.get("user_type")).toBe("neq.group");
    expect(params.get("id")).toBe("neq.10000000-0000-4000-8000-000000000001");
    expect(params.get("or")).toBe(
      String.raw`(name.ilike."*dup*",email.ilike."*dup*",aliases.cs."{\"dup\"}")`
    );
    expect(params.get("limit")).toBe("20");
  });

  it("quotes reserved characters in URI alias searches", async () => {
    mockedGet.mockResolvedValue({ data: [] });

    await searchExternalUsers({ query: "GitHub://Some.User" });

    const requestURL = mockedGet.mock.calls[0][0] as string;
    const params = new URLSearchParams(requestURL.split("?")[1]);
    expect(params.get("or")).toBe(
      String.raw`(name.ilike."*GitHub://Some.User*",email.ilike."*GitHub://Some.User*",aliases.cs."{\"github://some.user\"}")`
    );
  });

  it("quotes email searches containing periods", async () => {
    mockedGet.mockResolvedValue({ data: [] });

    await searchExternalUsers({ query: "user@example.com" });

    const requestURL = mockedGet.mock.calls[0][0] as string;
    const params = new URLSearchParams(requestURL.split("?")[1]);
    expect(params.get("or")).toBe(
      String.raw`(name.ilike."*user@example.com*",email.ilike."*user@example.com*",aliases.cs."{\"user@example.com\"}")`
    );
  });

  it("preserves escaped backslashes in text and alias searches", async () => {
    mockedGet.mockResolvedValue({ data: [] });

    await searchExternalUsers({ query: String.raw`GitHub://Some.User\Name` });

    const requestURL = mockedGet.mock.calls[0][0] as string;
    const params = new URLSearchParams(requestURL.split("?")[1]);
    expect(params.get("or")).toBe(
      String.raw`(name.ilike."*GitHub://Some.User\\\\Name*",email.ilike."*GitHub://Some.User\\\\Name*",aliases.cs."{\"github://some.user\\\\name\"}")`
    );
  });

  it("strips PostgREST grammar characters from free-text searches", async () => {
    mockedGet.mockResolvedValue({ data: [] });

    await searchExternalUsers({ query: "a,b)(c" });

    const requestURL = mockedGet.mock.calls[0][0] as string;
    const params = new URLSearchParams(requestURL.split("?")[1]);
    expect(params.get("or")).toBe(
      `(name.ilike."*a b c*",email.ilike."*a b c*")`
    );
  });

  it("returns no matches when a non-empty search sanitizes to empty", async () => {
    const result = await searchExternalUsers({ query: `(*,)%"{}` });

    expect(result).toEqual([]);
    expect(mockedGet).not.toHaveBeenCalled();
  });

  it("keeps an actually empty search unfiltered", async () => {
    mockedGet.mockResolvedValue({ data: [] });

    await searchExternalUsers({ query: "   " });

    const requestURL = mockedGet.mock.calls[0][0] as string;
    const params = new URLSearchParams(requestURL.split("?")[1]);
    expect(params.has("or")).toBe(false);
  });

  it("escapes underscores in case-insensitive text filters", async () => {
    mockedGet.mockResolvedValue({ data: [] });

    await searchExternalUsers({ query: "a_b" });

    const requestURL = mockedGet.mock.calls[0][0] as string;
    const params = new URLSearchParams(requestURL.split("?")[1]);
    expect(params.get("or")).toBe(
      String.raw`(name.ilike."*a\\_b*",email.ilike."*a\\_b*",aliases.cs."{\"a_b\"}")`
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
      alias: "  GitHub://User  ",
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
