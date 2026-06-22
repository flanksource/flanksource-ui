// ABOUTME: Renders the interactive product tour and drives it in controlled mode.
// ABOUTME: Advances steps gated on navigation, URL params, or clicks on the target element.
import { useAtom } from "jotai";
import { useEffect } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { Joyride, EVENTS, type EventData } from "react-joyride";
import { tourRunAtom, tourStepIndexAtom } from "./guidedTourState";
import {
  reduceTourEvent,
  resolveAutoAdvance,
  resolveTargetNotFound,
  tourSteps,
  type TourStepData
} from "./guidedTourSteps";
import { TourTooltip } from "./TourTooltip";

export function GuidedTour() {
  const [run, setRun] = useAtom(tourRunAtom);
  const [stepIndex, setStepIndex] = useAtom(tourStepIndexAtom);
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();

  const endTour = () => {
    setRun(false);
    setStepIndex(0);
  };

  // Advance steps that wait for a navigation or a URL param (e.g. opening the
  // check modal sets ?checkId=...).
  useEffect(() => {
    if (!run) {
      return;
    }
    const next = resolveAutoAdvance(tourSteps, stepIndex, {
      pathname,
      params: searchParams
    });
    if (next === "finish") {
      endTour();
    } else if (next !== null) {
      setStepIndex(next);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run, stepIndex, pathname, searchParams]);

  // Advance steps that wait for the user to click the highlighted element
  // (e.g. the Graph tab, whose selection lives in React state, not the URL).
  useEffect(() => {
    if (!run) {
      return;
    }
    const step = tourSteps[stepIndex];
    const data = step?.data as TourStepData | undefined;
    if (!data?.advanceOnTargetClick || typeof step.target !== "string") {
      return;
    }
    const element = document.querySelector<HTMLElement>(step.target);
    // A missing or hidden target (e.g. the Graph tab on tall viewports) can
    // never be clicked, so skip the step per its onMissing setting.
    if (!element || element.offsetParent === null) {
      const update = resolveTargetNotFound(tourSteps, stepIndex);
      setRun(update.run);
      setStepIndex(update.stepIndex);
      return;
    }
    const onClick = () => {
      const next = stepIndex + 1;
      if (next >= tourSteps.length) {
        endTour();
      } else {
        setStepIndex(next);
      }
    };
    element.addEventListener("click", onClick, { once: true });
    return () => element.removeEventListener("click", onClick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run, stepIndex]);

  const handleEvent = (data: EventData) => {
    if (data.type === EVENTS.TARGET_NOT_FOUND) {
      const update = resolveTargetNotFound(tourSteps, data.index);
      setRun(update.run);
      setStepIndex(update.stepIndex);
      return;
    }
    const update = reduceTourEvent(data);
    if (update) {
      setRun(update.run);
      setStepIndex(update.stepIndex);
    }
  };

  return (
    <Joyride
      steps={tourSteps}
      run={run}
      stepIndex={stepIndex}
      continuous
      onEvent={handleEvent}
      tooltipComponent={TourTooltip}
      options={{
        arrowColor: "#ffffff",
        overlayColor: "rgba(0, 0, 0, 0.5)",
        spotlightRadius: 6,
        closeButtonAction: "skip",
        overlayClickAction: false,
        zIndex: 10000
      }}
    />
  );
}
