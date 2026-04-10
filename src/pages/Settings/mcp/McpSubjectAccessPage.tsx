import { getAllPlaybookNames } from "@flanksource-ui/api/services/playbooks";
import {
  addPermission,
  deletePermission,
  fetchAllPermissionSubjects,
  fetchMcpRunPermissions,
  MCP_SETTINGS_PERMISSION_SOURCE,
  PermissionSubject,
  updatePermission
} from "@flanksource-ui/api/services/permissions";
import { getAllViews } from "@flanksource-ui/api/services/views";
import { PermissionsSummary } from "@flanksource-ui/api/types/permissions";
import McpTabsLinks from "@flanksource-ui/components/MCP/McpTabsLinks";
import ResourceSelectorPanel, {
  McpSubjectResource,
  ResourceAccess
} from "@flanksource-ui/components/Permissions/ResourceSelectorPanel";
import SubjectAvatar from "@flanksource-ui/components/Permissions/SubjectAvatar";
import {
  toastError,
  toastSuccess
} from "@flanksource-ui/components/Toast/toast";
import { Input } from "@flanksource-ui/components/ui/input";
import { useUser } from "@flanksource-ui/context";
import { mapSubjectType } from "@flanksource-ui/lib/permissions/mcpPermissionCardMappings";
import useDebouncedValue from "@flanksource-ui/hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";

const SUBJECT_TYPE_ORDER: Record<PermissionSubject["type"], number> = {
  role: 0,
  permission_subject_group: 1,
  team: 2,
  person: 3,
  access_token_person: 4
};

const TYPE_LABELS: Record<PermissionSubject["type"], string> = {
  person: "person",
  access_token_person: "access token",
  team: "team",
  role: "role",
  permission_subject_group: "group"
};

function getPermissionRefs(
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
  const refs = getPermissionRefs(permission, resource.kind);

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

export default function McpSubjectAccessPage() {
  const { user } = useUser();
  const [subjectSearch, setSubjectSearch] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mutatingResourceIds, setMutatingResourceIds] = useState<
    Record<string, true>
  >({});
  const [isResourcePanelSwitching, setIsResourcePanelSwitching] =
    useState(false);

  const debouncedSearch = useDebouncedValue(subjectSearch, 200) ?? "";

  const {
    data: subjects = [],
    isLoading: isSubjectsLoading,
    isRefetching: isSubjectsRefetching,
    refetch: refetchSubjects
  } = useQuery({
    queryKey: ["mcp", "subject-access", "subjects"],
    queryFn: fetchAllPermissionSubjects
  });

  const {
    data: playbooks = [],
    isLoading: isPlaybooksLoading,
    isRefetching: isPlaybooksRefetching,
    refetch: refetchPlaybooks
  } = useQuery({
    queryKey: ["mcp", "subject-access", "playbooks"],
    queryFn: getAllPlaybookNames
  });

  const {
    data: viewsResponse,
    isLoading: isViewsLoading,
    isRefetching: isViewsRefetching,
    refetch: refetchViews
  } = useQuery({
    queryKey: ["mcp", "subject-access", "views"],
    queryFn: async () => getAllViews([{ id: "name", desc: false }], 0, 1000)
  });

  const {
    data: permissions = [],
    isLoading: isPermissionsLoading,
    isRefetching: isPermissionsRefetching,
    refetch: refetchPermissions
  } = useQuery({
    queryKey: ["mcp", "subject-access", "permissions"],
    queryFn: fetchMcpRunPermissions
  });

  const views = useMemo(() => viewsResponse?.data ?? [], [viewsResponse?.data]);

  const sortedSubjects = useMemo(() => {
    const loweredSearch = debouncedSearch.trim().toLowerCase();

    return subjects
      .filter((subject) => subject.type !== "access_token_person")
      .filter((subject) => {
        if (!loweredSearch) {
          return true;
        }

        return subject.name.toLowerCase().includes(loweredSearch);
      })
      .sort((a, b) => {
        const typeOrder =
          SUBJECT_TYPE_ORDER[a.type] - SUBJECT_TYPE_ORDER[b.type];
        if (typeOrder !== 0) {
          return typeOrder;
        }

        return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
      });
  }, [debouncedSearch, subjects]);

  const groupedSubjects = useMemo(() => {
    const grouped = new Map<PermissionSubject["type"], PermissionSubject[]>();

    for (const subject of sortedSubjects) {
      const list = grouped.get(subject.type) ?? [];
      list.push(subject);
      grouped.set(subject.type, list);
    }

    return Array.from(grouped.entries()).map(([type, list]) => ({
      type,
      list
    }));
  }, [sortedSubjects]);

  useEffect(() => {
    if (
      selectedSubjectId &&
      sortedSubjects.some((subject) => subject.id === selectedSubjectId)
    ) {
      return;
    }

    setSelectedSubjectId(sortedSubjects[0]?.id ?? null);
  }, [selectedSubjectId, sortedSubjects]);

  const selectedSubject = useMemo(
    () =>
      sortedSubjects.find((subject) => subject.id === selectedSubjectId) ??
      null,
    [selectedSubjectId, sortedSubjects]
  );

  useEffect(() => {
    if (!selectedSubject) {
      setIsResourcePanelSwitching(false);
      return;
    }

    setIsResourcePanelSwitching(true);
    const timer = setTimeout(() => {
      setIsResourcePanelSwitching(false);
    }, 220);

    return () => {
      clearTimeout(timer);
    };
  }, [selectedSubject?.id]);

  const resources = useMemo<McpSubjectResource[]>(() => {
    const playbookResources = playbooks
      .map((playbook) => ({
        id: playbook.id,
        kind: "playbook" as const,
        name: playbook.title || playbook.name,
        namespace: playbook.namespace,
        icon: playbook.icon || "playbook",
        subtitle: playbook.namespace
          ? `${playbook.namespace} · playbook`
          : "playbook"
      }))
      .sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
      );

    const viewResources = views
      .map((view) => ({
        id: view.id,
        kind: "view" as const,
        name: view.spec?.title || view.name,
        namespace: view.namespace,
        icon: view.spec?.icon || "workflow",
        subtitle: view.namespace ? `${view.namespace} · view` : "view"
      }))
      .sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
      );

    return [...playbookResources, ...viewResources];
  }, [playbooks, views]);

  const loading =
    isSubjectsLoading ||
    isPlaybooksLoading ||
    isViewsLoading ||
    isPermissionsLoading ||
    isSubjectsRefetching ||
    isPlaybooksRefetching ||
    isViewsRefetching ||
    isPermissionsRefetching ||
    isSubmitting;

  const isInitialLoading =
    (isSubjectsLoading ||
      isPlaybooksLoading ||
      isViewsLoading ||
      isPermissionsLoading) &&
    resources.length === 0;

  const setResourceAccess = async (
    subject: PermissionSubject,
    targetResource: McpSubjectResource,
    access: ResourceAccess,
    latestPermissions?: PermissionsSummary[]
  ) => {
    const currentPermissions =
      latestPermissions ?? (await fetchMcpRunPermissions());
    const subjectType = mapSubjectType(subject.type);

    const matchingPermissions = currentPermissions.filter(
      (permission) =>
        permission.action === "mcp:run" &&
        permission.source === MCP_SETTINGS_PERMISSION_SOURCE &&
        permission.subject === subject.id &&
        permission.subject_type === subjectType &&
        permission.id &&
        permissionMatchesResource(permission, targetResource)
    );

    if (access === "default") {
      await Promise.all(
        matchingPermissions.map((permission) =>
          deletePermission(permission.id!)
        )
      );
      return;
    }

    const deny = access === "deny";
    const [primaryPermission, ...duplicates] = matchingPermissions;

    if (!primaryPermission) {
      await addPermission({
        action: "mcp:run",
        object_selector: {
          [targetResource.kind === "playbook" ? "playbooks" : "views"]: [
            { name: targetResource.name, namespace: targetResource.namespace }
          ]
        },
        subject: subject.id,
        subject_type: subjectType,
        deny,
        source: MCP_SETTINGS_PERMISSION_SOURCE,
        created_by: user?.id
      } as any);
      return;
    }

    await Promise.all([
      ...(primaryPermission.deny === deny
        ? []
        : [
            updatePermission({
              id: primaryPermission.id,
              deny
            } as any)
          ]),
      ...duplicates.map((permission) => deletePermission(permission.id!))
    ]);
  };

  const applyAccess = async (
    targetResources: McpSubjectResource[],
    access: ResourceAccess
  ) => {
    if (!selectedSubject || targetResources.length === 0) {
      return;
    }

    const subjectType = mapSubjectType(selectedSubject.type);
    const targetKinds = [
      ...new Set(targetResources.map((resource) => resource.kind))
    ];

    setIsSubmitting(true);
    setMutatingResourceIds(
      Object.fromEntries(targetResources.map((resource) => [resource.id, true]))
    );

    try {
      const latestPermissions = await fetchMcpRunPermissions();

      if (targetResources.length > 1) {
        for (const kind of targetKinds) {
          const selectorKey = kind === "playbook" ? "playbooks" : "views";

          const existingForKind = latestPermissions.filter((permission) => {
            if (
              permission.action !== "mcp:run" ||
              permission.source !== MCP_SETTINGS_PERMISSION_SOURCE ||
              permission.subject !== selectedSubject.id ||
              permission.subject_type !== subjectType ||
              !permission.id
            ) {
              return false;
            }

            return getPermissionRefs(permission, kind).length > 0;
          });

          if (access === "default") {
            await Promise.all(
              existingForKind.map((permission) =>
                deletePermission(permission.id!)
              )
            );
            continue;
          }

          const deny = access === "deny";
          const wildcardPermissions = existingForKind.filter((permission) =>
            getPermissionRefs(permission, kind).some(
              (ref) => ref?.name === "*" && !ref?.namespace
            )
          );

          const [primaryWildcard, ...duplicateWildcards] = wildcardPermissions;

          if (!primaryWildcard) {
            await addPermission({
              action: "mcp:run",
              object_selector: {
                [selectorKey]: [{ name: "*" }]
              },
              subject: selectedSubject.id,
              subject_type: subjectType,
              deny,
              source: MCP_SETTINGS_PERMISSION_SOURCE,
              created_by: user?.id
            } as any);
          } else if (primaryWildcard.deny !== deny) {
            await updatePermission({
              id: primaryWildcard.id,
              deny
            } as any);
          }

          const wildcardIdsToKeep = new Set(
            primaryWildcard?.id ? [primaryWildcard.id] : []
          );

          const permissionIdsToDelete = [
            ...duplicateWildcards.map((permission) => permission.id!),
            ...existingForKind
              .filter((permission) => !wildcardIdsToKeep.has(permission.id!))
              .filter(
                (permission) =>
                  !wildcardPermissions.some(
                    (wildcard) => wildcard.id === permission.id
                  )
              )
              .map((permission) => permission.id!)
          ];

          if (permissionIdsToDelete.length > 0) {
            await Promise.all(
              permissionIdsToDelete.map((id) => deletePermission(id))
            );
          }
        }

        toastSuccess("Updated subject access");
      } else {
        await setResourceAccess(
          selectedSubject,
          targetResources[0],
          access,
          latestPermissions
        );
        toastSuccess("Updated subject access");
      }
    } catch (error) {
      toastError(error as any);
    } finally {
      setMutatingResourceIds({});
      setIsSubmitting(false);
      refetchPermissions();
    }
  };

  return (
    <McpTabsLinks
      activeTab="Subject access"
      loading={loading}
      isInitialLoading={isInitialLoading}
      loadingText="Loading MCP subject access..."
      onRefresh={() => {
        refetchSubjects();
        refetchPlaybooks();
        refetchViews();
        refetchPermissions();
      }}
    >
      <div className="flex h-full min-h-0 w-full flex-1 flex-col gap-4 p-6 pb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Subject access
          </h3>
          <p className="text-sm text-gray-600">
            See all playbooks and views a specific user, role, or group can
            access through this gateway.
          </p>
        </div>

        <div className="flex min-h-0 flex-1 gap-4">
          <div className="flex w-[320px] shrink-0 flex-col">
            <Input
              placeholder="Search subjects..."
              value={subjectSearch}
              onChange={(event) => setSubjectSearch(event.target.value)}
            />

            <div className="mt-3 min-h-0 flex-1 space-y-3 overflow-y-auto">
              {groupedSubjects.map((group) => (
                <div key={group.type} className="space-y-1">
                  <div className="px-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {TYPE_LABELS[group.type] ?? group.type}
                  </div>

                  {group.list.map((subject) => {
                    const isActive = subject.id === selectedSubjectId;

                    return (
                      <button
                        key={subject.id}
                        type="button"
                        onClick={() => setSelectedSubjectId(subject.id)}
                        className={`flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-sm transition-colors ${
                          isActive
                            ? "bg-blue-50 text-blue-800"
                            : "text-gray-800 hover:bg-gray-50"
                        }`}
                      >
                        <SubjectAvatar subject={subject} size="xs" />
                        <span className="truncate">{subject.name}</span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          <div className="min-h-0 min-w-0 flex-1 lg:max-w-3xl">
            {selectedSubject ? (
              <div className="relative h-full">
                <ResourceSelectorPanel
                  key={selectedSubject.id}
                  selectedSubject={selectedSubject}
                  resources={resources}
                  permissions={permissions}
                  isSubmitting={isSubmitting}
                  mutatingResourceIds={mutatingResourceIds}
                  onSetResourceAccess={(resource, access) =>
                    applyAccess([resource], access)
                  }
                  onSetManyResourceAccess={applyAccess}
                />

                {isResourcePanelSwitching ? (
                  <div className="pointer-events-none absolute inset-0 z-10 rounded-md bg-white/20 backdrop-blur-[1.5px]" />
                ) : null}
              </div>
            ) : (
              <div className="flex h-full items-center justify-center rounded-md border border-dashed border-gray-200 p-4 text-sm text-gray-500">
                Select a subject to inspect MCP resource access.
              </div>
            )}
          </div>
        </div>
      </div>
    </McpTabsLinks>
  );
}
