import { Topology } from "@flanksource-ui/api/types/topology";
import { render, screen } from "@flanksource-ui/test-utils";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { TopologyCard } from "../TopologyCard";

const data: Topology = {
  id: "01903a93-1d3f-ce22-2203-d558bccbd2d2",
  topology_id: "0d0f9eca-e1f9-45fa-b803-29d3237d70cc",
  agent_id: "00000000-0000-0000-0000-000000000000",
  external_id: "flux (aws)",
  name: "flux (aws)",
  namespace: "mission-control",
  labels: {
    "app.kubernetes.io/managed-by": "Helm",
    "helm.toolkit.fluxcd.io/name": "mission-control-flux",
    "helm.toolkit.fluxcd.io/namespace": "mission-control"
  },
  hidden: true,
  status: "warning",
  health: "warning",
  description: "",
  status_reason: "",
  schedule: "@every 5m",
  icon: "flux",
  type: "Topology",
  summary: {
    healthy: 4,
    warning: 20,
    info: 8,
    insights: {
      // @ts-expect-error
      reliability: {
        low: 2
      }
    },
    // @ts-expect-error
    checks: {
      healthy: 34,
      unhealthy: 4
    }
  },
  is_leaf: false,
  created_at: "2024-06-21T11:33:58.207353Z",
  updated_at: "2024-08-23T17:00:21.522058Z",
  parents: ["01903a93-1d84-9dd8-7b27-dab78df75197"]
};

const server = setupServer(
  rest.get("/api/canary/api/topology", (req, res, ctx) => {
    return res(
      ctx.status(204),
      ctx.json({
        components: [data]
      })
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("it should render card with data from props", () => {
  render(<TopologyCard topology={data} />);

  expect(
    screen.getAllByRole("link", {
      name: /flux \(aws\)/i
    })[0]
  ).toHaveAttribute("href", "/topology/01903a93-1d3f-ce22-2203-d558bccbd2d2");
});

test("it should render card with data from api", async () => {
  render(<TopologyCard topologyId="01903a93-1d3f-ce22-2203-d558bccbd2d2" />);

  await screen.findAllByRole("link", {
    name: /flux \(aws\)/i
  });

  expect(
    screen.getAllByRole("link", {
      name: /flux \(aws\)/i
    })[0]
  ).toHaveAttribute("href", "/topology/01903a93-1d3f-ce22-2203-d558bccbd2d2");
});
