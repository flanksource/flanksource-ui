import {
  addPermission,
  deletePermission,
  fetchSettingsManagedSubjectPermissions,
  INTERACTIVE_SETTINGS_PERMISSION_SOURCE,
  isSettingsManagedPermissionSource,
  PermissionSubject,
  updatePermission
} from "@flanksource-ui/api/services/permissions";
import { getAllPlaybookNames } from "@flanksource-ui/api/services/playbooks";
import { fetchEffectiveSubjectResourceAccess } from "@flanksource-ui/api/services/rbac";
import { getAllViews } from "@flanksource-ui/api/services/views";
import { getAll } from "@flanksource-ui/api/schemaResources";
import { PermissionsSummary } from "@flanksource-ui/api/types/permissions";
import { Connection } from "@flanksource-ui/components/Connections/ConnectionFormModal";
import EffectiveMatrixCell from "@flanksource-ui/components/Permissions/SubjectPermissions/EffectiveMatrixCell";
import MatrixDrawer from "@flanksource-ui/components/Permissions/SubjectPermissions/MatrixDrawer";
import ResourceTypeMatrixSection from "@flanksource-ui/components/Permissions/SubjectPermissions/ResourceTypeMatrixSection";
import SubjectAvatar from "@flanksource-ui/components/Permissions/SubjectAvatar";
import {
  toastError,
  toastSuccess
} from "@flanksource-ui/components/Toast/toast";
import { Input } from "@flanksource-ui/components/ui/input";
import { useUser } from "@flanksource-ui/context";
import { mapSubjectType } from "@flanksource-ui/lib/permissions/mcpPermissionCardMappings";
import { SchemaApi } from "@flanksource-ui/components/SchemaResourcePage/resourceTypes";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";

type AccessValue = "allow" | "deny" | "default";
type ResourceKind = "playbook" | "view" | "connection";
type EffectiveState = "allowed" | "denied" | "unknown";

const RESOURCE_KIND_ORDER: ResourceKind[] = ["playbook", "view", "connection"];

const RESOURCE_KIND_CONFIG: Record<
  ResourceKind,
  {
    label: string;
    actions: string[];
    selectorKey: "playbooks" | "views" | "connections";
  }
> = {
  playbook: {
    label: "Playbooks",
    actions: [
      "read",
      "playbook:run",
      "playbook:cancel",
      "playbook:approve",
      "mcp:run"
    ],
    selectorKey: "playbooks"
  },
  view: {
    label: "Views",
    actions: ["read", "mcp:run"],
    selectorKey: "views"
  },
  connection: {
    label: "Connections",
    actions: ["read"],
    selectorKey: "connections"
  }
};

type PermissionResource = {
  id: string;
  kind: ResourceKind;
  name: string;
  displayName: string;
  namespace?: string;
  icon?: string;
  subtitle?: string;
  selectorKey: "playbooks" | "views" | "connections";
  actions: string[];
};

type EffectiveAccessMap = Record<string, EffectiveState>;

type DirectAccessState = {
  access: AccessValue;
  isReadOnly: boolean;
  source?: string;
  isWildcard: boolean;
};

const DEFAULT_DIRECT_STATE: DirectAccessState = {
  access: "default",
  isReadOnly: false,
  isWildcard: false
};

const connectionsSchema: SchemaApi = {
  table: "connections",
  api: "canary-checker",
  name: "Connections"
};

function getResourceActionKey(resource: PermissionResource, action: string) {
  return `${resource.kind}:${resource.id}:${action}`;
}

function getRefsForPermission(
  permission: PermissionsSummary,
  selectorKey: PermissionResource["selectorKey"]
) {
  return permission.object_selector?.[selectorKey] ?? [];
}

function selectorRefMatchesResource(
  ref: { name?: string; namespace?: string },
  resource: PermissionResource
) {
  if (!ref?.name) {
    return false;
  }

  if (ref.name === "*" && !ref.namespace) {
    return true;
  }

  if (ref.namespace) {
    return ref.namespace === resource.namespace && ref.name === resource.name;
  }

  return ref.name === resource.name;
}

function selectorRefIsWildcard(ref: { name?: string; namespace?: string }) {
  return ref?.name === "*" && !ref?.namespace;
}

function getPermissionSourcePriority(permission: PermissionsSummary) {
  if (isSettingsManagedPermissionSource(permission.source)) {
    return 0;
  }

  return 1;
}

function sortCanonicalPermissions(permissions: PermissionsSummary[]) {
  return [...permissions].sort((a, b) => {
    const sourceDiff =
      getPermissionSourcePriority(a) - getPermissionSourcePriority(b);

    if (sourceDiff !== 0) {
      return sourceDiff;
    }

    return (a.id ?? "").localeCompare(b.id ?? "");
  });
}

function getDirectAccessState(
  permissions: PermissionsSummary[],
  subject: PermissionSubject,
  resource: PermissionResource,
  action: string
): DirectAccessState {
  const subjectType = mapSubjectType(subject.type);

  const matchingPermissions = permissions.filter((permission) => {
    if (
      permission.action !== action ||
      permission.subject !== subject.id ||
      permission.subject_type !== subjectType
    ) {
      return false;
    }

    return getRefsForPermission(permission, resource.selectorKey).some((ref) =>
      selectorRefMatchesResource(ref, resource)
    );
  });

  if (matchingPermissions.length === 0) {
    return DEFAULT_DIRECT_STATE;
  }

  const isReadOnly = matchingPermissions.some(
    (permission) => permission.source === "KubernetesCRD"
  );
  const isWildcard = matchingPermissions.some((permission) =>
    getRefsForPermission(permission, resource.selectorKey).some(
      selectorRefIsWildcard
    )
  );

  return {
    access: matchingPermissions.some((permission) => permission.deny === true)
      ? "deny"
      : "allow",
    isReadOnly,
    source: matchingPermissions[0]?.source,
    isWildcard
  };
}

function groupResourcesByType(resources: PermissionResource[]) {
  const grouped = new Map<ResourceKind, PermissionResource[]>();

  for (const resource of resources) {
    const list = grouped.get(resource.kind) ?? [];
    list.push(resource);
    grouped.set(resource.kind, list);
  }

  return RESOURCE_KIND_ORDER.map((kind) => ({
    kind,
    label: RESOURCE_KIND_CONFIG[kind].label,
    actions: RESOURCE_KIND_CONFIG[kind].actions,
    resources: grouped.get(kind) ?? []
  })).filter((group) => group.resources.length > 0);
}

export default function SubjectPermissionsWorkbench({
  selectedSubject
}: {
  selectedSubject: PermissionSubject;
}) {
  const { user } = useUser();

  const [search, setSearch] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedResource, setSelectedResource] =
    useState<PermissionResource | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const isSelectedResource = (resource: PermissionResource) => {
    return Boolean(
      selectedResource &&
        selectedResource.id === resource.id &&
        selectedResource.kind === resource.kind
    );
  };

  const { data: playbooks = [], isLoading: isLoadingPlaybooks } = useQuery({
    queryKey: ["permissions-subjects", "playbooks"],
    queryFn: getAllPlaybookNames,
    staleTime: 60_000
  });

  const { data: viewsResponse, isLoading: isLoadingViews } = useQuery({
    queryKey: ["permissions-subjects", "views"],
    queryFn: async () => getAllViews([{ id: "name", desc: false }], 0, 2000),
    staleTime: 60_000
  });

  const { data: connections = [], isLoading: isLoadingConnections } = useQuery({
    queryKey: ["permissions-subjects", "connections"],
    queryFn: async () => {
      const response = await getAll(connectionsSchema);
      return (response.data ?? []) as unknown as Connection[];
    },
    staleTime: 60_000
  });

  const {
    data: permissions = [],
    isLoading: isLoadingPermissions,
    refetch: refetchPermissions
  } = useQuery({
    queryKey: [
      "permissions-subjects",
      "subject-managed-permissions",
      selectedSubject.id
    ],
    queryFn: () => fetchSettingsManagedSubjectPermissions(selectedSubject.id),
    keepPreviousData: true
  });

  const views = useMemo(() => viewsResponse?.data ?? [], [viewsResponse?.data]);

  const allResources = useMemo<PermissionResource[]>(() => {
    const playbookResources = playbooks.map((playbook) => ({
      id: playbook.id,
      kind: "playbook" as const,
      name: playbook.name,
      displayName: playbook.title || playbook.name,
      namespace: playbook.namespace,
      icon: playbook.icon || "playbook",
      subtitle: playbook.namespace
        ? `${playbook.namespace} · playbook`
        : "playbook",
      selectorKey: RESOURCE_KIND_CONFIG.playbook.selectorKey,
      actions: RESOURCE_KIND_CONFIG.playbook.actions
    }));

    const viewResources = views.map((view) => ({
      id: view.id,
      kind: "view" as const,
      name: view.name,
      displayName: view.spec?.title || view.name,
      namespace: view.namespace,
      icon: view.spec?.icon || "workflow",
      subtitle: view.namespace ? `${view.namespace} · view` : "view",
      selectorKey: RESOURCE_KIND_CONFIG.view.selectorKey,
      actions: RESOURCE_KIND_CONFIG.view.actions
    }));

    const connectionResources = connections
      .filter(
        (connection): connection is Connection & { id: string; name: string } =>
          Boolean(connection.id && connection.name)
      )
      .map((connection) => ({
        id: connection.id,
        kind: "connection" as const,
        name: connection.name,
        displayName: connection.name,
        namespace: connection.namespace,
        icon: connection.type || "connection",
        subtitle: connection.namespace
          ? `${connection.namespace} · ${connection.type || "connection"}`
          : connection.type || "connection",
        selectorKey: RESOURCE_KIND_CONFIG.connection.selectorKey,
        actions: RESOURCE_KIND_CONFIG.connection.actions
      }));

    return [
      ...playbookResources,
      ...viewResources,
      ...connectionResources
    ].sort((a, b) => {
      const typeDiff =
        RESOURCE_KIND_ORDER.indexOf(a.kind) -
        RESOURCE_KIND_ORDER.indexOf(b.kind);
      if (typeDiff !== 0) {
        return typeDiff;
      }

      return a.displayName.localeCompare(b.displayName, undefined, {
        sensitivity: "base"
      });
    });
  }, [connections, playbooks, views]);
  const directAccessByResourceAction = useMemo(() => {
    return Object.fromEntries(
      allResources.flatMap((resource) =>
        resource.actions.map((action) => [
          getResourceActionKey(resource, action),
          getDirectAccessState(permissions, selectedSubject, resource, action)
        ])
      )
    ) as Record<string, DirectAccessState>;
  }, [allResources, permissions, selectedSubject]);

  const normalizedSearch = search.trim().toLowerCase();

  const filteredResources = useMemo(() => {
    return allResources.filter((resource) => {
      if (!normalizedSearch) {
        return true;
      }

      return `${resource.displayName} ${resource.name} ${resource.namespace || ""}`
        .toLowerCase()
        .includes(normalizedSearch);
    });
  }, [allResources, normalizedSearch]);

  const groupedResources = useMemo(
    () => groupResourcesByType(filteredResources),
    [filteredResources]
  );

  const effectiveCheckScopeKey = useMemo(
    () =>
      `${selectedSubject.id}:${normalizedSearch}:${filteredResources
        .map(
          (resource) =>
            `${resource.kind}:${resource.id}:${resource.actions.join(",")}`
        )
        .join("|")}`,
    [filteredResources, normalizedSearch, selectedSubject.id]
  );

  const {
    data: effectiveAccessByAction = {},
    isFetching: isCheckingEffectiveAccess
  } = useQuery({
    queryKey: [
      "permissions-subjects",
      "effective-access",
      selectedSubject.id,
      effectiveCheckScopeKey
    ],
    enabled: filteredResources.length > 0,
    queryFn: async () => {
      const byAction = new Map<
        string,
        Array<{ id: string; type: ResourceKind }>
      >();

      for (const resource of filteredResources) {
        for (const action of resource.actions) {
          const list = byAction.get(action) ?? [];
          list.push({
            id: resource.id,
            type: resource.kind
          });
          byAction.set(action, list);
        }
      }

      const next: EffectiveAccessMap = {};
      let hasEffectiveAccessFetchFailure = false;

      await Promise.all(
        Array.from(byAction.entries()).map(async ([action, resources]) => {
          try {
            const response = await fetchEffectiveSubjectResourceAccess({
              subject: selectedSubject.id,
              action: action as any,
              resources
            });

            for (const result of response.results ?? []) {
              next[`${result.resourceType}:${result.resourceId}:${action}`] =
                result.allowed ? "allowed" : "denied";
            }
          } catch {
            hasEffectiveAccessFetchFailure = true;
            for (const resource of resources) {
              next[`${resource.type}:${resource.id}:${action}`] = "unknown";
            }
          }
        })
      );

      if (hasEffectiveAccessFetchFailure) {
        toast.error(
          "Failed to check effective access. Showing unknown state.",
          { id: "subject-permissions-effective-access-failed" }
        );
      }

      return next;
    },
    keepPreviousData: true
  });

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    setSelectedResource(null);
  }, [selectedSubject.id]);

  useEffect(() => {
    if (!selectedResource) {
      return;
    }

    if (
      !filteredResources.some(
        (resource) =>
          resource.id === selectedResource.id &&
          resource.kind === selectedResource.kind
      )
    ) {
      setSelectedResource(null);
    }
  }, [filteredResources, selectedResource]);

  const setPermissionAccess = async (
    resource: PermissionResource,
    action: string,
    access: AccessValue
  ) => {
    setIsSubmitting(true);

    try {
      const latestPermissions = await fetchSettingsManagedSubjectPermissions(
        selectedSubject.id
      );
      const subjectType = mapSubjectType(selectedSubject.type);

      const matchingPermissions = sortCanonicalPermissions(
        latestPermissions.filter((permission) => {
          if (
            permission.action !== action ||
            permission.subject !== selectedSubject.id ||
            permission.subject_type !== subjectType ||
            !permission.id
          ) {
            return false;
          }

          return getRefsForPermission(permission, resource.selectorKey).some(
            (ref) => {
              if (!ref?.name || ref.name === "*") {
                return false;
              }

              if (ref.namespace) {
                return (
                  ref.namespace === resource.namespace &&
                  ref.name === resource.name
                );
              }

              return ref.name === resource.name;
            }
          );
        })
      );

      if (access === "default") {
        await Promise.all(
          matchingPermissions.map((permission) =>
            deletePermission(permission.id!)
          )
        );
      } else {
        const deny = access === "deny";
        const [primary, ...duplicates] = matchingPermissions;

        if (!primary) {
          await addPermission({
            action,
            object_selector: {
              [resource.selectorKey]: [
                { name: resource.name, namespace: resource.namespace }
              ]
            },
            subject: selectedSubject.id,
            subject_type: subjectType,
            deny,
            source: INTERACTIVE_SETTINGS_PERMISSION_SOURCE,
            created_by: user?.id
          } as any);
        } else {
          if (primary.deny !== deny) {
            await updatePermission({ id: primary.id, deny } as any);
          }

          if (duplicates.length > 0) {
            await Promise.all(
              duplicates.map((permission) => deletePermission(permission.id!))
            );
          }
        }
      }

      toastSuccess("Updated permission");
      await refetchPermissions();
    } catch (error) {
      toastError(error as any);
    } finally {
      setIsSubmitting(false);
    }
  };

  const loading =
    isLoadingPlaybooks ||
    isLoadingViews ||
    isLoadingConnections ||
    isLoadingPermissions;

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
      <div className="flex items-center gap-2 px-4">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <SubjectAvatar subject={selectedSubject} size="md" />
          <div className="flex min-w-0 items-baseline gap-2">
            <div className="truncate text-base font-semibold text-gray-900">
              {selectedSubject.name}
            </div>
          </div>
        </div>

        <div className="w-full max-w-[360px]">
          <Input
            placeholder="Search resources..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-4 px-4 py-4">
        <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto pr-1">
          {loading ? (
            <div className="flex items-center gap-2 rounded-md border border-dashed border-gray-200 p-4 text-sm text-gray-500">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
              Loading subject access...
            </div>
          ) : groupedResources.length === 0 ? (
            <div className="rounded-md border border-dashed border-gray-200 p-6 text-sm text-gray-500">
              No resources match the current filters.
            </div>
          ) : (
            <div className="space-y-5">
              {groupedResources.map((group) => (
                <ResourceTypeMatrixSection
                  key={group.kind}
                  title={group.label}
                  count={group.resources.length}
                  actions={group.actions}
                  rows={group.resources}
                  isRefreshing={isCheckingEffectiveAccess}
                  onRowClick={(resource) => {
                    setSelectedResource((current) => {
                      if (
                        current?.id === resource.id &&
                        current.kind === resource.kind
                      ) {
                        return null;
                      }

                      return resource;
                    });
                  }}
                  isRowSelected={(resource) => isSelectedResource(resource)}
                  isRowExpanded={(resource) => isSelectedResource(resource)}
                  renderExpandedRow={(resource) => (
                    <MatrixDrawer
                      rows={resource.actions.map((action) => {
                        const key = getResourceActionKey(resource, action);
                        const direct =
                          directAccessByResourceAction[key] ??
                          DEFAULT_DIRECT_STATE;

                        return {
                          key: `${resource.id}:${action}`,
                          action,
                          effectiveState:
                            effectiveAccessByAction[key] ?? "unknown",
                          access: direct.access,
                          source: direct.source,
                          isReadOnly: direct.isReadOnly,
                          isWildcard: direct.isWildcard,
                          disabled: isSubmitting,
                          onChange: (next) => {
                            void setPermissionAccess(resource, action, next);
                          }
                        };
                      })}
                    />
                  )}
                  renderCell={(resource, action) => {
                    if (!resource.actions.includes(action)) {
                      return <span className="text-xs text-gray-300">—</span>;
                    }

                    return (
                      <EffectiveMatrixCell
                        state={
                          effectiveAccessByAction[
                            getResourceActionKey(resource, action)
                          ] ?? "unknown"
                        }
                        notChecked={false}
                      />
                    );
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
