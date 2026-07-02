// ABOUTME: The health-checks section of the guided tour and its checklist touchpoints.
// ABOUTME: Walks from the Health nav through a check's stats, timeline, graph and on-demand run.
import { type Step } from "react-joyride";
import { findCheckRowTarget, tourTarget, type TourStepData } from "./shared";

export const healthSteps: Step[] = [
  {
    target: tourTarget("health"),
    title: "Health",
    content: "Now click Health to see your health checks.",
    placement: "right",
    skipBeacon: true,
    buttons: [],
    data: {
      key: "health.view",
      touchpoint: "health.view",
      advanceOnNavigateTo: "/health",
      sectionStart: true
    } as TourStepData
  },
  {
    target: tourTarget("checks-section"),
    title: "Health checks",
    content: "All of your health checks are listed here.",
    placement: "left",
    skipBeacon: true,
    buttons: ["primary"],
    data: {
      key: "health.checks-section",
      dependsOn: ["health.view"]
    } as TourStepData
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
      key: "health.open-check",
      touchpoint: "health.open-check",
      dependsOn: ["health.view"],
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
    targetWaitTimeout: 5000,
    data: {
      key: "health.check-stats",
      dependsOn: ["health.open-check"]
    } as TourStepData
  },
  {
    target: tourTarget("check-timeline"),
    title: "Check timeline",
    content:
      "And this is the check timeline — the age, duration and message of each run.",
    placement: "top",
    skipBeacon: true,
    buttons: ["primary"],
    data: {
      key: "health.check-timeline",
      dependsOn: ["health.open-check"]
    } as TourStepData
  },
  {
    target: tourTarget("check-tab-graph"),
    title: "Graph view",
    content: "Click the Graph tab to view the check history as a chart.",
    placement: "bottom",
    skipBeacon: true,
    buttons: [],
    data: {
      key: "health.view-graph",
      touchpoint: "health.view-graph",
      dependsOn: ["health.open-check"],
      advanceOnTargetClick: true,
      onMissing: "skip"
    } as TourStepData
  },
  {
    target: tourTarget("check-graph"),
    title: "Graph view",
    content: "Here we can see the check history in graph view as well.",
    placement: "top",
    skipBeacon: true,
    buttons: ["primary"],
    data: {
      key: "health.check-graph",
      dependsOn: ["health.view-graph"],
      onMissing: "skip"
    } as TourStepData
  },
  {
    target: tourTarget("check-run-now"),
    title: "Run on demand",
    content:
      "Checks run on their configured schedule, but you can also trigger one on demand here.",
    placement: "top",
    skipBeacon: true,
    buttons: ["primary"],
    data: {
      key: "health.run-now",
      touchpoint: "health.run-now",
      dependsOn: ["health.open-check"],
      onMissing: "skip"
    } as TourStepData
  },
  {
    target: tourTarget("dialog-button-close"),
    title: "That's health checks",
    content: "Close this check when you're ready to move on.",
    placement: "left",
    skipBeacon: true,
    buttons: [],
    data: {
      key: "health.close",
      dependsOn: ["health.open-check"],
      advanceOnTargetClick: true,
      onMissing: "skip"
    } as TourStepData
  }
];
