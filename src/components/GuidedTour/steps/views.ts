// ABOUTME: The views section of the guided tour and its checklist touchpoint.
// ABOUTME: Opens a custom view and explains that views compose graphs, tables and charts.
import { type Step } from "react-joyride";
import { findViewTarget, tourTarget, type TourStepData } from "./shared";

export const viewSteps: Step[] = [
  {
    target: findViewTarget,
    title: "Views",
    content: "Open a view to see it.",
    placement: "right",
    skipBeacon: true,
    buttons: [],
    targetWaitTimeout: 5000,
    data: {
      key: "views.open",
      touchpoint: "views.open",
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
      key: "views.content",
      dependsOn: ["views.open"],
      docLink: "https://flanksource.com/docs/guide/views",
      onMissing: "skip"
    } as TourStepData
  }
];
