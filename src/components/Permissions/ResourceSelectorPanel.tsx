import {
  isSettingsManagedPermissionSource,
  PermissionSubject
} from "@flanksource-ui/api/services/permissions";
import { PermissionsSummary } from "@flanksource-ui/api/types/permissions";
import ResourceList from "@flanksource-ui/components/Permissions/ResourceList";
import SubjectAvatar from "@flanksource-ui/components/Permissions/SubjectAvatar";
import { Button } from "@flanksource-ui/components/ui/button";
import { Input } from "@flanksource-ui/components/ui/input";
import { mapSubjectType } from "@flanksource-ui/lib/permissions/mcpPermissionCardMappings";
import { useCallback, useMemo, useState } from "react";

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
      isSettingsManagedPermissionSource(permission.source) &&
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

function getResourceKey(resource: McpSubjectResource) {
  return `${resource.kind}:${resource.id}`;
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

  const accessByResourceKey = useMemo(() => {
    const byKey: Record<string, ResourceAccess> = {};

    for (const resource of filteredResources) {
      byKey[getResourceKey(resource)] = getAccessState(
        permissions,
        selectedSubject,
        resource
      ).access;
    }

    return byKey;
  }, [filteredResources, permissions, selectedSubject]);

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

  const bulkAccessByKind = useMemo(() => {
    const subjectType = mapSubjectType(selectedSubject.type);

    const getWildcardAccessByKind = (
      kind: "playbook" | "view"
    ): ResourceAccess => {
      const wildcardPermissions = permissions.filter((permission) => {
        if (
          permission.action !== "mcp:run" ||
          !isSettingsManagedPermissionSource(permission.source) ||
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

    return {
      playbook: getWildcardAccessByKind("playbook"),
      view: getWildcardAccessByKind("view")
    };
  }, [permissions, selectedSubject]);

  const onSetPlaybookBulkAccess = useCallback(
    (access: ResourceAccess) => {
      onSetManyResourceAccess(resourcesByType.playbooks, access);
    },
    [onSetManyResourceAccess, resourcesByType.playbooks]
  );

  const onSetViewBulkAccess = useCallback(
    (access: ResourceAccess) => {
      onSetManyResourceAccess(resourcesByType.views, access);
    },
    [onSetManyResourceAccess, resourcesByType.views]
  );

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
            <ResourceList
              title="Playbooks"
              emptyMessage="No playbooks found"
              defaultIcon="playbook"
              resources={resourcesByType.playbooks}
              bulkAccess={bulkAccessByKind.playbook}
              onBulkAccessChange={onSetPlaybookBulkAccess}
              accessByResourceKey={accessByResourceKey}
              effectiveAccessByResourceKey={effectiveAccessByResourceKey}
              hasEffectiveAccessResults={hasEffectiveAccessResults}
              getResourceKey={getResourceKey}
              isListLocked={bulkAccessByKind.playbook !== "default"}
              isSubmitting={isSubmitting}
              mutatingResourceIds={mutatingResourceIds}
              onSetResourceAccess={onSetResourceAccess}
            />

            <ResourceList
              title="Views"
              emptyMessage="No views found"
              defaultIcon="workflow"
              resources={resourcesByType.views}
              bulkAccess={bulkAccessByKind.view}
              onBulkAccessChange={onSetViewBulkAccess}
              accessByResourceKey={accessByResourceKey}
              effectiveAccessByResourceKey={effectiveAccessByResourceKey}
              hasEffectiveAccessResults={hasEffectiveAccessResults}
              getResourceKey={getResourceKey}
              isListLocked={bulkAccessByKind.view !== "default"}
              isSubmitting={isSubmitting}
              mutatingResourceIds={mutatingResourceIds}
              onSetResourceAccess={onSetResourceAccess}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
