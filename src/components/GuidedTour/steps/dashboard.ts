// ABOUTME: The dashboard intro steps shown at the start of the full guided tour.
// ABOUTME: Not part of the getting-started checklist; purely a scene-setting opener.
import { type Step } from "react-joyride";
import { tourTarget, type TourStepData } from "./shared";

export const dashboardSteps: Step[] = [
  {
    target: tourTarget("dashboard"),
    title: "Dashboard",
    content: "Let's start here. Click Dashboard to open it.",
    placement: "right",
    skipBeacon: true,
    buttons: [],
    data: {
      key: "dashboard.view",
      advanceOnNavigateTo: "/",
      sectionStart: true
    } as TourStepData
  },
  {
    target: tourTarget("dashboard"),
    title: "Dashboard",
    content:
      "This is the central view of everything happening across your infrastructure — health, incidents, and changes, all at a glance.",
    placement: "right",
    skipBeacon: true,
    buttons: ["primary"],
    data: {
      key: "dashboard.intro",
      dependsOn: ["dashboard.view"]
    } as TourStepData
  }
];
