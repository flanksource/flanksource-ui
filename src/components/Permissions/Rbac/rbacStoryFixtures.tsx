import { RoleBindingDisplay } from "@flanksource-ui/api/types/roleBindings";
import { RoleDisplay } from "@flanksource-ui/api/types/roles";
import { ScopeDisplay } from "@flanksource-ui/api/types/scopes";
import { AuthContext, FakeUser, Roles } from "@flanksource-ui/context";
import { UserAccessStateContextProvider } from "@flanksource-ui/context/UserAccessContext/UserAccessContext";
import { Decorator } from "@storybook/react";
import { HttpResponse, http } from "msw";

// Sample Scopes, Roles and RoleBindings for the stories, and an API that serves them.

const admin = {
  id: "b149b5ee-db1c-4c0c-9711-98d06f1f1ce7",
  name: "John Doe",
  email: "admin@local"
};

const timestamps = {
  created_at: "2026-09-28T10:12:00Z",
  updated_at: "2026-10-01T15:40:00Z"
};

export const scopes: ScopeDisplay[] = [
  {
    id: "s1",
    name: "all-playbooks",
    namespace: "default",
    description: "Every playbook",
    targets: [{ playbook: { name: "*" } }],
    source: "UI",
    ...timestamps
  },
  {
    id: "s2",
    name: "all-configs",
    namespace: "default",
    description: "Every config",
    targets: [{ config: { name: "*" } }],
    source: "UI",
    ...timestamps
  },
  {
    id: "s3",
    name: "staging-configs",
    namespace: "default",
    description: "Configs tagged env=staging",
    targets: [{ config: { tagSelector: "env=staging" } }],
    source: "UI",
    ...timestamps
  },
  {
    id: "s4",
    name: "tenant-a",
    namespace: "default",
    description: "Tenant A's configs, and the playbooks they may run",
    // One scope per tenant serves both sides of a binding's constraint
    targets: [
      { config: { tagSelector: "tenant=a" } },
      { playbook: { name: "*" } }
    ],
    source: "UI",
    ...timestamps
  },
  {
    id: "s5",
    name: "monitoring-playbooks",
    namespace: "monitoring",
    targets: [{ playbook: { name: "*" } }],
    source: "KubernetesCRD",
    ...timestamps
  }
];

export const roles: RoleDisplay[] = [
  {
    id: "r1",
    name: "staging-operator",
    namespace: "default",
    description: "Read staging configs and run playbooks on them",
    source: "UI",
    rules: [
      {
        name: "read-staging",
        action: "read",
        resource: { scopeRef: "staging-configs" }
      },
      {
        name: "run-playbooks",
        action: "playbook:run",
        resource: { scopeRef: "all-playbooks" },
        target: { scopeRef: "staging-configs" }
      },
      {
        name: "no-delete",
        action: "delete",
        resource: { scopeRef: "all-configs" },
        deny: true
      }
    ],
    created_by: admin,
    ...timestamps
  },
  {
    id: "r2",
    name: "log-reader",
    namespace: "default",
    description: "Tail pod logs",
    source: "UI",
    error: "scope pod-configs not found in default",
    error_reason: "ScopeNotFound",
    rules: [
      {
        name: "tail-logs",
        action: "invoke:kubernetes-logs:tail",
        resource: { scopeRef: "pod-configs" }
      }
    ],
    created_by: admin,
    ...timestamps
  },
  {
    id: "r3",
    name: "monitoring-runner",
    namespace: "monitoring",
    source: "KubernetesCRD",
    rules: [
      {
        name: "run-monitoring",
        action: "playbook:run",
        resource: { scopeRef: "monitoring-playbooks" }
      }
    ],
    ...timestamps
  }
];

export const roleBindings: RoleBindingDisplay[] = [
  {
    id: "b1",
    name: "platform-operators",
    namespace: "default",
    description: "Platform team operates staging",
    source: "UI",
    role: "staging-operator",
    subjects: {
      people: ["alice@example.com"],
      teams: ["platform"]
    },
    created_by: admin,
    ...timestamps
  },
  {
    id: "b2",
    name: "tenant-a-operators",
    namespace: "default",
    source: "UI",
    role: "staging-operator",
    subjects: {
      oidc: [{ provider: "oipa", match: "claims.tenant == 'a'" }],
      playbooks: [{ namespace: "default", name: "cleanup-pods" }]
    },
    constraint: {
      resource: { scopeRef: "tenant-a" },
      target: { scopeRef: "tenant-a" }
    },
    created_by: admin,
    ...timestamps
  },
  {
    id: "b3",
    name: "monitoring-guests",
    namespace: "monitoring",
    source: "KubernetesCRD",
    role: "monitoring-runner",
    subjects: { roles: ["guest"] },
    error: "role monitoring-runner is not in effect",
    error_reason: "RoleNotReady",
    ...timestamps
  }
];

const people = [
  { id: "p1", name: "Alice", email: "alice@example.com", roles: ["editor"] },
  { id: "p2", name: "Bob", email: "bob@example.com", roles: ["viewer"] }
];

const teams = [
  { id: "t1", name: "platform" },
  { id: "t2", name: "sre" }
];

// Echoes a write back as the stored object, as the API does
async function stored(request: Request) {
  const body = (await request.json()) as {
    metadata: { name: string; namespace: string };
    spec: Record<string, unknown>;
  };
  return HttpResponse.json({
    id: crypto.randomUUID(),
    name: body.metadata.name,
    namespace: body.metadata.namespace,
    source: "UI",
    ...body.spec,
    ...timestamps
  });
}

export const rbacHandlers = [
  http.get("*/api/db/scopes", () => HttpResponse.json(scopes)),
  http.get("*/api/db/roles", () => HttpResponse.json(roles)),
  http.get("*/api/db/role_bindings", ({ request }) => {
    const role = new URL(request.url).searchParams.get("role");
    return HttpResponse.json(
      role
        ? roleBindings.filter((binding) => `eq.${binding.role}` === role)
        : roleBindings
    );
  }),
  http.get("*/api/db/people_roles", () => HttpResponse.json(people)),
  http.get("*/api/db/teams", () => HttpResponse.json(teams)),
  http.get("*/api/db/*", () => HttpResponse.json([])),
  http.post("*/api/rbac/:resource", ({ request }) => stored(request)),
  http.put("*/api/rbac/:resource/:namespace/:name", ({ request }) =>
    stored(request)
  ),
  http.delete("*/api/rbac/:resource/:namespace/:name", () =>
    HttpResponse.json({ message: "deleted" })
  )
];

// Signs in as an admin, so the forms show their save and delete buttons
export const withAdmin: Decorator = (Story) => (
  <AuthContext.Provider value={FakeUser([Roles.admin])}>
    <UserAccessStateContextProvider>
      <div className="h-screen">
        <Story />
      </div>
    </UserAccessStateContextProvider>
  </AuthContext.Provider>
);
