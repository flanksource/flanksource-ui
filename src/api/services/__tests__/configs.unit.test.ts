import { Catalog, ConfigDB } from "../../axios";
import { getAllConfigInsights, getConfigsChanges } from "../configs";

jest.mock("../../axios", () => ({
  Catalog: {
    post: jest.fn()
  },
  ConfigDB: {
    get: jest.fn()
  }
}));

const mockedPost = Catalog.post as jest.MockedFunction<typeof Catalog.post>;
const mockedGet = ConfigDB.get as jest.MockedFunction<typeof ConfigDB.get>;

describe("getConfigsChanges", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedPost.mockResolvedValue({
      data: { summary: {}, changes: [], total: 0 }
    } as any);
  });

  it("includes soft relationships in config-specific change requests", async () => {
    await getConfigsChanges({
      id: "config-1",
      type_filter: "downstream",
      soft: true,
      include_deleted_configs: false
    });

    expect(mockedPost).toHaveBeenCalledWith(
      "/changes",
      expect.objectContaining({
        id: "config-1",
        recursive: "downstream",
        depth: 5,
        soft: true
      })
    );
  });

  it("omits the soft option from global change requests", async () => {
    await getConfigsChanges({ include_deleted_configs: false });

    expect(mockedPost).toHaveBeenCalledWith(
      "/changes",
      expect.not.objectContaining({ soft: expect.anything() })
    );
  });
});

describe("getAllConfigInsights", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedGet.mockResolvedValue({ data: [], headers: {} } as any);
  });

  it("uses an exact PostgREST filter for tristate values containing slashes", async () => {
    await getAllConfigInsights(
      { source: "recon/prowler:1" },
      {},
      { pageIndex: 0, pageSize: 50 }
    );

    const url = mockedGet.mock.calls[0][0];
    expect(url).toContain("&source=eq.recon%2Fprowler");
    expect(url).not.toContain("source.filter=");
  });

  it("supports multiple included and excluded tristate values", async () => {
    await getAllConfigInsights(
      {
        source:
          "recon/prowler:1,recon/trivy:1,recon/checkov:-1,recon/kubescape:-1"
      },
      {},
      { pageIndex: 0, pageSize: 50 }
    );

    const url = mockedGet.mock.calls[0][0];
    expect(decodeURIComponent(url)).toContain(
      '&source=in.("recon/prowler","recon/trivy")'
    );
    expect(decodeURIComponent(url)).toContain(
      '&source=not.in.("recon/checkov","recon/kubescape")'
    );
  });

  it("uses neq for a single excluded value", async () => {
    await getAllConfigInsights(
      { analyzer: "recon/prowler:-1" },
      {},
      { pageIndex: 0, pageSize: 50 }
    );

    expect(mockedGet.mock.calls[0][0]).toContain(
      "&analyzer=neq.recon%2Fprowler"
    );
  });

  it("URL-encodes slashes in plain filter values", async () => {
    await getAllConfigInsights(
      { source: "recon/prowler" },
      {},
      { pageIndex: 0, pageSize: 50 }
    );

    expect(mockedGet.mock.calls[0][0]).toContain("&source=eq.recon%2Fprowler");
  });

  it("preserves all existing insight filter fields", async () => {
    await getAllConfigInsights(
      {
        status: "open:1",
        severity: "critical:1",
        type: "security:1,performance:1",
        analyzer: "recon/prowler:1",
        source: "prowler:1",
        configType: "Kubernetes________Pod:1",
        catalogId: "config-id:1"
      },
      { sortBy: "catalog", sortOrder: "asc" },
      { pageIndex: 2, pageSize: 25 }
    );

    const url = decodeURIComponent(mockedGet.mock.calls[0][0]);
    expect(url).toContain("&status=eq.open");
    expect(url).toContain("&severity=eq.critical");
    expect(url).toContain('&analysis_type=in.("security","performance")');
    expect(url).toContain("&analyzer=eq.recon/prowler");
    expect(url).toContain("&source=eq.prowler");
    expect(url).toContain("&config_type=eq.Kubernetes::Pod");
    expect(url).toContain("&config_id=eq.config-id");
    expect(url).toContain("&limit=25&offset=50");
    expect(url).toContain("&order=config_name.asc");
  });

  it("keeps configId precedence over the catalogId URL filter", async () => {
    await getAllConfigInsights(
      { configId: "details-config", catalogId: "catalog-config:1" },
      {},
      { pageIndex: 0, pageSize: 50 }
    );

    const url = mockedGet.mock.calls[0][0];
    expect(url).toContain("&config_id=eq.details-config");
    expect(url).not.toContain("catalog-config");
  });
});
