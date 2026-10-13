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

function authorizerFor(roles: string[], access?: AccessSummary) {
  return createAuthorizer({
    roles,
    permissions: [],
    database: "",
    hostname: "",
    user,
    access
  });
}

describe("createAuthorizer", () => {
  it("shows a guest the page of a type it may read some of", async () => {
    const authorizer = authorizerFor(["guest"], {
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
    const authorizer = authorizerFor(["viewer"], { component: none });

    expect(await authorizer.hasResourceAccess(tables.topologies, "read")).toBe(
      false
    );
    expect(await authorizer.hasResourceAccess(tables.catalog, "read")).toBe(
      false
    );
  });

  it("offers write controls when a write is all", async () => {
    const authorizer = authorizerFor(["viewer"], {
      config: { ...none, read: "all", update: "all" }
    });

    expect(await authorizer.hasResourceAccess(tables.catalog, "write")).toBe(
      true
    );
  });

  it("does not infer access from admin roles without a summary", async () => {
    const authorizer = authorizerFor(["admin"]);

    expect(await authorizer.hasResourceAccess(tables.catalog, "read")).toBe(
      false
    );
  });
});
