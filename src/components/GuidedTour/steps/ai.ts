// ABOUTME: The AI section of the guided tour and its checklist touchpoint.
// ABOUTME: Points at the user menu where "Setup MCP" connects an AI client to Mission Control.
import { type Step } from "react-joyride";
import { tourTarget, type TourStepData } from "./shared";

export const aiSteps: Step[] = [
  {
    target: tourTarget("user-menu"),
    title: "Connect your AI tools",
    content:
      "Open this menu and choose “Setup MCP” to connect your AI client — Claude Code, VS Code and others — to Mission Control. Copy the generated config into your client's MCP settings.",
    placement: "left",
    skipBeacon: true,
    buttons: ["primary"],
    data: {
      key: "ai.setup-mcp",
      touchpoint: "ai.setup-mcp",
      sectionStart: true,
      onMissing: "skip"
    } as TourStepData
  }
];
