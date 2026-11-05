import { AuthContext, FakeUser } from "@flanksource-ui/context";
import { UserAccessStateContextProvider } from "@flanksource-ui/context/UserAccessContext/UserAccessContext";
import McpAccessPage from "@flanksource-ui/pages/Settings/mcp/McpAccessPage";
import McpPlaybooksPage from "@flanksource-ui/pages/Settings/mcp/McpPlaybooksPage";
import McpSubjectAccessPage from "@flanksource-ui/pages/Settings/mcp/McpSubjectAccessPage";
import McpViewsPage from "@flanksource-ui/pages/Settings/mcp/McpViewsPage";
import { Decorator, Meta, StoryObj } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http, HttpResponse } from "msw";
import { mswLoader } from "msw-storybook-addon";

const alice = "11111111-1111-4111-8111-111111111111";
const bob = "22222222-2222-4222-8222-222222222222";
const carol = "33333333-3333-4333-8333-333333333333";
const dan = "44444444-4444-4444-8444-444444444444";
const erin = "55555555-5555-4555-8555-555555555555";
const sre = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const finance = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";

const people = [
  { id: alice, name: "Alice Admin", email: "alice@acme.io" },
  { id: bob, name: "Bob Builder", email: "bob@acme.io" },
  { id: carol, name: "Carol Contractor", email: "carol@acme.io" },
  { id: dan, name: "Dan Developer", email: "dan@acme.io" },
  { id: erin, name: "Erin Analyst", email: "erin@acme.io" }
];
const teams = [
  { id: sre, name: "SRE" },
  { id: finance, name: "Finance" }
];
const playbooks = [
  {
    id: "c0000000-0000-4000-8000-000000000001",
    name: "restart-pod",
    title: "Restart Pod",
    namespace: "default",
    category: "Kubernetes",
    icon: "kubernetes"
  },
  {
    id: "c0000000-0000-4000-8000-000000000002",
    name: "scale-deployment",
    title: "Scale Deployment",
    namespace: "default",
    category: "Kubernetes",
    icon: "kubernetes"
  },
  {
    id: "c0000000-0000-4000-8000-000000000003",
    name: "rotate-keys",
    title: "Rotate AWS Keys",
    namespace: "security",
    category: "AWS",
    icon: "aws"
  }
];
const views = [
  {
    id: "d0000000-0000-4000-8000-000000000001",
    name: "pods",
    namespace: "default",
    spec: { title: "Pods", icon: "kubernetes" }
  },
  {
    id: "d0000000-0000-4000-8000-000000000002",
    name: "costs",
    namespace: "finops",
    spec: { title: "Cloud Costs", icon: "aws" }
  }
];

const binding = (
  name: string,
  effect: "allow" | "deny" = "allow",
  extra: Record<string, unknown> = {}
) => ({
  effect,
  matches: true,
  role_binding: { id: `rb-${name}`, namespace: "mission-control", name },
  role: { id: `r-${name}`, namespace: "mission-control", name: `${name}-role` },
  rule: "mcp",
  direct: true,
  ...extra
});

const throughSRE = {
  direct: false,
  through: [{ type: "team", id: sre, name: "SRE" }]
};

type Grant = { allowed: boolean; rules: ReturnType<typeof binding>[] };

// Who the policy grants each action to. A subject missing from an action holds no grant for it.
const policy: Record<string, Record<string, Grant>> = {
  "mcp:use": {
    [alice]: { allowed: true, rules: [binding("platform-admins")] },
    [bob]: { allowed: true, rules: [binding("sre-mcp", "allow", throughSRE)] },
    [sre]: { allowed: true, rules: [binding("sre-mcp")] },
    [carol]: {
      allowed: false,
      rules: [binding("no-contractors", "deny"), binding("platform-admins")]
    },
    [erin]: { allowed: true, rules: [binding("finance-mcp")] }
  },
  "mcp:run": {
    [alice]: { allowed: true, rules: [binding("platform-admins")] },
    [bob]: {
      allowed: true,
      rules: [binding("sre-playbooks", "allow", throughSRE)]
    },
    [sre]: { allowed: true, rules: [binding("sre-playbooks")] },
    [carol]: { allowed: true, rules: [binding("platform-admins")] },
    [dan]: { allowed: true, rules: [binding("developers")] }
  },
  read: {
    [alice]: { allowed: true, rules: [binding("platform-admins")] },
    [carol]: { allowed: true, rules: [binding("viewers")] },
    [erin]: { allowed: true, rules: [binding("finance-viewers")] },
    [finance]: { allowed: true, rules: [binding("finance-viewers")] }
  }
};

// What each subject may use, for subject access search
const searchable: Record<string, string[]> = {
  [alice]: [...playbooks, ...views].map((r) => r.id),
  [bob]: [playbooks[0].id, playbooks[1].id],
  [sre]: [playbooks[0].id, playbooks[1].id],
  [carol]: [views[0].id],
  [dan]: [playbooks[0].id],
  [erin]: [views[1].id],
  [finance]: [views[1].id]
};

const mcpUseRequirement = (subject: string) => ({
  action: "mcp:use",
  on: "mcp",
  allowed: policy["mcp:use"][subject]?.allowed === true
});

const handlers = [
  http.get("*/api/db/people", () => HttpResponse.json(people)),
  http.get("*/api/db/teams", () => HttpResponse.json(teams)),
  http.get("*/api/db/playbook_names", () => HttpResponse.json(playbooks)),
  http.get("*/api/db/views", () => HttpResponse.json(views)),
  http.post("*/api/rbac/subject-access-reviews", async ({ request }) => {
    const body = (await request.json()) as {
      action: string;
      resource: object;
      subjects: string[];
      explain?: boolean;
    };
    const grants = policy[body.action] ?? {};
    const subjects =
      body.subjects[0] === "*" ? Object.keys(grants) : body.subjects;
    return HttpResponse.json({
      resource: body.resource,
      action: body.action,
      results: subjects.map((subject) => ({
        subject,
        allowed: grants[subject]?.allowed === true,
        ...(body.explain ? { rules: grants[subject]?.rules ?? [] } : {}),
        ...(body.action === "mcp:run"
          ? { requirements: [mcpUseRequirement(subject)] }
          : {})
      }))
    });
  }),
  http.post("*/api/rbac/subject-access-search", async ({ request }) => {
    const body = (await request.json()) as {
      subject: string;
      action: string;
      resource_types: Array<"playbook" | "view">;
    };
    const requirements =
      body.action === "mcp:run" ? [mcpUseRequirement(body.subject)] : undefined;
    const blocked = requirements?.some((r) => !r.allowed);
    const results = blocked
      ? []
      : body.resource_types.flatMap((type) =>
          (type === "playbook" ? playbooks : views)
            .filter((r) => searchable[body.subject]?.includes(r.id))
            .map((r) => ({ resource_type: type, id: r.id }))
        );
    return HttpResponse.json({
      ...body,
      requirements,
      total: results.length,
      results
    });
  }),
  http.get("*/api/db/*", () => HttpResponse.json([]))
];

const forbidden = (message: string) =>
  HttpResponse.json({ error: message, message }, { status: 403 });

// A reviewer with access:review, and a cache of its own for each story
const withReviewer: Decorator = (Story) => {
  const user = FakeUser();
  return (
    <QueryClientProvider
      client={
        new QueryClient({ defaultOptions: { queries: { retry: false } } })
      }
    >
      <AuthContext.Provider
        value={{
          ...user,
          access_actions: { ...user.access_actions, "access:review": true }
        }}
      >
        <UserAccessStateContextProvider>
          <div className="h-screen">
            <Story />
          </div>
        </UserAccessStateContextProvider>
      </AuthContext.Provider>
    </QueryClientProvider>
  );
};

export default {
  title: "Settings/MCP",
  tags: ["!autodocs"],
  decorators: [withReviewer],
  loaders: [mswLoader],
  parameters: { layout: "fullscreen", msw: { handlers } }
} satisfies Meta;

export const McpAccess: StoryObj = { render: () => <McpAccessPage /> };

export const McpAccessPeopleForbidden: StoryObj = {
  render: () => <McpAccessPage />,
  parameters: {
    msw: {
      handlers: [
        http.get("*/api/db/people", () => forbidden("forbidden")),
        ...handlers
      ]
    }
  }
};

export const McpAccessReviewFails: StoryObj = {
  render: () => <McpAccessPage />,
  parameters: {
    msw: {
      handlers: [
        http.post("*/api/rbac/subject-access-reviews", () =>
          forbidden("access:review on rbac is required")
        ),
        ...handlers
      ]
    }
  }
};

export const Subjects: StoryObj = { render: () => <McpSubjectAccessPage /> };

export const Playbooks: StoryObj = { render: () => <McpPlaybooksPage /> };

export const Views: StoryObj = { render: () => <McpViewsPage /> };

export const ViewsFail: StoryObj = {
  render: () => <McpViewsPage />,
  parameters: {
    msw: {
      handlers: [
        http.get("*/api/db/views", () =>
          HttpResponse.json(
            { message: "permission denied for table views" },
            { status: 500 }
          )
        ),
        ...handlers
      ]
    }
  }
};
