// ABOUTME: Assembles the per-section tour steps and holds the pure logic that advances the tour.
// ABOUTME: Also builds a minimal single-touchpoint walk from a step's dependency chain.
import { ACTIONS, EVENTS, STATUS, type Step } from "react-joyride";
import { dashboardSteps } from "./steps/dashboard";
import { healthSteps } from "./steps/health";
import { catalogSteps } from "./steps/catalog";
import { playbookSteps } from "./steps/playbooks";
import { viewSteps } from "./steps/views";
import { aiSteps } from "./steps/ai";
import { faroSteps } from "./steps/faro";
import { type TourStepData } from "./steps/shared";

export * from "./steps/shared";

/**
 * The sections a user can choose from the tour menu. "full" runs them all.
 */
export type TourSection =
  | "full"
  | "health"
  | "catalog"
  | "playbooks"
  | "views"
  | "ai"
  | "faro";

export type TourCapabilities = {
  /** When false, the playbooks walkthrough is omitted entirely. */
  canRunPlaybooks?: boolean;
};

const sectionSteps: Record<Exclude<TourSection, "full">, Step[]> = {
  health: healthSteps,
  catalog: catalogSteps,
  playbooks: playbookSteps,
  views: viewSteps,
  ai: aiSteps,
  faro: faroSteps
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
    case "ai":
      return aiSteps;
    case "faro":
      return faroSteps;
    case "full":
    default:
      return [
        ...dashboardSteps,
        ...healthSteps,
        ...catalogSteps,
        ...(canRunPlaybooks ? playbookSteps : []),
        ...viewSteps,
        ...aiSteps,
        ...faroSteps
      ];
  }
}

/** Every section's steps, in tour order, for resolving a touchpoint's chain. */
const allSteps: Step[] = [
  ...dashboardSteps,
  ...healthSteps,
  ...catalogSteps,
  ...playbookSteps,
  ...viewSteps,
  ...aiSteps,
  ...faroSteps
];

function stepData(step: Step): TourStepData {
  return (step.data ?? {}) as TourStepData;
}

/**
 * Builds the smallest guided walk that reaches a single touchpoint: the
 * transitive `dependsOn` closure of the touchpoint's step, returned in the
 * step order of the section it belongs to. Only the prerequisite steps needed
 * to reach the target are included — sibling/optional steps are dropped.
 */
export function buildTouchpointSteps(touchpoint: string): Step[] {
  const target = (Object.keys(sectionSteps) as Exclude<TourSection, "full">[])
    .map((name) => sectionSteps[name])
    .find((steps) => steps.some((s) => stepData(s).touchpoint === touchpoint));
  if (!target) {
    return [];
  }
  const byKey = new Map<string, Step>();
  for (const step of target) {
    const key = stepData(step).key;
    if (key) {
      byKey.set(key, step);
    }
  }
  const wanted = new Set<string>();
  const visit = (key?: string) => {
    if (!key || wanted.has(key)) {
      return;
    }
    wanted.add(key);
    stepData(byKey.get(key) ?? ({} as Step)).dependsOn?.forEach(visit);
  };
  const targetStep = target.find((s) => stepData(s).touchpoint === touchpoint)!;
  visit(stepData(targetStep).key);
  return target.filter((s) => {
    const key = stepData(s).key;
    return key != null && wanted.has(key);
  });
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
