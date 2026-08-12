import { ConfigDB } from "../../axios";
import {
  getConfigAccessSummaryByGroup,
  getConfigAccessSummaryByUser
} from "../configAccess";

jest.mock("../../axios", () => ({
  ConfigDB: {
    get: jest.fn()
  }
}));

const mockedGet = ConfigDB.get as jest.MockedFunction<typeof ConfigDB.get>;

describe("grouped config access API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedGet.mockResolvedValue({ data: [], headers: {} });
  });

  it("queries the user-only summary view", async () => {
    await getConfigAccessSummaryByUser({
      configType: "Kubernetes::Pod",
      pageIndex: 1,
      pageSize: 25
    });

    const requestURL = mockedGet.mock.calls[0][0] as string;
    const params = new URLSearchParams(requestURL.split("?")[1]);

    expect(requestURL.startsWith("/config_access_summary_by_user?")).toBe(true);
    expect(params.get("config_types")).toBe("cs.{Kubernetes::Pod}");
    expect(params.get("limit")).toBe("25");
    expect(params.get("offset")).toBe("25");
  });

  it("queries the group-only summary view", async () => {
    await getConfigAccessSummaryByGroup({
      configType: "Kubernetes::Pod",
      pageIndex: 0,
      pageSize: 50,
      sortBy: "group",
      sortOrder: "asc"
    });

    const requestURL = mockedGet.mock.calls[0][0] as string;
    const params = new URLSearchParams(requestURL.split("?")[1]);

    expect(requestURL.startsWith("/config_access_summary_by_group?")).toBe(
      true
    );
    expect(params.get("select")).toContain("external_group_id");
    expect(params.get("config_types")).toBe("cs.{Kubernetes::Pod}");
    expect(params.get("order")).toBe("group.asc");
  });
});
