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
      { id: "health.view", label: "Open the health dashboard" },
      { id: "health.open-check", label: "Open a check's details" },
      { id: "health.view-graph", label: "View a check's history graph" },
      { id: "health.run-now", label: "Run a check on demand" }
    ]
  },
  {
    id: "catalog",
    title: "Explore the catalog",
    items: [
      { id: "catalog.view", label: "Browse the resource catalog" },
      { id: "catalog.open-type", label: "Open a resource type" },
      { id: "catalog.view-item", label: "Open a resource" },
      { id: "catalog.view-spec", label: "View a resource's spec" },
      {
        id: "catalog.view-relationships",
        label: "See how resources are linked"
      },
      { id: "catalog.view-playbooks", label: "See a resource's playbooks" }
    ]
  },
  {
    id: "playbooks",
    title: "Run playbooks",
    items: [
      { id: "playbooks.view", label: "Browse playbooks" },
      { id: "playbooks.run", label: "Run a playbook" },
      { id: "playbooks.view-run", label: "Inspect a past run" }
    ]
  },
  {
    id: "views",
    title: "Build custom views",
    items: [{ id: "views.open", label: "Open a custom view" }]
  }
];

/** Every touchpoint id known to the checklist, for validation/iteration. */
export const allTouchpointIds: string[] = touchpointCategories.flatMap(
  (category) => category.items.map((item) => item.id)
);
