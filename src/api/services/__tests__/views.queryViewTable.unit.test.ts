import { queryViewTable } from "../views";
import { ConfigDB } from "../../axios";
import { resolvePostGrestRequestWithPagination } from "../../resolve";
import { tristateOutputToQueryFilterParam } from "../../../ui/Dropdowns/TristateReactSelect";
import { buildLabelFilterQueries } from "../../utils/labels";
import type { ViewColumnDef } from "../../../pages/audit-report/types";

jest.mock("../../axios", () => ({
  ConfigDB: {
    get: jest.fn()
  },
  ViewAPI: {
    get: jest.fn()
  }
}));

jest.mock("../../resolve", () => ({
  resolvePostGrestRequestWithPagination: jest.fn()
}));

jest.mock("../../../ui/Dropdowns/TristateReactSelect", () => ({
  tristateOutputToQueryFilterParam: jest.fn()
}));

jest.mock("../../utils/labels", () => ({
  buildLabelFilterQueries: jest.fn()
}));

const mockedConfigDBGet = ConfigDB.get as jest.MockedFunction<
  typeof ConfigDB.get
>;
const mockedResolvePostgrest =
  resolvePostGrestRequestWithPagination as jest.MockedFunction<
    typeof resolvePostGrestRequestWithPagination
  >;
const mockedTristateOutputToQueryFilterParam =
  tristateOutputToQueryFilterParam as jest.MockedFunction<
    typeof tristateOutputToQueryFilterParam
  >;
const mockedBuildLabelFilterQueries =
  buildLabelFilterQueries as jest.MockedFunction<
    typeof buildLabelFilterQueries
  >;

const baseColumns: ViewColumnDef[] = [
  { name: "name", type: "string" },
  { name: "status", type: "status" },
  { name: "labels", type: "labels" }
];

describe("queryViewTable", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockedConfigDBGet.mockReturnValue(Promise.resolve({}) as any);
    mockedResolvePostgrest.mockResolvedValue({
      data: [],
      totalEntries: 0
    } as any);
    mockedTristateOutputToQueryFilterParam.mockReturnValue("");
    mockedBuildLabelFilterQueries.mockReturnValue([]);
  });

  it("returns object rows as-is without positional remapping", async () => {
    const rows = [
      { name: "alpha", status: "healthy" },
      { status: "warning", name: "beta" }
    ];

    mockedResolvePostgrest.mockResolvedValue({
      data: rows,
      totalEntries: 2
    } as any);

    const result = await queryViewTable(
      "default",
      "service-health",
      baseColumns,
      new URLSearchParams("pageIndex=0&pageSize=50"),
      "fingerprint-1"
    );

    expect(result).toEqual({
      data: rows,
      totalEntries: 2
    });
    expect(Array.isArray(result.data[0])).toBe(false);
  });

  it("builds query using pagination, sorting, filters, and request fingerprint", async () => {
    mockedTristateOutputToQueryFilterParam.mockReturnValue(
      "&status=eq.healthy"
    );
    mockedBuildLabelFilterQueries.mockReturnValue([
      "labels->>env.eq.prod",
      "labels->>team.eq.platform"
    ]);

    const params = new URLSearchParams({
      pageIndex: "1",
      pageSize: "25",
      sortBy: "created",
      sortOrder: "desc",
      status: "healthy",
      labels: "env____prod:1"
    });

    await queryViewTable(
      "my-namespace",
      "my-view",
      baseColumns,
      params,
      "fp/with spaces"
    );

    expect(mockedConfigDBGet).toHaveBeenCalledTimes(1);
    const [url, config] = mockedConfigDBGet.mock.calls[0];

    expect(url).toContain("/view_my_namespace_my_view?select=*");
    expect(url).toContain("&limit=25&offset=25");
    expect(url).toContain("&order=created.desc.nullslast");
    expect(url).toContain("&status=eq.healthy");
    expect(url).toContain(
      "&or=(and(labels->>env.eq.prod,labels->>team.eq.platform))"
    );
    expect(url).toContain("request_fingerprint=eq.fp%2Fwith%20spaces");

    expect(config).toEqual({
      headers: {
        Prefer: "count=exact"
      }
    });

    expect(mockedTristateOutputToQueryFilterParam).toHaveBeenCalledWith(
      "healthy",
      "status"
    );
    expect(mockedBuildLabelFilterQueries).toHaveBeenCalledWith(
      "labels",
      "env____prod:1"
    );
  });

  it("returns empty rows when PostgREST data is not an array", async () => {
    mockedResolvePostgrest.mockResolvedValue({
      data: { name: "not-an-array" },
      totalEntries: 9
    } as any);

    const result = await queryViewTable(
      "default",
      "service-health",
      baseColumns,
      new URLSearchParams(),
      "fingerprint-2"
    );

    expect(result).toEqual({
      data: [],
      totalEntries: 9
    });
  });

  it("throws response.error from resolver", async () => {
    const error = new Error("query failed");

    mockedResolvePostgrest.mockResolvedValue({
      error
    } as any);

    await expect(
      queryViewTable(
        "default",
        "service-health",
        baseColumns,
        new URLSearchParams(),
        "fingerprint-3"
      )
    ).rejects.toBe(error);
  });
});
