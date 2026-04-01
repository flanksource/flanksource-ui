// ABOUTME: Manages impersonated scope selections in sessionStorage.
// ABOUTME: Provides read/write/clear helpers and a custom event for cross-component sync.

import {
  ScopeDB,
  ScopeResourceSelector,
  ScopeResourceSelectorForm,
  ScopeTarget,
  ScopeTargetForm
} from "@flanksource-ui/api/types/scopes";

export const SCOPE_IMPERSONATION_CHANGE_EVENT = "scope-impersonation-change";

const IDS_KEY = "flanksource-impersonated-scope-ids";
const PAYLOAD_KEY = "flanksource-impersonated-scope-payload";
const MODE_KEY = "flanksource-impersonated-scope-mode";
const TARGETS_KEY = "flanksource-impersonated-scope-targets";

export type ImpersonationMode = "scopes" | "targets";

// Matches the backend rls.Scope struct
type RLSScope = {
  tags?: Record<string, string>;
  agents?: string[];
  names?: string[];
  id?: string;
};

// Matches the backend rls.Payload struct
export type RLSPayload = {
  config?: RLSScope[];
  component?: RLSScope[];
  playbook?: RLSScope[];
  canary?: RLSScope[];
  view?: RLSScope[];
  scopes?: string[];
};

const RESOURCE_TYPES = [
  "config",
  "component",
  "playbook",
  "canary",
  "view"
] as const;

type ResourceType = (typeof RESOURCE_TYPES)[number];

function parseTagSelector(tagSelector: string): Record<string, string> {
  const tags: Record<string, string> = {};
  tagSelector.split(",").forEach((pair) => {
    const [key, value] = pair.split("=");
    if (key && value) {
      tags[key.trim()] = value.trim();
    }
  });
  return tags;
}

function toRLSScope(selector: ScopeResourceSelector): RLSScope {
  const scope: RLSScope = {};
  if (selector.name) scope.names = [selector.name];
  if (selector.agent) scope.agents = [selector.agent];
  if (selector.tagSelector) {
    scope.tags = parseTagSelector(selector.tagSelector);
  }
  return scope;
}

function addScopeToPayload(
  payload: RLSPayload,
  resourceType: ResourceType,
  selector: ScopeResourceSelector
) {
  const rlsScope = toRLSScope(selector);
  if (!payload[resourceType]) {
    payload[resourceType] = [];
  }
  payload[resourceType]!.push(rlsScope);
}

export function buildPayload(scopes: ScopeDB[]): RLSPayload {
  const payload: RLSPayload = {};

  for (const scope of scopes) {
    for (const target of scope.targets ?? []) {
      for (const resourceType of RESOURCE_TYPES) {
        const selector = target[resourceType as keyof ScopeTarget];
        if (selector) {
          addScopeToPayload(payload, resourceType, selector);
        }
      }

      // "global" expands to all resource types except playbook
      if (target.global) {
        for (const resourceType of RESOURCE_TYPES) {
          if (resourceType === "playbook") continue;
          addScopeToPayload(payload, resourceType, target.global);
        }
      }
    }
  }

  const ids = scopes.map((s) => s.id);
  if (ids.length > 0) {
    payload.scopes = ids;
  }

  return payload;
}

function formSelectorToRLSScope(selector: ScopeResourceSelectorForm): RLSScope {
  if (selector.wildcard) {
    return { names: ["*"] };
  }

  const scope: RLSScope = {};
  if (selector.name) scope.names = [selector.name];
  if (selector.agent) scope.agents = [selector.agent];

  // Form uses tags object; fall back to tagSelector string
  if (selector.tags && Object.keys(selector.tags).length > 0) {
    scope.tags = { ...selector.tags };
  } else if (selector.tagSelector) {
    scope.tags = parseTagSelector(selector.tagSelector);
  }

  return scope;
}

function addFormScopeToPayload(
  payload: RLSPayload,
  resourceType: ResourceType,
  selector: ScopeResourceSelectorForm
) {
  const rlsScope = formSelectorToRLSScope(selector);
  if (!payload[resourceType]) {
    payload[resourceType] = [];
  }
  payload[resourceType]!.push(rlsScope);
}

export function buildPayloadFromTargets(
  targets: ScopeTargetForm[]
): RLSPayload {
  const payload: RLSPayload = {};

  for (const target of targets) {
    for (const resourceType of RESOURCE_TYPES) {
      const selector = target[resourceType as keyof ScopeTargetForm];
      if (selector) {
        addFormScopeToPayload(payload, resourceType, selector);
      }
    }

    if (target.global) {
      for (const resourceType of RESOURCE_TYPES) {
        if (resourceType === "playbook") continue;
        addFormScopeToPayload(payload, resourceType, target.global);
      }
    }
  }

  return payload;
}

export function getImpersonatedScopeIds(): string[] {
  try {
    const raw = sessionStorage.getItem(IDS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function getImpersonatedPayload(): RLSPayload | null {
  try {
    const raw = sessionStorage.getItem(PAYLOAD_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function getImpersonationMode(): ImpersonationMode {
  return (sessionStorage.getItem(MODE_KEY) as ImpersonationMode) || "scopes";
}

export function getImpersonatedTargets(): ScopeTargetForm[] {
  try {
    const raw = sessionStorage.getItem(TARGETS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function setImpersonatedScopes(scopes: ScopeDB[]): void {
  if (scopes.length === 0) {
    sessionStorage.removeItem(IDS_KEY);
    sessionStorage.removeItem(PAYLOAD_KEY);
    sessionStorage.removeItem(MODE_KEY);
    sessionStorage.removeItem(TARGETS_KEY);
  } else {
    const ids = scopes.map((s) => s.id);
    const payload = buildPayload(scopes);
    sessionStorage.setItem(IDS_KEY, JSON.stringify(ids));
    sessionStorage.setItem(PAYLOAD_KEY, JSON.stringify(payload));
    sessionStorage.setItem(MODE_KEY, "scopes");
    sessionStorage.removeItem(TARGETS_KEY);
  }
  window.dispatchEvent(new CustomEvent(SCOPE_IMPERSONATION_CHANGE_EVENT));
}

export function setImpersonatedTargets(targets: ScopeTargetForm[]): void {
  if (targets.length === 0) {
    sessionStorage.removeItem(IDS_KEY);
    sessionStorage.removeItem(PAYLOAD_KEY);
    sessionStorage.removeItem(MODE_KEY);
    sessionStorage.removeItem(TARGETS_KEY);
  } else {
    const payload = buildPayloadFromTargets(targets);
    sessionStorage.setItem(PAYLOAD_KEY, JSON.stringify(payload));
    sessionStorage.setItem(MODE_KEY, "targets");
    sessionStorage.setItem(TARGETS_KEY, JSON.stringify(targets));
    sessionStorage.removeItem(IDS_KEY);
  }
  window.dispatchEvent(new CustomEvent(SCOPE_IMPERSONATION_CHANGE_EVENT));
}

export function clearImpersonatedScopes(): void {
  sessionStorage.removeItem(IDS_KEY);
  sessionStorage.removeItem(PAYLOAD_KEY);
  sessionStorage.removeItem(MODE_KEY);
  sessionStorage.removeItem(TARGETS_KEY);
  window.dispatchEvent(new CustomEvent(SCOPE_IMPERSONATION_CHANGE_EVENT));
}

export function hasImpersonatedScopes(): boolean {
  return getImpersonatedPayload() !== null;
}
