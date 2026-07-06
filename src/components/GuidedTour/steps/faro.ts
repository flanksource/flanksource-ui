// ABOUTME: The Faro CLI section of the guided tour and its checklist touchpoint.
// ABOUTME: Points at the user menu's "Setup CLI", where faro is installed and used.
import { type Step } from "react-joyride";
import { tourTarget, type TourStepData } from "./shared";

export const faroSteps: Step[] = [
  {
    target: tourTarget("user-menu"),
    title: "Use the command line",
    content:
      "Open this menu and choose “Setup CLI” to install faro, our command-line client. From your terminal you can then run “faro --help” to discover your workspace's plugin commands and run playbooks with “faro playbook run”.",
    placement: "left",
    skipBeacon: true,
    buttons: ["primary"],
    data: {
      key: "faro.setup-cli",
      touchpoint: "faro.setup-cli",
      sectionStart: true,
      onMissing: "skip"
    } as TourStepData
  }
];
