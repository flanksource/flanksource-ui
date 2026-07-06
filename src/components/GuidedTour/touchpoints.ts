import { type TourSection } from "./guidedTourSteps";

export type TouchpointItem = {
  /** Recorded key, e.g. "catalog.view-item". Matches a tour step's touchpoint. */
  id: string;
  /** Checklist label shown to the user. */
  label: string;
  /**
   * Touchpoint whose guided walk "Show me" runs instead of this item's own.
   * Used for items completed outside the UI (e.g. CLI actions), which we still
   * point at the relevant setup step.
   */
  guideVia?: string;
};

export type TouchpointCategory = {
  /** Category identifier, also the tour section started from its header. */
  id: Exclude<TourSection, "full">;
  /** Heading shown above the category's checklist items. */
  title: string;
  items: TouchpointItem[];
};

export const touchpointCategories: TouchpointCategory[] = [
  {
    id: "health",
    title: "Monitor resources",
    items: [
      { id: "health.view", label: "See what's healthy and what's broken" },
      { id: "health.open-check", label: "Investigate a failing check" },
      { id: "health.view-graph", label: "Spot when a check started failing" },
      { id: "health.run-now", label: "Re-run a check to confirm a fix" }
    ]
  },
  {
    id: "catalog",
    title: "Explore the catalog",
    items: [
      {
        id: "catalog.view",
        label: "Find a resource across your infrastructure"
      },
      { id: "catalog.open-type", label: "Browse all resources of one kind" },
      { id: "catalog.view-item", label: "Inspect a single resource" },
      { id: "catalog.view-spec", label: "Review a resource's configuration" },
      {
        id: "catalog.view-relationships",
        label: "Trace a resource's dependencies"
      },
      {
        id: "catalog.view-playbooks",
        label: "Find actions you can run on a resource"
      }
    ]
  },
  {
    id: "playbooks",
    title: "Run playbooks",
    items: [
      { id: "playbooks.view", label: "Discover ready-made automations" },
      { id: "playbooks.run", label: "Fix an issue with a playbook" },
      { id: "playbooks.view-run", label: "Review what a past playbook run did" }
    ]
  },
  {
    id: "views",
    title: "Build custom views",
    items: [{ id: "views.open", label: "See your data in a custom dashboard" }]
  },
  {
    id: "ai",
    title: "Set up AI",
    items: [
      { id: "ai.setup-mcp", label: "Connect your AI client with MCP" },
      {
        id: "ai.use-mcp",
        label: "Troubleshoot an issue with AI",
        guideVia: "ai.setup-mcp"
      }
    ]
  },
  {
    id: "faro",
    title: "Use the command line",
    items: [
      { id: "faro.setup-cli", label: "Set up the faro CLI" },
      {
        id: "faro.try-plugin",
        label: "Run plugins from your CLI",
        guideVia: "faro.setup-cli"
      },
      {
        id: "faro.run-playbook",
        label: "Run a playbook from your terminal",
        guideVia: "faro.setup-cli"
      }
    ]
  }
];

/** Every touchpoint id known to the checklist, for validation/iteration. */
export const allTouchpointIds: string[] = touchpointCategories.flatMap(
  (category) => category.items.map((item) => item.id)
);
