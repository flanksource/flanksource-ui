// ABOUTME: The playbooks section of the guided tour and its checklist touchpoints.
// ABOUTME: Covers running a playbook, its parameters, and inspecting a past run's details.
import { type Step } from "react-joyride";
import {
  findPlaybookCardTarget,
  findPlaybookRunButtonTarget,
  findPlaybookRunRowTarget,
  tourTarget,
  type TourStepData
} from "./shared";

export const playbookSteps: Step[] = [
  {
    target: tourTarget("playbooks"),
    title: "Playbooks",
    content: "Open Playbooks to see the actions you can run.",
    placement: "right",
    skipBeacon: true,
    buttons: [],
    data: {
      key: "playbooks.view",
      touchpoint: "playbooks.view",
      advanceOnNavigateTo: "/playbooks",
      sectionStart: true
    } as TourStepData
  },
  {
    target: findPlaybookCardTarget,
    title: "Run an action",
    content:
      "Each playbook runs an action on demand. Click Run on this one to launch it.",
    placement: "bottom",
    skipBeacon: true,
    buttons: [],
    targetWaitTimeout: 5000,
    data: {
      key: "playbooks.open-card",
      dependsOn: ["playbooks.view"],
      advanceOnTargetClick: true,
      clickTarget: findPlaybookRunButtonTarget,
      onMissing: "skipSection"
    } as TourStepData
  },
  {
    target: tourTarget("playbook-params"),
    title: "Parameters",
    content: "Set any parameters the action needs here.",
    placement: "right",
    skipBeacon: true,
    buttons: ["primary"],
    targetWaitTimeout: 5000,
    data: {
      key: "playbooks.params",
      dependsOn: ["playbooks.open-card"],
      onMissing: "skip"
    } as TourStepData
  },
  {
    target: tourTarget("playbook-run-submit"),
    title: "Execute",
    content: "And this is how you execute it.",
    placement: "top",
    skipBeacon: true,
    buttons: ["primary"],
    data: {
      key: "playbooks.run",
      touchpoint: "playbooks.run",
      dependsOn: ["playbooks.open-card"],
      onMissing: "skip"
    } as TourStepData
  },
  {
    target: tourTarget("dialog-button-close"),
    title: "Past runs",
    content: "Close this and let's look at previous runs.",
    placement: "left",
    skipBeacon: true,
    buttons: [],
    data: {
      key: "playbooks.close",
      dependsOn: ["playbooks.open-card"],
      advanceOnTargetClick: true,
      onMissing: "skip"
    } as TourStepData
  },
  {
    target: tourTarget("tab-Runs"),
    title: "Runs",
    content: "Open the Runs tab to see past executions.",
    placement: "bottom",
    skipBeacon: true,
    buttons: [],
    data: {
      key: "playbooks.runs-tab",
      dependsOn: ["playbooks.view"],
      advanceOnNavigateTo: "/playbooks/runs"
    } as TourStepData
  },
  {
    target: findPlaybookRunRowTarget,
    title: "Inspect a run",
    content: "Click any past run to inspect it.",
    placement: "bottom",
    skipBeacon: true,
    buttons: [],
    targetWaitTimeout: 5000,
    data: {
      key: "playbooks.open-run",
      dependsOn: ["playbooks.runs-tab"],
      advanceOnPathMatch: /^\/playbooks\/runs\/[0-9a-f]{8}-/i,
      onMissing: "skip"
    } as TourStepData
  },
  {
    target: tourTarget("playbook-run-details"),
    title: "Run details",
    content:
      "This is where all the run details live — its status, parameters, logs and the result of every action.",
    placement: "center",
    skipBeacon: true,
    buttons: ["primary"],
    targetWaitTimeout: 8000,
    data: {
      key: "playbooks.view-run",
      touchpoint: "playbooks.view-run",
      dependsOn: ["playbooks.open-run"],
      onMissing: "skip"
    } as TourStepData
  }
];
