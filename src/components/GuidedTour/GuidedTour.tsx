// ABOUTME: Renders the interactive product tour and drives it in controlled mode.
// ABOUTME: Advances steps gated on navigation, URL params, or clicks on the target element.
import { useAtom, useAtomValue } from "jotai";
import { useEffect } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { Joyride, EVENTS, type EventData, type Step } from "react-joyride";
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

/** Resolves a step's target (string selector or picker function) to an element. */
function resolveTarget(target: Step["target"]): HTMLElement | null {
  if (typeof target === "string") {
    return document.querySelector<HTMLElement>(target);
  }
  if (typeof target === "function") {
    return (target as () => HTMLElement | null)();
  }
  return null;
}

/** How long to poll for a not-yet-rendered target before giving up (~5s). */
const TARGET_POLL_ATTEMPTS = 33;
const TARGET_POLL_INTERVAL = 150;

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
  // data.clickTarget (e.g. highlight a card, advance on its Run button). The
  // element may render asynchronously (e.g. playbook cards), so poll for it
  // before treating it as missing.
  useEffect(() => {
    if (!run) {
      return;
    }
    const step = steps[stepIndex];
    const data = step?.data as TourStepData | undefined;
    if (!data?.advanceOnTargetClick) {
      return;
    }

    let cancelled = false;
    let attempts = 0;
    let pollTimer: ReturnType<typeof setTimeout>;
    let attached: HTMLElement | null = null;

    const onClick = () => {
      const next = stepIndex + 1;
      if (next >= steps.length) {
        endTour();
      } else {
        setStepIndex(next);
      }
    };

    const skip = () => {
      const update = resolveTargetNotFound(steps, stepIndex);
      setRun(update.run);
      setStepIndex(update.stepIndex);
    };

    const waitForElement = () => {
      if (cancelled) {
        return;
      }
      const element = data.clickTarget
        ? data.clickTarget()
        : resolveTarget(step.target);
      if (element) {
        // Present but hidden (e.g. the Graph tab on tall viewports) can never
        // be clicked — skip now rather than waiting it out.
        if (element.offsetParent === null) {
          skip();
          return;
        }
        attached = element;
        element.addEventListener("click", onClick, { once: true });
        return;
      }
      // Not rendered yet (e.g. async-loaded playbook cards) — keep polling.
      if (attempts++ < TARGET_POLL_ATTEMPTS) {
        pollTimer = setTimeout(waitForElement, TARGET_POLL_INTERVAL);
        return;
      }
      skip();
    };

    waitForElement();
    return () => {
      cancelled = true;
      clearTimeout(pollTimer);
      attached?.removeEventListener("click", onClick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run, stepIndex]);

  // Bring a step's target into view when it activates. react-joyride doesn't
  // reliably scroll targets inside nested scroll containers (e.g. the preferred
  // catalog type below the fold), so steps opt in via data.scrollIntoView.
  useEffect(() => {
    if (!run) {
      return;
    }
    const step = steps[stepIndex];
    const data = step?.data as TourStepData | undefined;
    if (!data?.scrollIntoView) {
      return;
    }
    let cancelled = false;
    let attempts = 0;
    let timer: ReturnType<typeof setTimeout>;
    const tryScroll = () => {
      if (cancelled) {
        return;
      }
      const element = resolveTarget(step.target);
      if (element && element.offsetParent !== null) {
        element.scrollIntoView({ block: "center" });
        // react-joyride positions its spotlight from the target's rect and only
        // observes the scroll parent it detected; after scrolling a nested
        // container it can't see, nudge it to recompute so the spotlight (and
        // its click-through hole) lands on the target.
        window.dispatchEvent(new Event("resize"));
        setTimeout(() => {
          if (!cancelled) {
            window.dispatchEvent(new Event("resize"));
          }
        }, 100);
        return;
      }
      if (attempts++ < TARGET_POLL_ATTEMPTS) {
        timer = setTimeout(tryScroll, TARGET_POLL_INTERVAL);
      }
    };
    timer = setTimeout(tryScroll, 0);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
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
