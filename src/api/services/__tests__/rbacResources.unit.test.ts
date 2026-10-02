import {
  createRbacObject,
  deleteRbacObject,
  updateRbacObject
} from "../rbacResources";
import { Rback } from "../../axios";
import {
  getRbacReadOnlyReason,
  toRbacManifest
} from "../../types/rbacResources";

jest.mock("../../axios", () => ({
  Rback: {
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn()
  }
}));

const mockedRback = Rback as jest.Mocked<typeof Rback>;

describe("toRbacManifest", () => {
  it("puts an object without a namespace in the default namespace", () => {
    expect(
      toRbacManifest("role-bindings", { name: "ops" }, { role: "operator" })
    ).toEqual({
      apiVersion: "mission-control.flanksource.com/v1",
      kind: "RoleBinding",
      metadata: { name: "ops", namespace: "default" },
      spec: { role: "operator" }
    });
  });

  it("keeps an existing namespace", () => {
    expect(
      toRbacManifest("scopes", { name: "s", namespace: "monitoring" }, {})
        .metadata
    ).toEqual({ name: "s", namespace: "monitoring" });
  });
});

describe("getRbacReadOnlyReason", () => {
  it("allows new objects and objects created in the UI", () => {
    expect(getRbacReadOnlyReason("roles")).toBeUndefined();
    expect(
      getRbacReadOnlyReason("roles", { source: "UI", namespace: "default" })
    ).toBeUndefined();
  });

  it("refuses objects managed elsewhere", () => {
    expect(
      getRbacReadOnlyReason("roles", {
        source: "KubernetesCRD",
        namespace: "default"
      })
    ).toMatch(/Kubernetes CRD/);
    expect(
      getRbacReadOnlyReason("roles", { source: "CRDSync", namespace: "x" })
    ).toMatch(/CRDSync/);
  });

  it("refuses objects without a namespace, which the API can't address", () => {
    expect(
      getRbacReadOnlyReason("scopes", { source: "UI", namespace: null })
    ).toMatch(/no namespace/);
  });
});

describe("rbac object requests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const manifest = toRbacManifest(
    "scopes",
    { name: "staging configs", namespace: "default" },
    { targets: [] }
  );

  it("creates by posting the manifest to the collection", async () => {
    mockedRback.post.mockResolvedValue({ data: { id: "1" } });

    await expect(createRbacObject("scopes", manifest)).resolves.toEqual({
      id: "1"
    });
    expect(mockedRback.post).toHaveBeenCalledWith("/scopes", manifest);
  });

  it("updates and deletes by namespace and name", async () => {
    mockedRback.put.mockResolvedValue({ data: {} });
    mockedRback.delete.mockResolvedValue({ data: {} });

    await updateRbacObject("scopes", manifest);
    await deleteRbacObject("role-bindings", "default", "ops");

    expect(mockedRback.put).toHaveBeenCalledWith(
      "/scopes/default/staging%20configs",
      manifest
    );
    expect(mockedRback.delete).toHaveBeenCalledWith(
      "/role-bindings/default/ops"
    );
  });
});
