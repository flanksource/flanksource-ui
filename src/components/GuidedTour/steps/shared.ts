// ABOUTME: Shared types and DOM target pickers used by every tour section file.
// ABOUTME: Steps carry gating + checklist metadata (key, dependsOn, touchpoint) in step.data.

export type TourStepData = {
  /** Stable identifier for this step, used to express dependencies between steps. */
  key?: string;
  /** Keys of the steps that must run before this one to reach it (its prerequisites). */
  dependsOn?: string[];
  /** The checklist touchpoint this step satisfies (recorded when the user does it). */
  touchpoint?: string;
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
   * Scroll the target into view when the step activates. Needed for targets in
   * nested scroll containers that react-joyride doesn't scroll (e.g. a catalog
   * type below the fold).
   */
  scrollIntoView?: boolean;
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
