import { Catalog } from "../../axios";
import { getConfigsChanges } from "../configs";

jest.mock("../../axios", () => ({
  Catalog: {
    post: jest.fn()
  }
}));

const mockedPost = Catalog.post as jest.MockedFunction<typeof Catalog.post>;

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
