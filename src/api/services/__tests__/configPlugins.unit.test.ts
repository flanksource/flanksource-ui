import {
  getPluginsForConfig,
  pluginTabKey,
  pluginTabPath,
  pluginUiSrc
} from "../configPlugins";
import { apiBase } from "../../axios";

jest.mock("../../axios", () => ({
  apiBase: {
    get: jest.fn()
  }
}));

const mockedGet = apiBase.get as jest.MockedFunction<typeof apiBase.get>;

describe("getPluginsForConfig", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("requests /plugins with an encoded config_id and returns the listings", async () => {
    const listings = [
      { name: "kubernetes-logs", tabs: [{ name: "Logs", path: "/" }] }
    ];
    mockedGet.mockResolvedValue({ data: listings } as any);

    const result = await getPluginsForConfig("abc 123");

    expect(mockedGet).toHaveBeenCalledWith("/plugins?config_id=abc%20123");
    expect(result).toEqual(listings);
  });

  it("returns an empty array when the response carries no data", async () => {
    mockedGet.mockResolvedValue({ data: undefined } as any);

    expect(await getPluginsForConfig("id")).toEqual([]);
  });
});

describe("pluginUiSrc", () => {
  it("keeps a leading-slash path without doubling the separator", () => {
    expect(pluginUiSrc("k8s-logs", "/index.html", "cfg-1")).toBe(
      "/api/plugins/k8s-logs/ui/index.html?config_id=cfg-1"
    );
  });

  it("inserts a separator when the path has no leading slash", () => {
    expect(pluginUiSrc("k8s-logs", "dash", "cfg-1")).toBe(
      "/api/plugins/k8s-logs/ui/dash?config_id=cfg-1"
    );
  });

  it("encodes the plugin name and config id", () => {
    expect(pluginUiSrc("a b", "/", "c/d")).toBe(
      "/api/plugins/a%20b/ui/?config_id=c%2Fd"
    );
  });
});

describe("pluginTabKey", () => {
  it("namespaces the tab under its plugin", () => {
    expect(pluginTabKey("k8s-logs", "Logs")).toBe("plugin:k8s-logs:Logs");
  });
});

describe("pluginTabPath", () => {
  it("builds an encoded route nested under the config item", () => {
    expect(pluginTabPath("cfg-1", "a b", "My Tab")).toBe(
      "/catalog/cfg-1/plugin/a%20b/My%20Tab"
    );
  });
});
