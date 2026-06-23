// ABOUTME: Jotai atoms holding the interactive product tour's run flag, steps and current step.
// ABOUTME: Shared between the menu trigger, the section picker and the GuidedTour renderer.
import { useUser } from "@flanksource-ui/context";
import { hasPlaybookRunPermission } from "@flanksource-ui/utils/playbookPermissions";
import { atom, useSetAtom } from "jotai";
import { type Step } from "react-joyride";
import { buildTourSteps, type TourSection } from "./guidedTourSteps";

export const tourRunAtom = atom(false);
export const tourStepIndexAtom = atom(0);
export const tourMenuOpenAtom = atom(false);
export const tourStepsAtom = atom<Step[]>([]);

/**
 * Whether the user may run playbooks, gating the playbooks walkthrough.
 */
export function useCanRunPlaybooks() {
  const { permissions, roles } = useUser();
  return (
    roles.includes("admin") ||
    roles.includes("editor") ||
    hasPlaybookRunPermission(permissions)
  );
}

/**
 * Returns a callback that opens the tour section picker.
 */
export function useStartTour() {
  const setMenuOpen = useSetAtom(tourMenuOpenAtom);

  return () => setMenuOpen(true);
}

/**
 * Returns a callback that starts the tour for a chosen section (or the full
 * tour), closing the picker.
 */
export function useStartTourSection() {
  const setMenuOpen = useSetAtom(tourMenuOpenAtom);
  const setSteps = useSetAtom(tourStepsAtom);
  const setStepIndex = useSetAtom(tourStepIndexAtom);
  const setRun = useSetAtom(tourRunAtom);
  const canRunPlaybooks = useCanRunPlaybooks();

  return (section: TourSection) => {
    setSteps(buildTourSteps(section, { canRunPlaybooks }));
    setStepIndex(0);
    setMenuOpen(false);
    setRun(true);
  };
}
