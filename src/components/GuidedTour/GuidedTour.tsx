// ABOUTME: Renders the interactive product tour and drives it in controlled mode.
// ABOUTME: Advances steps gated on navigation, URL params, or clicks on the target element.
import { useAtom, useAtomValue } from "jotai";
import { useEffect } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { Joyride, EVENTS, type EventData } from "react-joyride";
import {
  tourRunAtom,
  tourStepIndexAtom,
  tourStepsAtom
} from "./guidedTourState";
import {
  reduceTourEvent,
  resolveAutoAdvance,
  resolveTargetNotFound,
  type TourStepData
} from "./guidedTourSteps";
import { TourMenu } from "./TourMenu";
import { TourTooltip } from "./TourTooltip";

export function GuidedTour() {
  const [run, setRun] = useAtom(tourRunAtom);
  const [stepIndex, setStepIndex] = useAtom(tourStepIndexAtom);
  const steps = useAtomValue(tourStepsAtom);
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
    const next = resolveAutoAdvance(steps, stepIndex, {
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

  // Advance steps that wait for the user to click an element (e.g. the Graph
  // tab, whose selection lives in React state, not the URL). The click can be
  // listened for on a different element than the highlighted one via
  // data.clickTarget (e.g. highlight a card, advance on its Run button).
  useEffect(() => {
    if (!run) {
      return;
    }
    const step = steps[stepIndex];
    const data = step?.data as TourStepData | undefined;
    if (!data?.advanceOnTargetClick) {
      return;
    }
    const element = data.clickTarget
      ? data.clickTarget()
      : typeof step.target === "string"
        ? document.querySelector<HTMLElement>(step.target)
        : typeof step.target === "function"
          ? (step.target as () => HTMLElement | null)()
          : null;
    // A missing or hidden target (e.g. the Graph tab on tall viewports) can
    // never be clicked, so skip the step per its onMissing setting.
    if (!element || element.offsetParent === null) {
      const update = resolveTargetNotFound(steps, stepIndex);
      setRun(update.run);
      setStepIndex(update.stepIndex);
      return;
    }
    const onClick = () => {
      const next = stepIndex + 1;
      if (next >= steps.length) {
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
      const update = resolveTargetNotFound(steps, data.index);
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
    <>
      <TourMenu />
      <Joyride
        steps={steps}
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
    </>
  );
}
