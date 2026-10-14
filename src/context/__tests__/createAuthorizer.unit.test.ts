import { AccessSummary } from "@flanksource-ui/api/services/users";
import { createAuthorizer } from "..";
import { tables } from "../UserAccessContext/permissions";

const user = { id: "1", email: "guest@local", name: "Guest" };

const none = {
  read: "none",
  create: "none",
  update: "none",
  delete: "none"
} as const;

function authorizerFor(access?: AccessSummary) {
  return createAuthorizer({
    database: "",
    hostname: "",
    user,
    access
  });
}

describe("createAuthorizer", () => {
  it("shows a guest the page of a type it may read some of", async () => {
    const authorizer = authorizerFor({
      config: { ...none, read: "some" },
      component: none
    });

    expect(await authorizer.hasResourceAccess(tables.catalog, "read")).toBe(
      true
    );
    expect(await authorizer.hasResourceAccess(tables.catalog, "write")).toBe(
      false
    );
    expect(await authorizer.hasResourceAccess(tables.topologies, "read")).toBe(
      false
    );
  });

  it("hides a page the summary says is none, whatever the role grants", async () => {
    const authorizer = authorizerFor({ component: none });

    expect(await authorizer.hasResourceAccess(tables.topologies, "read")).toBe(
      false
    );
    expect(await authorizer.hasResourceAccess(tables.catalog, "read")).toBe(
      false
    );
  });

  it("offers write controls when a write is all", async () => {
    const authorizer = authorizerFor({
      config: { ...none, read: "all", update: "all" }
    });

    expect(await authorizer.hasResourceAccess(tables.catalog, "write")).toBe(
      true
    );
  });

  it("denies access without a summary", async () => {
    const authorizer = authorizerFor();

    expect(await authorizer.hasResourceAccess(tables.catalog, "read")).toBe(
      false
    );
  });
});
