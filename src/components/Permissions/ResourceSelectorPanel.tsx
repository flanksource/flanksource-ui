import { PermissionSubject } from "@flanksource-ui/api/services/permissions";
import { PermissionsSummary } from "@flanksource-ui/api/types/permissions";
import SubjectAvatar from "@flanksource-ui/components/Permissions/SubjectAvatar";
import TriStateAccessSwitch from "@flanksource-ui/components/Permissions/TriStateAccessSwitch";
import { Button } from "@flanksource-ui/components/ui/button";
import { Input } from "@flanksource-ui/components/ui/input";
import { mapSubjectType } from "@flanksource-ui/lib/permissions/mcpPermissionCardMappings";
import { Switch } from "@flanksource-ui/ui/FormControls/Switch";
import { Icon } from "@flanksource-ui/ui/Icons/Icon";
import { useMemo, useState } from "react";

export type ResourceAccess = "deny" | "default" | "allow";

export type McpSubjectResource = {
  id: string;
  kind: "playbook" | "view";
  name: string;
  namespace?: string;
  icon?: string;
  subtitle?: string;
};

type ResourceSelectorPanelProps = {
  selectedSubject: PermissionSubject;
  resources: McpSubjectResource[];
  permissions: PermissionsSummary[];
  isSubmitting?: boolean;
  mutatingResourceIds?: Record<string, true>;
  onSetResourceAccess: (
    resource: McpSubjectResource,
    access: ResourceAccess
  ) => Promise<void> | void;
  onSetManyResourceAccess: (
    resources: McpSubjectResource[],
    access: ResourceAccess
  ) => Promise<void> | void;
};

const TABS = [
  { key: "all", label: "All" },
  { key: "allowed", label: "Allowed" },
  { key: "playbook", label: "Playbooks" },
  { key: "view", label: "Views" }
] as const;

const BULK_OPTIONS = ["Deny", "Default", "Allow"] as const;
type BulkOption = (typeof BULK_OPTIONS)[number];

type ActiveTab = (typeof TABS)[number]["key"];

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
  isSubmitting = false,
  mutatingResourceIds = {},
  onSetResourceAccess,
  onSetManyResourceAccess
}: ResourceSelectorPanelProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>("all");
  const [resourceSearch, setResourceSearch] = useState("");

  const normalizedSearch = resourceSearch.trim().toLowerCase();

  const filteredResources = useMemo(() => {
    return resources.filter((resource) => {
      if (activeTab === "playbook" || activeTab === "view") {
        if (resource.kind !== activeTab) {
          return false;
        }
      }

      if (activeTab === "allowed") {
        const access = getAccessState(
          permissions,
          selectedSubject,
          resource
        ).access;
        if (access !== "allow") {
          return false;
        }
      }

      if (!normalizedSearch) {
        return true;
      }

      const haystack =
        `${resource.name} ${resource.subtitle || ""} ${resource.namespace || ""}`.toLowerCase();
      return haystack.includes(normalizedSearch);
    });
  }, [activeTab, normalizedSearch, permissions, resources, selectedSubject]);

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

  const counts = useMemo(() => {
    const playbooks = resources.filter(
      (resource) => resource.kind === "playbook"
    ).length;
    const views = resources.filter(
      (resource) => resource.kind === "view"
    ).length;
    const allowed = resources.filter(
      (resource) =>
        getAccessState(permissions, selectedSubject, resource).access ===
        "allow"
    ).length;

    return {
      all: playbooks + views,
      allowed,
      playbook: playbooks,
      view: views
    };
  }, [permissions, resources, selectedSubject]);

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

    if (activeTab === "playbook") {
      return getWildcardAccessByKind("playbook");
    }

    if (activeTab === "view") {
      return getWildcardAccessByKind("view");
    }

    const playbookAccess = getWildcardAccessByKind("playbook");
    const viewAccess = getWildcardAccessByKind("view");

    if (playbookAccess === viewAccess) {
      return playbookAccess;
    }

    return "default";
  }, [activeTab, permissions, selectedSubject]);

  const bulkOptionValue: BulkOption =
    bulkAccess === "allow"
      ? "Allow"
      : bulkAccess === "deny"
        ? "Deny"
        : "Default";

  const isListLocked = bulkAccess === "allow" || bulkAccess === "deny";

  const resetTargetResources =
    activeTab === "playbook"
      ? resources.filter((resource) => resource.kind === "playbook")
      : activeTab === "view"
        ? resources.filter((resource) => resource.kind === "view")
        : resources;

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <SubjectAvatar subject={selectedSubject} size="md" />
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-gray-900">
              {selectedSubject.name}
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
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
            <Switch
              size="sm"
              options={[...BULK_OPTIONS]}
              value={bulkOptionValue}
              onChange={(value) => {
                const access: ResourceAccess =
                  value === "Allow"
                    ? "allow"
                    : value === "Deny"
                      ? "deny"
                      : "default";
                onSetManyResourceAccess(filteredResources, access);
              }}
              getActiveItemClassName={(option) =>
                option === "Allow"
                  ? "!bg-green-600 !text-white !ring-green-600"
                  : option === "Deny"
                    ? "!bg-red-600 !text-white !ring-red-600"
                    : undefined
              }
            />
          </div>
        </div>
      </div>

      <div className="relative min-h-0 flex-1">
        <div
          className={`flex h-full min-h-0 flex-col gap-3 ${
            isListLocked
              ? "pointer-events-none select-none opacity-60 blur-[1px]"
              : ""
          }`}
          aria-hidden={isListLocked || undefined}
        >
          <div className="flex items-center gap-2">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.key;
              const count = counts[tab.key];

              return (
                <Button
                  key={tab.key}
                  type="button"
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  className={
                    isActive
                      ? "border-gray-900 bg-gray-900 text-white hover:bg-gray-800"
                      : "text-gray-700"
                  }
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.label}{" "}
                  <span className="ml-1 text-xs opacity-80">{count}</span>
                </Button>
              );
            })}
          </div>

          <Input
            placeholder="Search ..."
            value={resourceSearch}
            onChange={(event) => setResourceSearch(event.target.value)}
          />

          <div className="mb-3 min-h-0 flex-1 space-y-4 overflow-y-auto">
            {(activeTab === "all" ||
              activeTab === "allowed" ||
              activeTab === "playbook") && (
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
                                {resource.name}
                              </div>
                              {resource.subtitle ? (
                                <div className="truncate text-xs text-gray-500">
                                  {resource.subtitle}
                                </div>
                              ) : null}
                            </div>
                          </div>

                          <TriStateAccessSwitch
                            value={state.access}
                            disabled={
                              isListLocked ||
                              Boolean(mutatingResourceIds[resource.id]) ||
                              isSubmitting
                            }
                            onChange={(access) =>
                              onSetResourceAccess(resource, access)
                            }
                          />
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {(activeTab === "all" ||
              activeTab === "allowed" ||
              activeTab === "view") && (
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
                                {resource.name}
                              </div>
                              {resource.subtitle ? (
                                <div className="truncate text-xs text-gray-500">
                                  {resource.subtitle}
                                </div>
                              ) : null}
                            </div>
                          </div>

                          <TriStateAccessSwitch
                            value={state.access}
                            disabled={
                              isListLocked ||
                              Boolean(mutatingResourceIds[resource.id]) ||
                              isSubmitting
                            }
                            onChange={(access) =>
                              onSetResourceAccess(resource, access)
                            }
                          />
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {isListLocked ? (
          <div className="pointer-events-auto absolute inset-0 z-10 flex items-center justify-center rounded-md">
            <div className="max-w-sm rounded-md border border-gray-200 bg-white/95 p-4 text-center shadow-sm">
              <p className="text-sm font-medium text-gray-900">
                Individual resource rules are locked while
                {bulkAccess === "allow" ? " Allow all" : " Deny all"} is active.
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Set bulk access to Default to edit individual resources.
              </p>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="mt-3"
                onClick={() =>
                  onSetManyResourceAccess(resetTargetResources, "default")
                }
              >
                Set to Default
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
