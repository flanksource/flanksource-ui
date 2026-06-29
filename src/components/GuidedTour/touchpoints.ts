// ABOUTME: Canonical getting-started checklist: categories and the touchpoints they track.
// ABOUTME: Each touchpoint id is the `key` recorded in person_touchpoints when the user does it.
import { type TourSection } from "./guidedTourSteps";

export type TouchpointItem = {
  /** Recorded key, e.g. "catalog.view-item". Matches a tour step's touchpoint. */
  id: string;
  /** Checklist label shown to the user. */
  label: string;
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
  }
];

/** Every touchpoint id known to the checklist, for validation/iteration. */
export const allTouchpointIds: string[] = touchpointCategories.flatMap(
  (category) => category.items.map((item) => item.id)
);
