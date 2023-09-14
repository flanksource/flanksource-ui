import { upperCase } from "lodash";
import { SchemaResourceType } from "../components/SchemaResourcePage/resourceTypes";

export const enum Events {
  "AddedDoDToIncident" = "AddedDoDToIncident",
  "AddedResponderToIncident" = "AddedResponderToIncident",
  "AttachEvidenceToIncident" = "AttachEvidenceToIncident",
  "CreatedIncident" = "CreatedIncident",
  "DownloadedSnapshot" = "DownloadedSnapshot",
  "LinkedComponentToConfig" = "LinkedComponentToConfig"
}

// Investigate if we can use this to track the user
export function sendAnalyticEvent(
  checklistEvent: Events,
  metadata: Record<string, any> = {}
) {
  // windows.Intercom is a global variable injected by the Intercom script and
  // should be available if the script is loaded and executed correctly.
  if (window && window.Intercom) {
    window.Intercom("trackEvent", checklistEvent, metadata);
  }
}

export function sendResourceDeletedEvent(
  resourceName: SchemaResourceType["name"],
  metadata: Record<string, any> = {}
) {
  // windows.Intercom is a global variable injected by the Intercom script and
  // should be available if the script is loaded and executed correctly.
  if (window && window.Intercom) {
    window.Intercom(
      "trackEvent",
      `DeletedSetting${upperCase(resourceName.replaceAll(/\s\s+/g, ""))}`,
      metadata
    );
  }
}

export function sendResourceCreatedEvent(
  resourceName: SchemaResourceType["name"],
  metadata: Record<string, any> = {}
) {
  // windows.Intercom is a global variable injected by the Intercom script and
  // should be available if the script is loaded and executed correctly.
  if (window && window.Intercom) {
    window.Intercom(
      "trackEvent",
      `CreatedSetting${upperCase(resourceName.replaceAll(/\s\s+/g, ""))}`,
      metadata
    );
  }
}
