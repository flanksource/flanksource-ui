// ABOUTME: The catalog section of the guided tour and its checklist touchpoints.
// ABOUTME: Drills from the resource summary into a type, an item, its spec, relationships and playbooks.
import { type Step } from "react-joyride";
import {
  findConfigClassTarget,
  findConfigItemTarget,
  findConfigTypeTarget,
  tourTarget,
  type TourStepData
} from "./shared";

export const catalogSteps: Step[] = [
  {
    target: tourTarget("catalog"),
    title: "Catalog",
    content: "Now open the Catalog.",
    placement: "right",
    skipBeacon: true,
    buttons: [],
    data: {
      key: "catalog.view",
      touchpoint: "catalog.view",
      advanceOnNavigateTo: "/catalog",
      sectionStart: true
    } as TourStepData
  },
  {
    target: tourTarget("catalog-summary"),
    title: "Catalog",
    content: "All the tracked resources are shown here, grouped by type.",
    placement: "center",
    skipBeacon: true,
    buttons: ["primary"],
    data: {
      key: "catalog.summary",
      dependsOn: ["catalog.view"]
    } as TourStepData
  },
  {
    target: findConfigClassTarget,
    title: "Pick a group",
    content: "Click a group to expand the resource types inside it.",
    placement: "right",
    skipBeacon: true,
    buttons: [],
    targetWaitTimeout: 5000,
    data: {
      key: "catalog.expand",
      dependsOn: ["catalog.view"],
      advanceOnTargetClick: true,
      onMissing: "skip"
    } as TourStepData
  },
  {
    target: findConfigTypeTarget,
    title: "Pick a type",
    content: "Click a type to see the resources of that kind.",
    placement: "right",
    skipBeacon: true,
    buttons: [],
    targetWaitTimeout: 5000,
    data: {
      key: "catalog.open-type",
      touchpoint: "catalog.open-type",
      dependsOn: ["catalog.expand"],
      advanceOnParam: "configType",
      onMissing: "skipSection",
      scrollIntoView: true
    } as TourStepData
  },
  {
    target: findConfigItemTarget,
    title: "Open a resource",
    content: "Open any resource to see its full details.",
    placement: "right",
    skipBeacon: true,
    buttons: [],
    targetWaitTimeout: 5000,
    data: {
      key: "catalog.view-item",
      touchpoint: "catalog.view-item",
      dependsOn: ["catalog.open-type"],
      advanceOnPathMatch: /^\/catalog\/[0-9a-f]{8}-/i,
      onMissing: "skipSection"
    } as TourStepData
  },
  {
    target: tourTarget("config-spec"),
    title: "Spec",
    content:
      "This is the resource's full spec — the configuration we scraped for it.",
    placement: "center",
    skipBeacon: true,
    buttons: ["primary"],
    targetWaitTimeout: 8000,
    data: {
      key: "catalog.view-spec",
      touchpoint: "catalog.view-spec",
      dependsOn: ["catalog.view-item"],
      onMissing: "skip"
    } as TourStepData
  },
  {
    target: tourTarget("tab-Relationships"),
    title: "Relationships",
    content: "We can see how catalog items are linked.",
    placement: "bottom",
    skipBeacon: true,
    buttons: [],
    data: {
      key: "catalog.view-relationships",
      touchpoint: "catalog.view-relationships",
      dependsOn: ["catalog.view-item"],
      advanceOnTargetClick: true,
      onMissing: "skip"
    } as TourStepData
  },
  {
    target: tourTarget("tab-Playbooks"),
    title: "Playbooks",
    content: "These are operations you can perform on any catalog item.",
    placement: "bottom",
    skipBeacon: true,
    buttons: [],
    data: {
      key: "catalog.view-playbooks",
      touchpoint: "catalog.view-playbooks",
      dependsOn: ["catalog.view-item"],
      advanceOnTargetClick: true,
      onMissing: "skip"
    } as TourStepData
  }
];
