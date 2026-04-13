import { PermissionSubject } from "@flanksource-ui/api/services/permissions";
import { PermissionsSummary } from "@flanksource-ui/api/types/permissions";
import SubjectAvatar from "@flanksource-ui/components/Permissions/SubjectAvatar";
import TriStateAccessSwitch from "@flanksource-ui/components/Permissions/TriStateAccessSwitch";
import { Button } from "@flanksource-ui/components/ui/button";
import { Input } from "@flanksource-ui/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@flanksource-ui/components/ui/tooltip";
import { mapSubjectType } from "@flanksource-ui/lib/permissions/mcpPermissionCardMappings";
import { Switch as SegmentedSwitch } from "@flanksource-ui/ui/FormControls/Switch";
import { Icon } from "@flanksource-ui/ui/Icons/Icon";
import { Check, X } from "lucide-react";
import { useMemo, useState } from "react";

export type ResourceAccess = "deny" | "default" | "allow";

export type McpSubjectResource = {
  id: string;
  kind: "playbook" | "view";
  /** Canonical selector name used by object_selector (e.g. playbook.name / view.name). */
  name: string;
  /** Optional UI label (e.g. title). Falls back to canonical `name`. */
  displayName?: string;
  namespace?: string;
  icon?: string;
  subtitle?: string;
};
type ResourceSelectorPanelProps = {
  selectedSubject: PermissionSubject;
  resources: McpSubjectResource[];
  permissions: PermissionsSummary[];
  effectiveAccessByResourceKey?: Record<string, boolean>;
  hasEffectiveAccessResults?: boolean;
  isCheckingEffectiveAccess?: boolean;
  isSubmitting?: boolean;
  mutatingResourceIds?: Record<string, true>;
  onCheckEffectiveAccess?: () => void;
  onSetResourceAccess: (
    resource: McpSubjectResource,
    access: ResourceAccess
  ) => Promise<void> | void;
  onSetManyResourceAccess: (
    resources: McpSubjectResource[],
    access: ResourceAccess
  ) => Promise<void> | void;
};
const BULK_OPTIONS = ["Deny All", "Custom", "Allow all"] as const;
type BulkOption = (typeof BULK_OPTIONS)[number];

function getRefsForPermission(
  permission: PermissionsSummary,
  kind: "playbook" | "view"
) {
  return kind === "playbook"
    ? (permission.object_selector?.playbooks ?? [])
    : (permission.object_selector?.views ?? []);
}

function permissionMatchesResource(
  permission: PermissionsSummary,
  resource: McpSubjectResource
) {
  const refs = getRefsForPermission(permission, resource.kind);

  return refs.some((ref) => {
    if (!ref?.name || ref.name === "*") {
      return false;
    }

    if (ref.namespace) {
      return ref.namespace === resource.namespace && ref.name === resource.name;
    }

    return ref.name === resource.name;
  });
}

function getAccessState(
  permissions: PermissionsSummary[],
  subject: PermissionSubject,
  resource: McpSubjectResource
): {
  access: ResourceAccess;
} {
  const subjectType = mapSubjectType(subject.type);

  const direct = permissions.filter(
    (permission) =>
      permission.action === "mcp:run" &&
      permission.source === "mcp_settings" &&
      permission.subject === subject.id &&
      permission.subject_type === subjectType &&
      permissionMatchesResource(permission, resource)
  );

  if (direct.length > 0) {
    return {
      access: direct.some((permission) => permission.deny === true)
        ? "deny"
        : "allow"
    };
  }

  return { access: "default" };
}

export default function ResourceSelectorPanel({
  selectedSubject,
  resources,
  permissions,
  effectiveAccessByResourceKey = {},
  hasEffectiveAccessResults = false,
  isCheckingEffectiveAccess = false,
  isSubmitting = false,
  mutatingResourceIds = {},
  onCheckEffectiveAccess,
  onSetResourceAccess,
  onSetManyResourceAccess
}: ResourceSelectorPanelProps) {
  const [resourceSearch, setResourceSearch] = useState("");

  const normalizedSearch = resourceSearch.trim().toLowerCase();

  const filteredResources = useMemo(() => {
    return resources.filter((resource) => {
      if (!normalizedSearch) {
        return true;
      }

      const haystack =
        `${resource.displayName || resource.name} ${resource.name} ${resource.subtitle || ""} ${resource.namespace || ""}`.toLowerCase();
      return haystack.includes(normalizedSearch);
    });
  }, [normalizedSearch, resources]);

  const resourcesByType = useMemo(() => {
    const playbooks: McpSubjectResource[] = [];
    const views: McpSubjectResource[] = [];

    for (const resource of filteredResources) {
      if (resource.kind === "playbook") {
        playbooks.push(resource);
      } else {
        views.push(resource);
      }
    }

    return { playbooks, views };
  }, [filteredResources]);

  const bulkAccess = useMemo<ResourceAccess>(() => {
    const subjectType = mapSubjectType(selectedSubject.type);

    const getWildcardAccessByKind = (
      kind: "playbook" | "view"
    ): ResourceAccess => {
      const wildcardPermissions = permissions.filter((permission) => {
        if (
          permission.action !== "mcp:run" ||
          permission.source !== "mcp_settings" ||
          permission.subject !== selectedSubject.id ||
          permission.subject_type !== subjectType
        ) {
          return false;
        }

        return getRefsForPermission(permission, kind).some(
          (ref) => ref?.name === "*" && !ref?.namespace
        );
      });

      if (wildcardPermissions.length === 0) {
        return "default";
      }

      return wildcardPermissions.some((permission) => permission.deny === true)
        ? "deny"
        : "allow";
    };

    const playbookAccess = getWildcardAccessByKind("playbook");
    const viewAccess = getWildcardAccessByKind("view");

    if (playbookAccess === viewAccess) {
      return playbookAccess;
    }

    return "default";
  }, [permissions, selectedSubject]);

  const bulkOptionValue: BulkOption =
    bulkAccess === "allow"
      ? "Allow all"
      : bulkAccess === "deny"
        ? "Deny All"
        : "Custom";

  const isListLocked = bulkAccess === "allow" || bulkAccess === "deny";

  const getEffectiveBadge = (resource: McpSubjectResource) => {
    if (!hasEffectiveAccessResults) {
      return null;
    }

    const isAllowed =
      effectiveAccessByResourceKey[`${resource.kind}:${resource.id}`] === true;

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className={
              isAllowed
                ? "inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 text-emerald-600"
                : "inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-50 text-red-600"
            }
          >
            {isAllowed ? (
              <Check className="h-3.5 w-3.5" />
            ) : (
              <X className="h-3.5 w-3.5" />
            )}
          </span>
        </TooltipTrigger>
        <TooltipContent side="top">
          Effective access: {isAllowed ? "Allowed" : "Denied"}
        </TooltipContent>
      </Tooltip>
    );
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="space-y-3 pb-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <SubjectAvatar subject={selectedSubject} size="md" />
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-gray-900">
                {selectedSubject.name}
              </div>
            </div>
          </div>

          {onCheckEffectiveAccess ? (
            <Button
              type="button"
              size="sm"
              className="w-48 justify-center bg-blue-600 text-white hover:bg-blue-700"
              onClick={onCheckEffectiveAccess}
              disabled={isCheckingEffectiveAccess || resources.length === 0}
            >
              {isCheckingEffectiveAccess
                ? "Checking effective access..."
                : "Check effective access"}
            </Button>
          ) : null}
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="text-sm text-gray-600">Global Permission</div>

          <div
            className={
              isSubmitting || filteredResources.length === 0
                ? "pointer-events-none opacity-60"
                : undefined
            }
            aria-disabled={
              isSubmitting || filteredResources.length === 0 || undefined
            }
          >
            <SegmentedSwitch
              size="sm"
              className="w-48"
              itemsClassName="flex-1 justify-center"
              options={[...BULK_OPTIONS]}
              value={bulkOptionValue}
              onChange={(value) => {
                const access: ResourceAccess =
                  value === "Allow all"
                    ? "allow"
                    : value === "Deny All"
                      ? "deny"
                      : "default";
                onSetManyResourceAccess(filteredResources, access);
              }}
              getActiveItemClassName={(option) =>
                option === "Allow all"
                  ? "!bg-green-600 !text-white !ring-green-600"
                  : option === "Deny All"
                    ? "!bg-red-600 !text-white !ring-red-600"
                    : undefined
              }
            />
          </div>
        </div>
      </div>

      <div className="relative min-h-0 flex-1 pt-3">
        <div className="flex h-full min-h-0 flex-col gap-3">
          <div className="flex items-center gap-3">
            <Input
              className="flex-1"
              placeholder="Search ..."
              value={resourceSearch}
              onChange={(event) => setResourceSearch(event.target.value)}
            />
          </div>

          <div className="mb-3 min-h-0 flex-1 space-y-4 overflow-y-auto">
            <div className="space-y-2">
              <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Playbooks
              </div>
              <div className="overflow-hidden rounded-md border border-gray-200">
                {resourcesByType.playbooks.length === 0 ? (
                  <div className="p-3 text-sm text-gray-500">
                    No playbooks found
                  </div>
                ) : (
                  resourcesByType.playbooks.map((resource) => {
                    const state = getAccessState(
                      permissions,
                      selectedSubject,
                      resource
                    );

                    return (
                      <div
                        key={resource.id}
                        className="flex items-center justify-between gap-3 border-b border-gray-200 p-3 last:border-b-0"
                      >
                        <div className="flex min-w-0 items-center gap-2">
                          <Icon
                            name={resource.icon || "playbook"}
                            className="h-4 w-4 text-gray-500"
                          />
                          <div className="min-w-0">
                            <div className="truncate text-sm font-medium text-gray-900">
                              {resource.displayName || resource.name}
                            </div>
                            {resource.subtitle ? (
                              <div className="truncate text-xs text-gray-500">
                                {resource.subtitle}
                              </div>
                            ) : null}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {getEffectiveBadge(resource)}
                          {!isListLocked ? (
                            <TriStateAccessSwitch
                              value={state.access}
                              disabled={
                                Boolean(mutatingResourceIds[resource.id]) ||
                                isSubmitting
                              }
                              onChange={(access) =>
                                onSetResourceAccess(resource, access)
                              }
                            />
                          ) : null}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Views
              </div>
              <div className="overflow-hidden rounded-md border border-gray-200">
                {resourcesByType.views.length === 0 ? (
                  <div className="p-3 text-sm text-gray-500">
                    No views found
                  </div>
                ) : (
                  resourcesByType.views.map((resource) => {
                    const state = getAccessState(
                      permissions,
                      selectedSubject,
                      resource
                    );

                    return (
                      <div
                        key={resource.id}
                        className="flex items-center justify-between gap-3 border-b border-gray-200 p-3 last:border-b-0"
                      >
                        <div className="flex min-w-0 items-center gap-2">
                          <Icon
                            name={resource.icon || "workflow"}
                            className="h-4 w-4 text-gray-500"
                          />
                          <div className="min-w-0">
                            <div className="truncate text-sm font-medium text-gray-900">
                              {resource.displayName || resource.name}
                            </div>
                            {resource.subtitle ? (
                              <div className="truncate text-xs text-gray-500">
                                {resource.subtitle}
                              </div>
                            ) : null}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {getEffectiveBadge(resource)}
                          {!isListLocked ? (
                            <TriStateAccessSwitch
                              value={state.access}
                              disabled={
                                Boolean(mutatingResourceIds[resource.id]) ||
                                isSubmitting
                              }
                              onChange={(access) =>
                                onSetResourceAccess(resource, access)
                              }
                            />
                          ) : null}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
