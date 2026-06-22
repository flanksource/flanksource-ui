// ABOUTME: Unit tests for the pure advance logic of the interactive tour.
// ABOUTME: Covers navigation/param gating, target-not-found handling, and event reduction.
import { ACTIONS, EVENTS, STATUS, type Step } from "react-joyride";
import {
  reduceTourEvent,
  resolveAutoAdvance,
  resolveTargetNotFound,
  tourSteps,
  tourTarget,
  type TourStepData
} from "../guidedTourSteps";

const ctx = (pathname: string, search = "") => ({
  pathname,
  params: new URLSearchParams(search)
});

describe("tourTarget", () => {
  it("builds a data-tour attribute selector", () => {
    expect(tourTarget("health")).toBe('[data-tour="health"]');
  });
});

describe("resolveAutoAdvance", () => {
  const steps: Step[] = [
    { target: "a", content: "x", data: { advanceOnNavigateTo: "/" } },
    { target: "a", content: "y" },
    { target: "b", content: "z", data: { advanceOnParam: "checkId" } }
  ];

  it("advances when the user navigates to the gated path", () => {
    expect(resolveAutoAdvance(steps, 0, ctx("/"))).toBe(1);
  });

  it("does not advance when the path does not match", () => {
    expect(resolveAutoAdvance(steps, 0, ctx("/health"))).toBeNull();
  });

  it("advances when the gated param is present", () => {
    expect(resolveAutoAdvance(steps, 2, ctx("/health", "checkId=abc"))).toBe(
      "finish"
    );
  });

  it("does not advance when the gated param is absent", () => {
    expect(resolveAutoAdvance(steps, 2, ctx("/health"))).toBeNull();
  });

  it("does not advance for a step without gating data", () => {
    expect(resolveAutoAdvance(steps, 1, ctx("/"))).toBeNull();
  });

  it("advances when the path matches the gated pattern", () => {
    const pathSteps: Step[] = [
      {
        target: "a",
        content: "x",
        data: { advanceOnPathMatch: /^\/catalog\/[0-9a-f]{8}-/i }
      },
      { target: "b", content: "y" }
    ];
    expect(
      resolveAutoAdvance(
        pathSteps,
        0,
        ctx("/catalog/0f9b1c2d-3e4f-5a6b-7c8d-9e0f1a2b3c4d")
      )
    ).toBe(1);
  });

  it("does not advance when the path does not match the pattern", () => {
    const pathSteps: Step[] = [
      {
        target: "a",
        content: "x",
        data: { advanceOnPathMatch: /^\/catalog\/[0-9a-f]{8}-/i }
      },
      { target: "b", content: "y" }
    ];
    expect(
      resolveAutoAdvance(pathSteps, 0, ctx("/catalog/changes"))
    ).toBeNull();
  });
});

describe("resolveTargetNotFound", () => {
  const steps: Step[] = [
    { target: "a", content: "x", data: { onMissing: "finish" } },
    { target: "b", content: "y", data: { onMissing: "skip" } },
    { target: "c", content: "z", data: { onMissing: "skip" } }
  ];

  it("ends the tour when onMissing is finish", () => {
    expect(resolveTargetNotFound(steps, 0)).toEqual({
      run: false,
      stepIndex: 0
    });
  });

  it("skips to the next step when onMissing is skip", () => {
    expect(resolveTargetNotFound(steps, 1)).toEqual({
      run: true,
      stepIndex: 2
    });
  });

  it("ends the tour when skipping past the last step", () => {
    expect(resolveTargetNotFound(steps, 2)).toEqual({
      run: false,
      stepIndex: 0
    });
  });

  it("defaults to skip when onMissing is unset", () => {
    const noData: Step[] = [
      { target: "a", content: "x" },
      { target: "b", content: "y" }
    ];
    expect(resolveTargetNotFound(noData, 0)).toEqual({
      run: true,
      stepIndex: 1
    });
  });
});

describe("reduceTourEvent", () => {
  const base = {
    action: ACTIONS.NEXT,
    type: EVENTS.STEP_AFTER,
    status: STATUS.RUNNING,
    index: 1
  };

  it("advances on a next-button step:after event", () => {
    expect(reduceTourEvent(base)).toEqual({ run: true, stepIndex: 2 });
  });

  it("goes back on a prev-button step:after event", () => {
    expect(reduceTourEvent({ ...base, action: ACTIONS.PREV })).toEqual({
      run: true,
      stepIndex: 0
    });
  });

  it("ends the tour when skipped", () => {
    expect(
      reduceTourEvent({ ...base, action: ACTIONS.SKIP, status: STATUS.SKIPPED })
    ).toEqual({ run: false, stepIndex: 0 });
  });

  it("ends the tour when closed", () => {
    expect(reduceTourEvent({ ...base, action: ACTIONS.CLOSE })).toEqual({
      run: false,
      stepIndex: 0
    });
  });

  it("ends the tour when finished", () => {
    expect(reduceTourEvent({ ...base, status: STATUS.FINISHED })).toEqual({
      run: false,
      stepIndex: 0
    });
  });

  it("ignores unrelated events", () => {
    expect(reduceTourEvent({ ...base, type: EVENTS.STEP_BEFORE })).toBeNull();
  });
});

describe("tourSteps", () => {
  it("gates the health step on navigation and the check step on the modal param", () => {
    const health = tourSteps.find((s) => s.target === tourTarget("health"));
    expect((health?.data as TourStepData).advanceOnNavigateTo).toBe("/health");

    const checkRow = tourSteps.find((s) => typeof s.target === "function");
    expect((checkRow?.data as TourStepData).advanceOnParam).toBe("checkId");
    expect((checkRow?.data as TourStepData).onMissing).toBe("finish");
  });

  it("gates the catalog nav step on navigation and the type step on the configType param", () => {
    const catalog = tourSteps.find((s) => s.target === tourTarget("catalog"));
    expect((catalog?.data as TourStepData).advanceOnNavigateTo).toBe(
      "/catalog"
    );

    const typeStep = tourSteps.find(
      (s) => (s.data as TourStepData)?.advanceOnParam === "configType"
    );
    expect(typeStep).toBeDefined();
    expect((typeStep?.data as TourStepData).onMissing).toBe("finish");
  });

  it("gates the catalog item step on navigating to a resource detail path", () => {
    const itemStep = tourSteps.find(
      (s) => (s.data as TourStepData)?.advanceOnPathMatch
    );
    expect(itemStep).toBeDefined();
    const pattern = (itemStep?.data as TourStepData).advanceOnPathMatch!;
    expect(pattern.test("/catalog/0f9b1c2d-3e4f-5a6b-7c8d-9e0f1a2b3c4d")).toBe(
      true
    );
    expect(pattern.test("/catalog/changes")).toBe(false);
  });

  it("gates the relationships and playbooks tabs on clicking them and skips when absent", () => {
    const relationships = tourSteps.find(
      (s) => s.target === tourTarget("tab-Relationships")
    );
    expect((relationships?.data as TourStepData).advanceOnTargetClick).toBe(
      true
    );
    expect((relationships?.data as TourStepData).onMissing).toBe("skip");

    const playbooks = tourSteps.find(
      (s) => s.target === tourTarget("tab-Playbooks")
    );
    expect((playbooks?.data as TourStepData).advanceOnTargetClick).toBe(true);
    expect((playbooks?.data as TourStepData).onMissing).toBe("skip");
  });
});
