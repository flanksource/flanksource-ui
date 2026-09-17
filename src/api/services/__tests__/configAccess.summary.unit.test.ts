import { ConfigDB } from "../../axios";
import { getConfigAccessSummary } from "../configAccess";

jest.mock("../../axios", () => ({
  ConfigDB: {
    get: jest.fn()
  }
}));

const mockedGet = ConfigDB.get as jest.MockedFunction<typeof ConfigDB.get>;
const userID = "10000000-0000-4000-8000-000000000001";
const secondUserID = "20000000-0000-4000-8000-000000000002";

function requestParams() {
  const requestURL = mockedGet.mock.calls[0][0] as string;
  return new URLSearchParams(requestURL.split("?")[1]);
}

describe("config access summary filters", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedGet.mockResolvedValue({ data: [], headers: {} });
  });

  it("uses exact equality instead of the text-search filter", async () => {
    await getConfigAccessSummary({
      arbitraryFilter: { external_user_id: `${userID}:1` }
    });

    const params = requestParams();
    expect(params.get("external_user_id")).toBe(`eq.${userID}`);
    expect(params.has("external_user_id.filter")).toBe(false);
  });

  it.each(["config_id", "external_group_id"] as const)(
    "uses exact equality for %s",
    async (key) => {
      await getConfigAccessSummary({
        arbitraryFilter: { [key]: `${userID}:1` }
      });

      const params = requestParams();
      expect(params.get(key)).toBe(`eq.${userID}`);
      expect(params.has(`${key}.filter`)).toBe(false);
    }
  );

  it("uses native UUID set operators for multiple values and exclusions", async () => {
    await getConfigAccessSummary({
      arbitraryFilter: {
        external_user_id: `${userID}:1,${secondUserID}:1`,
        external_group_id: `${userID}:-1,${secondUserID}:-1`
      }
    });

    const params = requestParams();
    expect(params.get("external_user_id")).toBe(
      `in.(${userID},${secondUserID})`
    );
    expect(params.get("external_group_id")).toBe(
      `not.in.(${userID},${secondUserID})`
    );
  });

  it("serializes a new filter field without additional registration", async () => {
    await getConfigAccessSummary({
      arbitraryFilter: { future_field: "value:1" }
    });

    expect(requestParams().get("future_field")).toBe("eq.value");
  });

  it("uses the same exact operators for text facets", async () => {
    await getConfigAccessSummary({
      arbitraryFilter: {
        role: "viewer:1",
        user_type: "service:1"
      }
    });

    const params = requestParams();
    expect(params.get("role")).toBe("eq.viewer");
    expect(params.get("user_type")).toBe("eq.service");
    expect(params.has("role.filter")).toBe(false);
  });

  it("quotes reserved characters in exact text values", async () => {
    await getConfigAccessSummary({
      arbitraryFilter: { role: "auditor||||admin:1" }
    });

    expect(requestParams().get("role")).toBe('eq."auditor,admin"');
  });

  it("rejects malformed tristate filters instead of broadening the query", () => {
    expect(() =>
      getConfigAccessSummary({
        arbitraryFilter: { external_user_id: "not-a-filter" }
      })
    ).toThrow("Invalid filter value for external_user_id");
    expect(mockedGet).not.toHaveBeenCalled();
  });
});
