// ABOUTME: Defines the interactive tour's steps and the pure logic that advances it.
// ABOUTME: Steps carry gating metadata (navigation, URL params, target clicks) in step.data.
import { ACTIONS, EVENTS, STATUS, type Step } from "react-joyride";

export type TourStepData = {
  /** Advance once the user navigates to this pathname. */
  advanceOnNavigateTo?: string;
  /** Advance once this search param is present in the URL. */
  advanceOnParam?: string;
  /** Advance once the pathname matches this pattern (e.g. a resource detail). */
  advanceOnPathMatch?: RegExp;
  /** Advance once the step's target element is clicked. */
  advanceOnTargetClick?: boolean;
  /**
   * When advancing on a click, listen on this element instead of the
   * highlighted target (e.g. highlight a card but advance on its Run button).
   */
  clickTarget?: () => HTMLElement | null;
  /** A "Learn more" documentation link shown in the tooltip. */
  docLink?: string;
  /** Marks the first step of a section, so a section can be skipped to/over. */
  sectionStart?: boolean;
  /**
   * What to do when the target can't be found:
   * - "skip" (default): move on to the next step.
   * - "skipSection": jump to the next section (or end if this is the last).
   * - "finish": end the tour.
   */
  onMissing?: "skip" | "skipSection" | "finish";
};

/**
 * Selector helper so the steps and the components agree on the same markers.
 */
export const tourTarget = (id: string) => `[data-tour="${id}"]`;

/**
 * Picks the check row to highlight, preferring an unhealthy check, then a
 * healthy one, then any check row. Returns null when no leaf check row exists.
 */
export function findCheckRowTarget(): HTMLElement | null {
  return (
    document.querySelector<HTMLElement>(
      '[data-tour="check-row"][data-tour-status="unhealthy"]'
    ) ??
    document.querySelector<HTMLElement>(
      '[data-tour="check-row"][data-tour-status="healthy"]'
    ) ??
    document.querySelector<HTMLElement>('[data-tour="check-row"]')
  );
}

/**
 * Picks the catalog config-class group to highlight, preferring Kubernetes,
 * then any group. Returns null when no group row is rendered.
 */
export function findConfigClassTarget(): HTMLElement | null {
  return (
    document.querySelector<HTMLElement>(
      '[data-tour="config-class"][data-tour-class="Kubernetes"]'
    ) ?? document.querySelector<HTMLElement>('[data-tour="config-class"]')
  );
}

/**
 * Picks the catalog type row to highlight, preferring Kubernetes Pods, then
 * any type. Returns null when no type row is rendered.
 */
export function findConfigTypeTarget(): HTMLElement | null {
  return (
    document.querySelector<HTMLElement>(
      '[data-tour="config-type"][data-tour-type="Kubernetes::Pod"]'
    ) ?? document.querySelector<HTMLElement>('[data-tour="config-type"]')
  );
}

/**
 * Picks the first catalog item row to highlight, or null when none exist.
 */
export function findConfigItemTarget(): HTMLElement | null {
  return document.querySelector<HTMLElement>('[data-tour="catalog-item"]');
}

/**
 * Picks the playbook card to highlight, preferring a Kubernetes logs playbook,
 * then any playbook. Returns null when no playbook card is rendered.
 */
export function findPlaybookCardTarget(): HTMLElement | null {
  return (
    document.querySelector<HTMLElement>(
      '[data-tour="playbook-card"][data-tour-name*="kubernetes log"]'
    ) ?? document.querySelector<HTMLElement>('[data-tour="playbook-card"]')
  );
}

/**
 * Finds the Run button inside the preferred playbook card so the tour can
 * advance once the user opens its run form.
 */
export function findPlaybookRunButtonTarget(): HTMLElement | null {
  return (
    findPlaybookCardTarget()?.querySelector<HTMLElement>(
      '[data-tour="playbook-card-run"]'
    ) ?? null
  );
}

/**
 * Picks the first past playbook run row to highlight, or null when none exist.
 */
export function findPlaybookRunRowTarget(): HTMLElement | null {
  return document.querySelector<HTMLElement>('[data-tour="playbook-run-row"]');
}

/**
 * Picks the sidebar view to highlight, preferring one named "system", then any
 * view, then the dashboard. Returns null when none are present.
 */
export function findViewTarget(): HTMLElement | null {
  return (
    document.querySelector<HTMLElement>(
      '[data-tour="views"][data-tour-name="system"]'
    ) ??
    document.querySelector<HTMLElement>('[data-tour="views"]') ??
    document.querySelector<HTMLElement>('[data-tour="dashboard"]')
  );
}

const dashboardSteps: Step[] = [
  {
    target: tourTarget("dashboard"),
    title: "Dashboard",
    content: "Let's start here. Click Dashboard to open it.",
    placement: "right",
    skipBeacon: true,
    buttons: [],
    data: { advanceOnNavigateTo: "/", sectionStart: true } as TourStepData
  },
  {
    target: tourTarget("dashboard"),
    title: "Dashboard",
    content:
      "This is the central view of everything happening across your infrastructure — health, incidents, and changes, all at a glance.",
    placement: "right",
    skipBeacon: true,
    buttons: ["primary"]
  }
];

const healthSteps: Step[] = [
  {
    target: tourTarget("health"),
    title: "Health",
    content: "Now click Health to see your health checks.",
    placement: "right",
    skipBeacon: true,
    buttons: [],
    data: { advanceOnNavigateTo: "/health", sectionStart: true } as TourStepData
  },
  {
    target: tourTarget("checks-section"),
    title: "Health checks",
    content: "All of your health checks are listed here.",
    placement: "left",
    skipBeacon: true,
    buttons: ["primary"]
  },
  {
    target: findCheckRowTarget,
    title: "Open a check",
    content: "Click a check to open its details.",
    placement: "right",
    skipBeacon: true,
    buttons: [],
    targetWaitTimeout: 5000,
    // The checks table has a sticky header; offset the scroll so the
    // highlighted row lands below it instead of behind it.
    scrollOffset: 120,
    data: {
      advanceOnParam: "checkId",
      onMissing: "skipSection"
    } as TourStepData
  },
  {
    target: tourTarget("check-stats"),
    title: "Check stats",
    content:
      "These are the health check stats — uptime, latency, severity and more.",
    placement: "bottom",
    skipBeacon: true,
    buttons: ["primary"],
    targetWaitTimeout: 5000
  },
  {
    target: tourTarget("check-timeline"),
    title: "Check timeline",
    content:
      "And this is the check timeline — the age, duration and message of each run.",
    placement: "top",
    skipBeacon: true,
    buttons: ["primary"]
  },
  {
    target: tourTarget("check-tab-graph"),
    title: "Graph view",
    content: "Click the Graph tab to view the check history as a chart.",
    placement: "bottom",
    skipBeacon: true,
    buttons: [],
    data: { advanceOnTargetClick: true, onMissing: "skip" } as TourStepData
  },
  {
    target: tourTarget("check-graph"),
    title: "Graph view",
    content: "Here we can see the check history in graph view as well.",
    placement: "top",
    skipBeacon: true,
    buttons: ["primary"],
    data: { onMissing: "skip" } as TourStepData
  },
  {
    target: tourTarget("check-run-now"),
    title: "Run on demand",
    content:
      "Checks run on their configured schedule, but you can also trigger one on demand here.",
    placement: "top",
    skipBeacon: true,
    buttons: ["primary"],
    data: { onMissing: "skip" } as TourStepData
  },
  {
    target: tourTarget("dialog-button-close"),
    title: "That's health checks",
    content: "Close this check when you're ready to move on.",
    placement: "left",
    skipBeacon: true,
    buttons: [],
    data: { advanceOnTargetClick: true, onMissing: "skip" } as TourStepData
  }
];

const catalogSteps: Step[] = [
  {
    target: tourTarget("catalog"),
    title: "Catalog",
    content: "Now open the Catalog.",
    placement: "right",
    skipBeacon: true,
    buttons: [],
    data: {
      advanceOnNavigateTo: "/catalog",
      sectionStart: true
    } as TourStepData
  },
  {
    target: tourTarget("catalog-summary"),
    title: "Catalog",
    content: "All the tracked resources are shown here, grouped by type.",
    placement: "center",
    skipBeacon: true,
    buttons: ["primary"]
  },
  {
    target: findConfigClassTarget,
    title: "Pick a group",
    content: "Click a group to expand the resource types inside it.",
    placement: "right",
    skipBeacon: true,
    buttons: [],
    targetWaitTimeout: 5000,
    data: { advanceOnTargetClick: true, onMissing: "skip" } as TourStepData
  },
  {
    target: findConfigTypeTarget,
    title: "Pick a type",
    content: "Click a type to see the resources of that kind.",
    placement: "right",
    skipBeacon: true,
    buttons: [],
    targetWaitTimeout: 5000,
    data: {
      advanceOnParam: "configType",
      onMissing: "skipSection"
    } as TourStepData
  },
  {
    target: findConfigItemTarget,
    title: "Open a resource",
    content: "Open any resource to see its full details.",
    placement: "right",
    skipBeacon: true,
    buttons: [],
    targetWaitTimeout: 5000,
    data: {
      advanceOnPathMatch: /^\/catalog\/[0-9a-f]{8}-/i,
      onMissing: "skipSection"
    } as TourStepData
  },
  {
    target: tourTarget("config-spec"),
    title: "Spec",
    content:
      "This is the resource's full spec — the configuration we scraped for it.",
    placement: "left",
    skipBeacon: true,
    buttons: ["primary"],
    targetWaitTimeout: 8000,
    data: { onMissing: "skip" } as TourStepData
  },
  {
    target: tourTarget("tab-Relationships"),
    title: "Relationships",
    content: "We can see how catalog items are linked.",
    placement: "bottom",
    skipBeacon: true,
    buttons: [],
    data: { advanceOnTargetClick: true, onMissing: "skip" } as TourStepData
  },
  {
    target: tourTarget("tab-Playbooks"),
    title: "Playbooks",
    content: "These are operations you can perform on any catalog item.",
    placement: "bottom",
    skipBeacon: true,
    buttons: [],
    data: { advanceOnTargetClick: true, onMissing: "skip" } as TourStepData
  }
];

const playbookSteps: Step[] = [
  {
    target: tourTarget("playbooks"),
    title: "Playbooks",
    content: "Open Playbooks to see the actions you can run.",
    placement: "right",
    skipBeacon: true,
    buttons: [],
    data: {
      advanceOnNavigateTo: "/playbooks",
      sectionStart: true
    } as TourStepData
  },
  {
    target: findPlaybookCardTarget,
    title: "Run an action",
    content:
      "Each playbook runs an action on demand. Click Run on this one to launch it.",
    placement: "bottom",
    skipBeacon: true,
    buttons: [],
    targetWaitTimeout: 5000,
    data: {
      advanceOnTargetClick: true,
      clickTarget: findPlaybookRunButtonTarget,
      onMissing: "skipSection"
    } as TourStepData
  },
  {
    target: tourTarget("playbook-params"),
    title: "Parameters",
    content: "Set any parameters the action needs here.",
    placement: "right",
    skipBeacon: true,
    buttons: ["primary"],
    targetWaitTimeout: 5000,
    data: { onMissing: "skip" } as TourStepData
  },
  {
    target: tourTarget("playbook-run-submit"),
    title: "Execute",
    content: "And this is how you execute it.",
    placement: "top",
    skipBeacon: true,
    buttons: ["primary"],
    data: { onMissing: "skip" } as TourStepData
  },
  {
    target: tourTarget("dialog-button-close"),
    title: "Past runs",
    content: "Close this and let's look at previous runs.",
    placement: "left",
    skipBeacon: true,
    buttons: [],
    data: { advanceOnTargetClick: true, onMissing: "skip" } as TourStepData
  },
  {
    target: tourTarget("tab-Runs"),
    title: "Runs",
    content: "Open the Runs tab to see past executions.",
    placement: "bottom",
    skipBeacon: true,
    buttons: [],
    data: { advanceOnNavigateTo: "/playbooks/runs" } as TourStepData
  },
  {
    target: findPlaybookRunRowTarget,
    title: "Inspect a run",
    content: "Click any past run to inspect it.",
    placement: "bottom",
    skipBeacon: true,
    buttons: [],
    targetWaitTimeout: 5000,
    data: {
      advanceOnPathMatch: /^\/playbooks\/runs\/[0-9a-f]{8}-/i,
      onMissing: "skip"
    } as TourStepData
  },
  {
    target: tourTarget("playbook-run-details"),
    title: "Run details",
    content:
      "This is where all the run details live — its status, parameters, logs and the result of every action.",
    placement: "center",
    skipBeacon: true,
    buttons: ["primary"],
    targetWaitTimeout: 8000,
    data: { onMissing: "skip" } as TourStepData
  }
];

const viewSteps: Step[] = [
  {
    target: findViewTarget,
    title: "Views",
    content: "Open a view to see it.",
    placement: "right",
    skipBeacon: true,
    buttons: [],
    targetWaitTimeout: 5000,
    data: {
      advanceOnTargetClick: true,
      sectionStart: true,
      onMissing: "skipSection"
    } as TourStepData
  },
  {
    target: tourTarget("view-content"),
    title: "Views",
    content:
      "Views are customizable dashboards — compose graphs, tables, charts and more to visualize exactly the data you care about.",
    placement: "center",
    skipBeacon: true,
    buttons: ["primary"],
    targetWaitTimeout: 8000,
    data: {
      docLink: "https://flanksource.com/docs/guide/views",
      onMissing: "skip"
    } as TourStepData
  }
];

/**
 * The sections a user can choose from the tour menu. "full" runs them all.
 */
export type TourSection = "full" | "health" | "catalog" | "playbooks" | "views";

export type TourCapabilities = {
  /** When false, the playbooks walkthrough is omitted entirely. */
  canRunPlaybooks?: boolean;
};

/**
 * Builds the step list for a chosen section, or the complete tour. The
 * playbooks section is omitted unless the user can run playbooks.
 */
export function buildTourSteps(
  section: TourSection,
  { canRunPlaybooks = true }: TourCapabilities = {}
): Step[] {
  switch (section) {
    case "health":
      return healthSteps;
    case "catalog":
      return catalogSteps;
    case "playbooks":
      return canRunPlaybooks ? playbookSteps : [];
    case "views":
      return viewSteps;
    case "full":
    default:
      return [
        ...dashboardSteps,
        ...healthSteps,
        ...catalogSteps,
        ...(canRunPlaybooks ? playbookSteps : []),
        ...viewSteps
      ];
  }
}

/** The complete tour, used as the default and for menu option "full". */
export const tourSteps: Step[] = buildTourSteps("full");

/**
 * The state the tour observes to decide when a gated step should advance.
 */
export type TourContext = {
  pathname: string;
  params: URLSearchParams;
};

function advanceFrom(steps: Step[], stepIndex: number): number | "finish" {
  const next = stepIndex + 1;
  return next >= steps.length ? "finish" : next;
}

/**
 * Decides whether a navigation- or param-gated step should advance given the
 * current app state. Returns the next step index, "finish", or null for no-op.
 */
export function resolveAutoAdvance(
  steps: Step[],
  stepIndex: number,
  ctx: TourContext
): number | "finish" | null {
  const data = steps[stepIndex]?.data as TourStepData | undefined;
  if (!data) {
    return null;
  }
  const navigated =
    !!data.advanceOnNavigateTo && data.advanceOnNavigateTo === ctx.pathname;
  const paramPresent =
    !!data.advanceOnParam && ctx.params.get(data.advanceOnParam) != null;
  const pathMatched =
    !!data.advanceOnPathMatch && data.advanceOnPathMatch.test(ctx.pathname);
  if (!navigated && !paramPresent && !pathMatched) {
    return null;
  }
  return advanceFrom(steps, stepIndex);
}

/**
 * Decides where to go when the current step's target can't be found, based on
 * the step's `onMissing` setting.
 */
export function resolveTargetNotFound(
  steps: Step[],
  stepIndex: number
): { run: boolean; stepIndex: number } {
  const data = steps[stepIndex]?.data as TourStepData | undefined;
  if (data?.onMissing === "finish") {
    return { run: false, stepIndex: 0 };
  }
  if (data?.onMissing === "skipSection") {
    const nextSection = steps.findIndex(
      (step, index) =>
        index > stepIndex && (step.data as TourStepData)?.sectionStart
    );
    return nextSection === -1
      ? { run: false, stepIndex: 0 }
      : { run: true, stepIndex: nextSection };
  }
  const next = advanceFrom(steps, stepIndex);
  return next === "finish"
    ? { run: false, stepIndex: 0 }
    : { run: true, stepIndex: next };
}

type TourEvent = {
  action: string;
  type: string;
  status: string;
  index: number;
};

/**
 * Translates a react-joyride button event into the controlled tour state to
 * apply, or null when the event requires no change.
 */
export function reduceTourEvent(
  event: TourEvent
): { run: boolean; stepIndex: number } | null {
  const { action, type, status, index } = event;

  if (
    status === STATUS.FINISHED ||
    status === STATUS.SKIPPED ||
    action === ACTIONS.CLOSE ||
    action === ACTIONS.SKIP
  ) {
    return { run: false, stepIndex: 0 };
  }

  if (type === EVENTS.STEP_AFTER) {
    if (action === ACTIONS.NEXT) {
      return { run: true, stepIndex: index + 1 };
    }
    if (action === ACTIONS.PREV) {
      return { run: true, stepIndex: index - 1 };
    }
  }

  return null;
}
