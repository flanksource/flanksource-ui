// ABOUTME: Jotai atoms holding the interactive product tour's run flag and current step.
// ABOUTME: Shared between the menu trigger and the GuidedTour renderer mounted in the app shell.
import { atom, useSetAtom } from "jotai";

export const tourRunAtom = atom(false);
export const tourStepIndexAtom = atom(0);

/**
 * Returns a callback that starts the interactive tour from the first step.
 */
export function useStartTour() {
  const setRun = useSetAtom(tourRunAtom);
  const setStepIndex = useSetAtom(tourStepIndexAtom);

  return () => {
    setStepIndex(0);
    setRun(true);
  };
}
